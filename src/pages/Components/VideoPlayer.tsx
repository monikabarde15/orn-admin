"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Award, Star } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../pages/Components/Navbar";
import Footer from "../../pages/Components/Footer";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logoimg from "../../../public/assets/orllogo.png";

/* ================= TYPES ================= */
interface QuizOption {
  id: number;
  text: string;
  is_correct: boolean;
}

interface Quiz {
  id: number;
  question: string;
  options: QuizOption[];
}

interface Chapter {
  id: string;
  video?: string | null;
  file?: string | null;
  quizzes?: Quiz[];
}

interface Module {
  id: string;
  title: string;
  chapters: Chapter[];
}

interface FlowItem {
  type: "video" | "pdf" | "quiz";
  data: any;
  moduleId: string;
}

type Step = "learning" | "review" | "certificate";

/* ================= MAIN ================= */
export default function CourseTestFinal() {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();
const getCookie = (name: string) => {
    const v = `; ${document.cookie}`;
    const parts = v.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
    return "";
  };
  const VIT = import.meta.env.VITE_API_URL;
const API_V1 = `${VIT}/api/v1`;
const token =
    getCookie("access") || localStorage.getItem("access") || "";

  const userId = getCookie("user_id");
  /* ================= AUTH ================= */
  // const token =
  //   localStorage.getItem("access") ||
  //   document.cookie
  //     .split("; ")
  //     .find((r) => r.startsWith("access="))
  //     ?.split("=")[1];

  // const userId = localStorage.getItem("user_id");

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  /* ================= STATE ================= */
  const [modules, setModules] = useState<Module[]>([]);
  const [flow, setFlow] = useState<FlowItem[]>([]);
  const [flowIndex, setFlowIndex] = useState(0);
  const [step, setStep] = useState<Step>("learning");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
const [progressId, setProgressId] = useState<number | null>(null);
const [loadingProgress, setLoadingProgress] = useState(true);
const [certLoading, setCertLoading] = useState(false);
const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const current = flow[flowIndex];
  const isActive = (idx: number) => idx === flowIndex;
  const isCompleted = (idx: number) => idx < flowIndex;

  /* ================= FLOW ================= */
  const buildFlow = (modules: Module[]): FlowItem[] => {
    const items: FlowItem[] = [];

    modules.forEach((m) => {
      m.chapters.forEach((c) => {
        if (c.video?.endsWith(".mp4")) {
          items.push({
            type: "video",
            data: "https://" + c.video,
            moduleId: m.id,
          });
        }

        if (c.file?.endsWith(".pdf")) {
          items.push({
            type: "pdf",
            data: "https://" + c.file,
            moduleId: m.id,
          });
        }

        c.quizzes?.forEach((q) => {
          items.push({
            type: "quiz",
            data: q,
            moduleId: m.id,
          });
        });
      });
    });

    return items;
  };

  const sortModulesForVideoFirst = (modules: Module[]) =>
    [...modules].sort((a, b) => {
      const aHasVideo = a.chapters.some((c) => c.video?.endsWith(".mp4"));
      const bHasVideo = b.chapters.some((c) => c.video?.endsWith(".mp4"));
      if (aHasVideo && !bHasVideo) return -1;
      if (!aHasVideo && bHasVideo) return 1;
      return 0;
    });

  /* ================= FETCH COURSE ================= */
  useEffect(() => {
    api.get(`/course/courses/${courseId}/`).then((res) => {
      const mapped: Module[] = res.data.modules.map((m: any) => ({
        id: String(m.id),
        title: m.title,
        chapters: m.chapters,
      }));

      const sorted = sortModulesForVideoFirst(mapped);
      setModules(sorted);
      setFlow(buildFlow(sorted));
      setFlowIndex(0);
      setStep("learning");
    });
  }, [courseId]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (current?.type !== "quiz" || step !== "learning") return;

    setTimeLeft(60);
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleNext();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [flowIndex, step]);

  /* ================= NAV ================= */
  const handleNext = async () => {
  const nextIndex = flowIndex + 1;

  if (nextIndex < flow.length) {
    setFlowIndex(nextIndex);
    await saveProgress(nextIndex, false);
  } else {
    await saveProgress(flowIndex, true);
    setStep("review");
  }
};

useEffect(() => {
  if (!courseId || !userId) return;

  const loadProgress = async () => {
    try {
      const res = await api.get(
        `/course/progress/?course=${courseId}&user=${userId}`
      );

      if (res.data.length > 0) {
        const p = res.data[0];
        setProgressId(p.id);
        setFlowIndex(p.current_index || 0);
      }
    } catch (err) {
      console.error("Progress fetch error", err);
    } finally {
      setLoadingProgress(false);
    }
  };

  loadProgress();
}, [courseId, userId]);
const saveProgress = async (index: number, completed = false) => {
  if (!userId || !courseId) return;

  const payload = {
    course: courseId,
    user: userId,
    current_index: index,
    completed,
  };

  try {
    if (progressId) {
      await api.patch(`/course/progress/${progressId}/`, payload);
    } else {
      const res = await api.post(`/course/progress/`, payload);
      setProgressId(res.data.id);
    }
  } catch (err) {
    console.error("Progress save error", err);
  }
};

  /* ================= FEEDBACK ================= */
  const submitFeedback = async () => {
    if (!feedback.trim()) return alert("Please write feedback");
    if (!userId) return alert("User not logged in");

    await api.post("/api/feedback/feedback_vc/", {
      course: courseId,
      rating,
      description: feedback.trim(),
      user: userId,
    });

    setStep("certificate");
    await saveProgress(flow.length - 1, true);

  };

  /* ================= CERTIFICATE ================= */
  const generateCertificateFile = async () => {
  const el = document.getElementById("certificate-html");

  if (!el) {
    console.error("Certificate HTML missing");
    throw new Error("Certificate HTML not found");
  }

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("landscape", "px", "a4");
  pdf.addImage(
    imgData,
    "PNG",
    0,
    0,
    pdf.internal.pageSize.getWidth(),
    pdf.internal.pageSize.getHeight()
  );

  return new File([pdf.output("blob")], "certificate.pdf", {
    type: "application/pdf",
  });
};
const generateCertificate = async () => {
  try {
    if (!userId) {
      alert("User not logged in");
      return;
    }

    setCertLoading(true); // loader ON

    const file = await generateCertificateFile();
    const today = new Date().toISOString().split("T")[0];

    const formData = new FormData();
    formData.append("certificate", file);
    formData.append("title", "Certificate of Completion");
    formData.append("issue_date", today);
    formData.append("is_active", "true");
    formData.append("course", String(courseId));
    formData.append("user", userId);

    const res = await axios.post(
      `${VIT}/certificate/certificate/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ NEW certificate created
    navigate(`/certificate-view/${res.data.id}`);
  } catch (error: any) {
    console.error("CERTIFICATE ERROR", error);

    // ✅ HANDLE: Certificate already exists
    const bunnyError = error?.response?.data?.bunny_error;

    if (bunnyError) {
      try {
        // backend string ko object me convert
        const parsed =
          typeof bunnyError === "string"
            ? JSON.parse(
                bunnyError.replace(/'/g, '"') // 🔥 important
              )
            : bunnyError;

        if (parsed?.certificate_id) {
          // 🔥 Existing certificate → redirect
          navigate(`/certificate-view/${parsed.certificate_id}`);
          return;
        }
      } catch (e) {
        console.error("Error parsing bunny_error", e);
      }
    }

    // ❌ real error case
    alert("Certificate generate nahi ho paya");
  } finally {
    setCertLoading(false); // loader OFF
  }
};


const handlePrev = () => {
  if (flowIndex > 0) {
    setFlowIndex((p) => p - 1);
    setStep("learning");
  }
};



const SidebarItem = ({
  label,
  target,
}: {
  label: string;
  target: (item: FlowItem) => boolean;
}) => {
  const idx = flow.findIndex(target);
  if (idx === -1) return null;

  return (
    <button
      onClick={async () => {
        setFlowIndex(idx);
        setStep("learning");
        await saveProgress(idx, false);
      }}
      className={`w-full text-left px-3 py-2 rounded-md text-sm flex justify-between
        ${
          isActive(idx)
            ? "bg-purple-700 text-white"
            : isCompleted(idx)
            ? "text-green-400"
            : "text-slate-400 hover:bg-slate-800"
        }`}
    >
      <span>{label}</span>
      <span>
        {isCompleted(idx) && "✔"}
        {isActive(idx) && "➜"}
      </span>
    </button>
  );
};

  /* ================= UI ================= */
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#020617] text-white px-6 py-6">
        <div
  className={`grid grid-cols-1 gap-0 transition-all duration-300 ${
    isSidebarOpen
      ? "lg:grid-cols-[280px_1fr]"
      : "lg:grid-cols-[0px_1fr]"
  }`}
>


          {/* SIDEBAR */}
         <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 h-[70vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-purple-300 font-semibold text-lg">
              📚 Course
            </h3>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-slate-400 hover:text-white text-sm"
            >
              ✖
            </button>
        </div>


  {modules.map((module) => (
    <div
      key={module.id}
      className="mb-6 border border-slate-800 rounded-lg p-3"
    >
      {/* MODULE */}
      <p className="font-semibold text-white mb-3 flex items-center gap-2">
        📦 {module.title}
      </p>

      {module.chapters.map((chapter) => (
        <div key={chapter.id} className="ml-2 mb-4">

          {/* CHAPTER */}
          <div className="bg-slate-800/60 rounded-md px-3 py-2 mb-2">
           <p className="text-sm font-medium text-purple-300 flex justify-between">
  {chapter.title}
  <span className="text-xs text-slate-400">
    {chapter.quizzes?.length || 0} Quiz
  </span>
</p>

          </div>

          <div className="ml-3 space-y-1">

            {chapter.video && (
              <SidebarItem
                label="🎥 Video Lecture"
                target={(f) =>
                  f.type === "video" && f.data.includes(chapter.video!)
                }
              />
            )}

            {chapter.file && (
              <SidebarItem
                label="📄 Study Material"
                target={(f) =>
                  f.type === "pdf" && f.data.includes(chapter.file!)
                }
              />
            )}

           {chapter.quizzes?.map((quiz, i) => (
  <SidebarItem
    key={quiz.id}
    label={`❓ ${i + 1}. ${quiz.question}`}
    target={(f) =>
      f.type === "quiz" && f.data.id === quiz.id
    }
  />
))}

          </div>
        </div>
      ))}
    </div>
  ))}
</div>


          {/* MAIN */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
{!isSidebarOpen && (
  <button
    onClick={() => setIsSidebarOpen(true)}
    className="mb-4 inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm"
  >
    📚 Open
  </button>
)}

            {current?.type === "quiz" && step === "learning" && (
              <div className="flex justify-end mb-4 text-purple-300">
                ⏱ {timeLeft}s
              </div>
            )}

           {current?.type === "video" && step === "learning" && (
  <>
    <div className="flex justify-center w-full">
  <div className="w-full max-w-6xl px-4">
    <div className="bg-black rounded-xl overflow-hidden shadow-lg h-[60vh] max-h-[520px]">
      <video
        src={current.data}
        controls
        className="w-full h-full object-contain"
      />
    </div>
  </div>
</div>


    <div className="flex justify-between mt-4">
      <button
        onClick={handlePrev}
        disabled={flowIndex === 0}
        className="bg-slate-700 disabled:opacity-40 px-6 py-2 rounded-lg"
      >
        ← Previous
      </button>

      <button
        onClick={handleNext}
        className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg"
      >
        Next →
      </button>
    </div>
  </>
)}


            {current?.type === "pdf" && step === "learning" && (
  <>
    <div className="flex justify-center">
      <div className="w-full max-w-5xl h-[70vh] border border-slate-700 rounded-xl overflow-hidden">
        <iframe src={current.data} className="w-full h-full" />
      </div>
    </div>

    <div className="flex justify-between mt-4">
      <button
        onClick={handlePrev}
        disabled={flowIndex === 0}
        className="bg-slate-700 disabled:opacity-40 px-6 py-2 rounded-lg"
      >
        ← Previous
      </button>

      <button
        onClick={handleNext}
        className="bg-purple-600 px-6 py-2 rounded-lg"
      >
        Next →
      </button>
    </div>
  </>
)}


           {current?.type === "quiz" && step === "learning" && current.data && (
  <>
    <h2 className="text-xl font-semibold mb-4">
      {current.data.question}
    </h2>

    {Array.isArray(current.data.options) &&
      current.data.options.map((o: QuizOption) => (
        <label
          key={o.id}
          className="block border border-slate-700 p-3 rounded-lg mb-3 cursor-pointer"
        >
          <input
            type="radio"
            className="mr-2"
            name={`quiz-${current.data.id}`}
            checked={answers[current.data.id] === o.id}
            onChange={() =>
              setAnswers((prev) => ({
                ...prev,
                [current.data.id]: o.id,
              }))
            }
          />
          {o.text}
        </label>
      ))}
  <div className="flex justify-between mt-4">
      <button
        onClick={handlePrev}
        disabled={flowIndex === 0}
        className="bg-slate-700 disabled:opacity-40 px-6 py-2 rounded-lg"
      >
        ← Previous
      </button>

      <button
        onClick={handleNext}
        className="bg-purple-600 px-6 py-2 rounded-lg"
      >
        Next →
      </button>
    </div>
  </>
)}


            {step === "review" && (
              <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8">
                <div className="border border-slate-800 rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-4 text-purple-300">
                    Answer Sheet
                  </h2>

                  {flow
                    .filter((f) => f.type === "quiz")
                    .map((q: any, i) => (
                      <div key={i} className="mb-4">
                        <p className="font-semibold mb-2">
                          Q{i + 1}. {q.data.question}
                        </p>

                        {q.data.options.map((opt: any) => {
                          const selected = answers[q.data.id] === opt.id;
                          const correct = opt.is_correct;

                          return (
                            <div
                              key={opt.id}
                              className={`p-2 rounded mb-1 text-sm
                                ${
                                  correct
                                    ? "bg-green-600/20"
                                    : selected
                                    ? "bg-red-600/20"
                                    : "bg-slate-800"
                                }`}
                            >
                              {opt.text}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                </div>

                <div className="border border-slate-800 rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-4 text-purple-300">
                    Feedback
                  </h2>

                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        onClick={() => setRating(i)}
                        className={`cursor-pointer ${
                          i <= rating ? "text-yellow-400" : "text-slate-500"
                        }`}
                      />
                    ))}
                  </div>

                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full p-3 rounded bg-slate-800 border border-slate-700"
                    placeholder="Write your feedback..."
                  />

                  <button
                    onClick={submitFeedback}
                    className="bg-purple-600 px-8 py-3 rounded-lg mt-4"
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            )}

           {step === "certificate" && (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 w-full max-w-xl text-center shadow-xl">
      
      <Award size={72} className="mx-auto text-yellow-400 mb-6" />

      <h2 className="text-2xl font-bold mb-2">
        Course Completed!
      </h2>

      <p className="text-slate-300 mb-6">
        You have successfully completed this course.
        Click below to generate your certificate.
      </p>

     <button
  onClick={generateCertificate}
  disabled={certLoading}
  className={`w-full py-3 rounded-lg text-lg font-semibold flex items-center justify-center gap-2
    ${
      certLoading
        ? "bg-purple-600/70 cursor-not-allowed"
        : "bg-purple-600 hover:bg-purple-700"
    }`}
>
  {certLoading ? (
    <>
      <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      Generating Certificate...
    </>
  ) : (
    "Generate Certificate"
  )}
</button>

    </div>
  </div>
)}

          </div>
        </div>
      </div>
<div
  id="certificate-html"
  style={{
    position: "fixed",
    top: "-10000px",
    left: "-10000px",
    width: "1120px",
    height: "790px",
    background: "white",
    padding: "40px",
  }}
>
  <img src={logoimg} style={{ width: "120px" }} />
  <h1 style={{ fontSize: "32px", color: "#000" }}>
    Certificate of Completion
  </h1>
  <p style={{ color: "#000" }}>
    This certifies that the user has successfully completed the course.
  </p>
</div>


      <Footer />
    </>
  );

  
}
