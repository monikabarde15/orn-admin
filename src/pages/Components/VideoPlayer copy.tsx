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

  /* ================= AUTH ================= */
  const token =
    localStorage.getItem("access") ||
    document.cookie
      .split("; ")
      .find((r) => r.startsWith("access="))
      ?.split("=")[1];

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
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

  const api = axios.create({
    baseURL: `${VIT}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
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

  const current = flow[flowIndex];

  const isActive = (idx: number) => idx === flowIndex;
  const isCompleted = (idx: number) => idx < flowIndex;

  /* ================= FLOW BUILDER ================= */
  const buildFlow = (modules: Module[]): FlowItem[] => {
  const result: FlowItem[] = [];

  modules.forEach((m) => {
    m.chapters.forEach((c) => {

      // 1️⃣ VIDEO (sabse pehle)
      if (c.video && c.video.endsWith(".mp4")) {
        result.push({
          type: "video",
          data: "https://" + c.video,
          moduleId: m.id,
        });
      }

      // 2️⃣ PDF
      if (c.file && c.file.endsWith(".pdf")) {
        result.push({
          type: "pdf",
          data: "https://" + c.file,
          moduleId: m.id,
        });
      }

      // 3️⃣ QUIZ
      c.quizzes?.forEach((q) => {
        result.push({
          type: "quiz",
          data: q,
          moduleId: m.id,
        });
      });

    });
  });

  return result;
};
const sortModulesForVideoFirst = (modules: Module[]) => {
  return [...modules].sort((a, b) => {
    const aHasVideo = a.chapters.some(
      (c) => c.video && c.video.endsWith(".mp4")
    );
    const bHasVideo = b.chapters.some(
      (c) => c.video && c.video.endsWith(".mp4")
    );

    if (aHasVideo && !bHasVideo) return -1; // a first
    if (!aHasVideo && bHasVideo) return 1;  // b first
    return 0; // same → backend order
  });
};
const submitFeedback = async () => {
  if (!feedback.trim()) {
    alert("Please write feedback");
    return;
  }

  try {
    await api.post("/api/feedback/feedback_vc/", {
      course: courseId,
      rating,
      description: feedback.trim(),
      user: localStorage.getItem("user_id"),
    });

    // feedback ke baad certificate step
    setStep("certificate");
  } catch (err) {
    console.error("Feedback error", err);
    alert("Feedback submit nahi hua");
  }
};

function CertificateDetail() {
  const { id } = useParams();
  const [certificate, setCertificate] = useState<any>(null);

  useEffect(() => {
    api.get(`/course/certificates/${id}/`).then((res) => {
      setCertificate(res.data);
    });
  }, [id]);

  if (!certificate) return <p>Loading...</p>;

  return (
    <div className="min-h-screen p-10 text-white">
      <h1 className="text-3xl font-bold mb-4">
        🎓 Certificate of Completion
      </h1>

      <p><b>Course:</b> {certificate.course_name}</p>
      <p><b>User:</b> {certificate.user_name}</p>
      <p><b>Issued On:</b> {certificate.issued_at}</p>

      <a
        href={certificate.pdf}
        target="_blank"
        className="inline-block mt-4 bg-green-600 px-6 py-2 rounded"
      >
        Download Certificate
      </a>
    </div>
  );
}

  /* ================= FETCH ================= */
  useEffect(() => {
    api.get(`/course/courses/${courseId}/`).then((res) => {
      const mapped: Module[] = res.data.modules.map((m: any) => ({
        id: String(m.id),
        title: m.title,
        chapters: m.chapters,
      }));

      const sortedModules = sortModulesForVideoFirst(mapped);
const builtFlow = buildFlow(sortedModules);

setModules(sortedModules);
setFlow(builtFlow);

      setFlow(builtFlow);
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
  const handleNext = () => {
    if (flowIndex < flow.length - 1) {
      setFlowIndex((p) => p + 1);
    } else {
      setStep("review");
    }
  };
const generateCertificateFile = async () => {
  const element = document.getElementById("certificate-html");
  if (!element) throw new Error("Certificate HTML not found");

  const canvas = await html2canvas(element, { scale: 2 });
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

  const blob = pdf.output("blob");

  return new File([blob], "certificate.pdf", {
    type: "application/pdf",
  });
};


const generateCertificate = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // 1️⃣ PDF FILE
    const certificateFile = await generateCertificateFile();

    // 2️⃣ FORM DATA
    const formData = new FormData();
    formData.append("certificate", certificateFile); // FILE
    formData.append("title", "Certificate of Completion");
    formData.append("issue_date", today);
    formData.append("expiry_date", today);
    formData.append("is_active", "true");
    formData.append("course", String(courseId));
    formData.append("user", localStorage.getItem("user_id") || "");

    // 3️⃣ API CALL
    const res = await axios.post(
      "https://dev.backend.onrequestlab.com/certificate/certificate/",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // ❗ content-type mat do (browser set karega)
        },
      }
    );

    const certificateId = res.data.id;

    // 4️⃣ REDIRECT TO DETAIL PAGE
    navigate(`/certificate-view/${certificateId}`);
  } catch (error: any) {
    console.error("Certificate error:", error.response?.data || error);
    alert("Certificate generate nahi ho paaya");
  }
};




  /* ================= UI ================= */
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#020617] text-white px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

          {/* SIDEBAR */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 h-[80vh] overflow-y-auto">
            <h3 className="text-purple-300 font-semibold mb-4">
              Course Roadmap
            </h3>

            {modules.map((module) => (
              <div key={module.id} className="mb-6">
                <p className="font-bold mb-2">📦 {module.title}</p>

                {flow
                  .map((item, idx) => ({ ...item, idx }))
                  .filter((f) => f.moduleId === module.id)
                  .map((item) => (
                    <button
                      key={item.idx}
                      onClick={() => setFlowIndex(item.idx)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm flex justify-between
                        ${
                          isActive(item.idx)
                            ? "bg-purple-700 text-white"
                            : isCompleted(item.idx)
                            ? "text-green-400"
                            : "text-slate-400 hover:bg-slate-800"
                        }`}
                    >
                      <span>
                        {item.type === "video" && "🎥 Video"}
                        {item.type === "pdf" && "📄 PDF"}
                        {item.type === "quiz" && "❓ Quiz"}
                      </span>
                      <span>
                        {isCompleted(item.idx) && "✔"}
                        {isActive(item.idx) && "➜"}
                      </span>
                    </button>
                  ))}
              </div>
            ))}
          </div>

          {/* MAIN */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

            {/* QUIZ TIMER */}
            {current?.type === "quiz" && step === "learning" && (
              <div className="flex justify-end mb-4 text-purple-300">
                ⏱ {timeLeft}s
              </div>
            )}

            {/* VIDEO */}
            {current?.type === "video" && step === "learning" && (
              <>
                <video src={current.data} controls className="w-full rounded-lg" />
                <button onClick={handleNext} className="mt-4 bg-purple-600 px-6 py-2 rounded-lg">
                  Next →
                </button>
              </>
            )}

            {/* PDF */}
            {current?.type === "pdf" && step === "learning" && (
              <>
                <iframe src={current.data} className="w-full h-[60vh] rounded-lg" />
                <button onClick={handleNext} className="mt-4 bg-purple-600 px-6 py-2 rounded-lg">
                  Next →
                </button>
              </>
            )}

            {/* QUIZ */}
            {current?.type === "quiz" && step === "learning" && (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  {current.data.question}
                </h2>

                {current.data.options.map((o: QuizOption) => (
                  <label
                    key={o.id}
                    className="block border border-slate-700 p-3 rounded-lg mb-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      className="mr-2"
                      checked={answers[current.data.id] === o.id}
                      onChange={() =>
                        setAnswers({ ...answers, [current.data.id]: o.id })
                      }
                    />
                    {o.text}
                  </label>
                ))}

                <button onClick={handleNext} className="bg-purple-600 px-6 py-2 rounded-lg">
                  {flowIndex === flow.length - 1 ? "Submit Test" : "Next →"}
                </button>
              </>
            )}

            {/* REVIEW + FEEDBACK */}
            {step === "review" && (
              <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8">

                {/* ANSWER SHEET */}
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

                {/* FEEDBACK */}
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
                          i <= rating
                            ? "text-yellow-400"
                            : "text-slate-500"
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
  className="bg-purple-600 px-8 py-3 rounded-lg"
>
  Submit Feedback
</button>

                </div>
              </div>
            )}

            {/* CERTIFICATE */}
            {step === "certificate" && (
              <div className="text-center">
                <Award size={64} className="mx-auto text-yellow-400 mb-4" />
                <button
  onClick={generateCertificate}
  className="mt-4 w-full bg-purple-600 py-2 rounded-lg"
>
  Generate Certificate
</button>


              </div>
            )}
          </div>
        </div>
      </div>

      {/* CERTIFICATE HTML */}
      <div id="certificate-html" className="hidden">
        <img src={logoimg} />
        <h1>Certificate of Completion</h1>
      </div>

      <Footer />
    </>
  );
}
