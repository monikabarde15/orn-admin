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
  const handleNext = () => {
    if (flowIndex < flow.length - 1) setFlowIndex((p) => p + 1);
    else setStep("review");
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
  };

  /* ================= CERTIFICATE ================= */
  const generateCertificateFile = async () => {
    const el = document.getElementById("certificate-html");
    if (!el) throw new Error("Certificate HTML not found");

    const canvas = await html2canvas(el, { scale: 2 });
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
  alert("FUNCTION STARTED");

  if (!userId) {
    alert("User not logged in");
    return;
  }

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
    "https://dev.backend.onrequestlab.com/certificate/certificate/",
    formData,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  navigate(`/certificate-view/${res.data.id}`);
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

            {current?.type === "quiz" && step === "learning" && (
              <div className="flex justify-end mb-4 text-purple-300">
                ⏱ {timeLeft}s
              </div>
            )}

            {current?.type === "video" && step === "learning" && (
              <>
                <video src={current.data} controls className="w-full rounded-lg" />
                <button onClick={handleNext} className="mt-4 bg-purple-600 px-6 py-2 rounded-lg">
                  Next →
                </button>
              </>
            )}

            {current?.type === "pdf" && step === "learning" && (
              <>
                <iframe src={current.data} className="w-full h-[60vh] rounded-lg" />
                <button onClick={handleNext} className="mt-4 bg-purple-600 px-6 py-2 rounded-lg">
                  Next →
                </button>
              </>
            )}

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

      <div id="certificate-html" className="hidden">
        <img src={logoimg} />
        <h1>Certificate of Completion</h1>
      </div>

      <Footer />
    </>
  );
}
