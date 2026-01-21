"use client";

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Award,
  Star,
} from "lucide-react";
import { useParams } from "react-router-dom";
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
  title: string;
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
  chapterId: string;
}

type Step = "learning" | "result" | "review" | "feedback" | "certificate";

const CERTIFICATE_LOGO = logoimg;

/* ================= HELPERS ================= */
const isVideo = (url?: string | null) =>
  !!url && url.toLowerCase().endsWith(".mp4");

const isPdf = (url?: string | null) =>
  !!url && url.toLowerCase().endsWith(".pdf");

/* ================= MAIN ================= */
const CourseTestFinal: React.FC = () => {
  const { id: courseId } = useParams<{ id: string }>();

  const getCookie = (name: string) => {
    const v = `; ${document.cookie}`;
    const parts = v.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
    return "";
  };

  const user = {
    name: getCookie("username"),
    email: getCookie("email"),
  };

  const token =
    getCookie("access") || localStorage.getItem("access") || "";

  const userId = getCookie("user_id");

  const api = axios.create({
    baseURL: "https://dev.backend.onrequestlab.com",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const generateCertificateId = () => "ORL-" + Date.now();
  const certificateId = generateCertificateId();

  /* ================= STATE ================= */
  const [modules, setModules] = useState<Module[]>([]);
  const [flow, setFlow] = useState<FlowItem[]>([]);
  const [flowIndex, setFlowIndex] = useState(0);
  const [step, setStep] = useState<Step>("learning");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [certificate, setCertificate] = useState({
  id: "",
  title: "",
  issue_date: "",
  expiry_date: "",
});
const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigate = useNavigate();


  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [courseTitle, setCourseTitle] = useState("");

  const current = flow[flowIndex];
  const isLast = flowIndex === flow.length - 1;

  /* ================= FLOW BUILDER ================= */
  const buildFlow = (modules: Module[]): FlowItem[] => {
    const videos: FlowItem[] = [];
    const pdfs: FlowItem[] = [];
    const quizzes: FlowItem[] = [];

    modules.forEach((m) => {
      m.chapters.forEach((c) => {
        if (isVideo(c.video)) {
          videos.push({
            type: "video",
            data: "https://" + c.video,
            moduleId: m.id,
            chapterId: c.id,
          });
        }

        if (isPdf(c.video)) {
          pdfs.push({
            type: "pdf",
            data: "https://" + c.video,
            moduleId: m.id,
            chapterId: c.id,
          });
        }

        if (isPdf(c.file)) {
          pdfs.push({
            type: "pdf",
            data: "https://" + c.file,
            moduleId: m.id,
            chapterId: c.id,
          });
        }

        c.quizzes?.forEach((q) => {
          quizzes.push({
            type: "quiz",
            data: q,
            moduleId: m.id,
            chapterId: c.id,
          });
        });
      });
    });

    return [...videos, ...pdfs, ...quizzes];
  };

  /* ================= FETCH COURSE ================= */
  useEffect(() => {
    api.get(`/course/courses/${courseId}/`).then((res) => {
      setCourseTitle(res.data.title);

      const mapped: Module[] = res.data.modules.map((m: any) => ({
        id: String(m.id),
        title: m.title,
        chapters: m.chapters.map((c: any) => ({
          id: String(c.id),
          title: c.title,
          video: c.video,
          file: c.file,
          quizzes: c.quizzes || [],
        })),
      }));

      setModules(mapped);
      const builtFlow = buildFlow(mapped);
      setFlow(builtFlow);

      if (builtFlow.length) {
        setActiveModuleId(builtFlow[0].moduleId);
      }
    });
  }, [courseId]);

  useEffect(() => {
    if (current) setActiveModuleId(current.moduleId);
  }, [current]);

  /* ================= NAVIGATION ================= */
  const handleNext = () => {
    if (isLast) setStep("result");
    else setFlowIndex((i) => i + 1);
  };
const getOrderedModuleFlow = (moduleId: string) => {
  const moduleFlow = flow
    .map((f, index) => ({ ...f, index }))
    .filter((f) => f.moduleId === moduleId);

  return [
    ...moduleFlow.filter((f) => f.type === "video"),
    ...moduleFlow.filter((f) => f.type === "pdf"),
    ...moduleFlow.filter((f) => f.type === "quiz"),
  ];
};

const getFlowLabel = (item: FlowItem) => {
  if (item.type === "video") return "🎥 Video";
  if (item.type === "pdf") return "📄 PDF";
  if (item.type === "quiz") return "❓ Quiz";
  return "";
};

  /* ================= RESULT ================= */
  const allQuizzes: Quiz[] = modules.flatMap((m) =>
    m.chapters.flatMap((c) => c.quizzes || [])
  );

  const getResultStats = () => {
    let correct = 0;
    allQuizzes.forEach((q) => {
      if (
        answers[q.id] === q.options.find((o) => o.is_correct)?.id
      ) {
        correct++;
      }
    });

    return {
      total: allQuizzes.length,
      correct,
      percentage: allQuizzes.length
        ? Math.round((correct / allQuizzes.length) * 100)
        : 0,
    };
  };

  /* ================= FEEDBACK ================= */
  const submitFeedback = async () => {
    if (!feedback.trim()) return alert("Please write feedback");

    await api.post("/api/feedback/feedback_vc/", {
      course: courseId,
      rating,
      description: feedback.trim(),
      user: userId,
    });

    setStep("certificate");
  };
const prepareCertificateData = () => {
  const issueDate = new Date().toISOString().split("T")[0];

  const cert = {
    id: "ORL-" + Date.now(),
    title: courseTitle,
    issue_date: issueDate,
    expiry_date: "",
  };

  setCertificate(cert);
  return cert;
};

  

const saveCertificateRecordOnly = async () => {
  try {
    const res = await api.post("/certificate/certificate/", {
      course: courseId,
      title: courseTitle,
      issue_date: new Date().toISOString().split("T")[0],
      is_active: true,
    });

    // ✅ new certificate created
    return res.data.id;

  } catch (err: any) {
    const data = err.response?.data;

    // 🔥 CASE: bunny_error string ke andar certificate_id
    if (data?.bunny_error) {
      try {
        // string ko object me convert karo
        const parsed = JSON.parse(
          data.bunny_error.replace(/'/g, '"')
        );

        if (parsed.certificate_id) {
          return parsed.certificate_id;
        }
      } catch (e) {
        console.error("Parsing error:", e);
      }
    }

    throw err;
  }
};

const getSidebarChaptersInOrder = (module: Module) => {
  const videos: Chapter[] = [];
  const pdfs: Chapter[] = [];
  const quizzes: Chapter[] = [];

  module.chapters.forEach((c) => {
    // 🎥 Video
    if (c.video && c.video.toLowerCase().endsWith(".mp4")) {
      videos.push(c);
    }

    // 📄 PDF (video field ya file field se)
    if (
      (c.video && c.video.toLowerCase().endsWith(".pdf")) ||
      (c.file && c.file.toLowerCase().endsWith(".pdf"))
    ) {
      pdfs.push(c);
    }

    // ❓ Quiz
    if (c.quizzes && c.quizzes.length > 0) {
      quizzes.push(c);
    }
  });

  // 🔥 FINAL ORDER: Video → PDF → Quiz
  return [...videos, ...pdfs, ...quizzes];
};

  
const handlePrevious = () => {
  if (flowIndex > 0) {
    setFlowIndex((i) => i - 1);
    setStep("learning");
  }
};

const getModuleStartIndex = (moduleId: string) => {
  // 1️⃣ VIDEO first
  let index = flow.findIndex(
    (f) => f.moduleId === moduleId && f.type === "video"
  );

  // 2️⃣ PDF second
  if (index === -1) {
    index = flow.findIndex(
      (f) => f.moduleId === moduleId && f.type === "pdf"
    );
  }

  // 3️⃣ QUIZ last
  if (index === -1) {
    index = flow.findIndex(
      (f) => f.moduleId === moduleId && f.type === "quiz"
    );
  }

  return index;
};

const generateCertificate = async () => {
  const element = document.getElementById("certificate-html");
  if (!element) return;

  // 🔥 Either NEW or EXISTING ID
  const certId = await saveCertificateRecordOnly();

  await new Promise((r) => setTimeout(r, 300));

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
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

  pdf.save(`Certificate-${certId}.pdf`);

  setStep("certificate");

    // ⏳ 3 seconds delay ke baad redirect
    setTimeout(() => {
      navigate(`/certificate-view/${certId}`);
    }, 3000); // 3000ms = 3 sec
};

useEffect(() => {
  if (step === "certificate" && certificate.id) {
    const timer = setTimeout(() => {
      navigate(`/certificate-view/${certificate.id}`);
    }, 4000);

    return () => clearTimeout(timer);
  }
}, [step, certificate.id]);



const getModulePriority = (module: Module) => {
  let hasVideo = false;
  let hasPdf = false;
  let hasQuiz = false;

  module.chapters.forEach((c) => {
    // 🎥 VIDEO
    if (c.video && c.video.toLowerCase().endsWith(".mp4")) {
      hasVideo = true;
    }

    // 📄 PDF
    if (
      (c.video && c.video.toLowerCase().endsWith(".pdf")) ||
      (c.file && c.file.toLowerCase().endsWith(".pdf"))
    ) {
      hasPdf = true;
    }

    // ❓ QUIZ
    if (c.quizzes && c.quizzes.length > 0) {
      hasQuiz = true;
    }
  });

  // 🔥 PRIORITY ORDER
  if (hasVideo) return 1; // VIDEO FIRST
  if (hasPdf) return 2;   // PDF SECOND
  if (hasQuiz) return 3;  // QUIZ LAST
  return 4;
};
const sortedModules = [...modules].sort(
  (a, b) => getModulePriority(a) - getModulePriority(b)
);


useEffect(() => {
  if (window.innerWidth < 1024) {
    setIsSidebarOpen(false);
  }
}, []);

  /* ================= UI ================= */
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#020617] text-white">
       <div
  className={`mx-auto px-4 md:px-6 py-6 grid gap-1 relative isolate transition-all duration-300
    ${
      isSidebarOpen
        ? "max-w-[1300px] grid-cols-1 lg:grid-cols-[260px_1fr]"
        : "max-w-[1500px] grid-cols-1"
    }`}
>


         
          {/* MODULE LIST */}
{isSidebarOpen && (
  <aside className="bg-slate-950 border border-slate-800 rounded-xl 
lg:sticky lg:top-20 relative z-20 h-fit shadow-lg">
    <div className="flex items-center justify-between p-4 border-b border-slate-700">
      <h3 className="font-semibold">Modules</h3>
      <button
        onClick={() => setIsSidebarOpen(false)}
        className="text-slate-400 hover:text-white"
      >
        ✕
      </button>
    </div>

    {/* <div className="max-h-[70vh] overflow-y-auto">
      {modules.map((m) => (
        <button
          key={m.id}
          onClick={() =>
            setFlowIndex(flow.findIndex((f) => f.moduleId === m.id))
          }
          className={`w-full px-4 py-3 text-left border-b border-slate-800 hover:bg-slate-800 transition
            ${activeModuleId === m.id && "bg-purple-600/20 text-purple-300"}
          `}
        >
          {m.title}
        </button>
      ))}
    </div> */
    <div className="max-h-[70vh] overflow-y-auto">
  {sortedModules.map((m) => (
    <button
      key={m.id}
      onClick={() => {
        const index = getModuleStartIndex(m.id);
        if (index !== -1) setFlowIndex(index);
      }}
      className={`w-full px-4 py-3 text-left border-b border-slate-800 hover:bg-slate-800 transition
        ${activeModuleId === m.id && "bg-purple-600/20 text-purple-300"}
      `}
    >
      {m.title}
    </button>
  ))}
</div>

}
  </aside>
)}
{!isSidebarOpen && (
  <div className="mb-4">
    <button
      onClick={() => setIsSidebarOpen(true)}
      className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition"
    >
      ☰ Show Modules
    </button>
  </div>
)}

          {/* RIGHT CONTENT */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950
    border border-slate-800 rounded-2xl
    p-1 sm:p-1
    shadow-xl">
    

        {step === "learning" && current?.type === "video" && (
  <>
    <div className="flex flex-col sm:flex-row gap-2 justify-between items-center mt-2">
      <video
        src={current.data}
        controls
        autoPlay
        className="w-full h-full object-contain"
      />
    </div>

    <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mt-4">
  {/* Previous */}
  <button
    onClick={handlePrevious}
    disabled={flowIndex === 0}
    className={`px-6 py-2 rounded-lg border
      ${
        flowIndex === 0
          ? "border-slate-700 text-slate-500 cursor-not-allowed"
          : "border-slate-600 hover:bg-slate-800"
      }
    `}
  >
    ← Previous
  </button>

  {/* Next */}
  <button
    onClick={handleNext}
    className="bg-purple-600 px-6 py-2 rounded-lg"
  >
    Next →
  </button>
</div>

  </>
)}




          {step === "learning" && current?.type === "pdf" && (
  <>
    <iframe
      src={current.data}
        className="w-full h-[55vh] sm:h-[60vh] md:h-[65vh] rounded-lg rounded-lg"
  style={{ maxWidth: "100%" }}
    />

    <div className="flex justify-between items-center mt-4">
      {/* Previous */}
      <button
        onClick={handlePrevious}
        disabled={flowIndex === 0}
        className={`px-6 py-2 rounded-lg border
          ${
            flowIndex === 0
              ? "border-slate-700 text-slate-500 cursor-not-allowed"
              : "border-slate-600 hover:bg-slate-800"
          }
        `}
      >
        ← Previous
      </button>

      {/* Next */}
      <button
        onClick={handleNext}
        className="bg-purple-600 px-6 py-2 rounded-lg"
      >
        Next →
      </button>
    </div>
  </>
)}


            {step === "learning" && current?.type === "quiz" && (
              <div>
                <h2 className="text-xl font-semibold">{current.data.question}</h2>
                {current.data.options.map((o: QuizOption) => (
                  <label key={o.id} className="flex gap-3 items-center border p-4 rounded-lg mt-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={answers[current.data.id] === o.id}
                      onChange={() =>
                        setAnswers({ ...answers, [current.data.id]: o.id })
                      }
                    />{" "}
                    {o.text}
                  </label>
                ))}
                <div className="flex justify-between items-center mt-6">
  {/* Previous */}
  <button
    onClick={handlePrevious}
    disabled={flowIndex === 0}
    className={`px-6 py-2 rounded-lg border
      ${
        flowIndex === 0
          ? "border-slate-700 text-slate-500 cursor-not-allowed"
          : "border-slate-600 hover:bg-slate-800"
      }
    `}
  >
    ← Previous
  </button>

  {/* Next / Submit */}
  <button
    onClick={handleNext}
    className="bg-purple-600 px-6 py-2 rounded-lg"
  >
    {isLast ? "Submit Test" : "Next →"}
  </button>
</div>

              </div>
            )}

            {step === "result" && (
              <div className="text-center">
                <Award size={64} className="mx-auto text-yellow-400" />
                <h2 className="text-2xl font-bold">Result</h2>
                <p>{getResultStats().percentage}%</p>
                <button onClick={() => setStep("review")} className="bg-purple-600 px-6 py-2 rounded-lg">
                  Review
                </button>
              </div>
            )}

            {step === "review" && (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold mb-4">Answer Review</h2>

    {allQuizzes.map((q, index) => {
      const correctOption = q.options.find(o => o.is_correct);
      const userAnswerId = answers[q.id];

      return (
        <div
          key={q.id}
          className="border border-slate-700 rounded-lg p-4 bg-slate-800"
        >
          <p className="font-semibold mb-3">
            {index + 1}. {q.question}
          </p>

          {q.options.map((o) => {
            const isCorrect = o.id === correctOption?.id;
            const isSelected = o.id === userAnswerId;

            return (
              <div
                key={o.id}
                className={`p-2 rounded-md mb-2 flex justify-between items-center
                  ${isCorrect ? "bg-green-700/30 border border-green-500" : ""}
                  ${!isCorrect && isSelected ? "bg-red-700/30 border border-red-500" : ""}
                  ${!isCorrect && !isSelected ? "bg-slate-900" : ""}
                `}
              >
                <span>{o.text}</span>

                {isCorrect && (
                  <span className="text-green-400 text-sm font-semibold">
                    ✔ Correct
                  </span>
                )}

                {!isCorrect && isSelected && (
                  <span className="text-red-400 text-sm font-semibold">
                    ✖ Your Answer
                  </span>
                )}
              </div>
            );
          })}
        </div>
      );
    })}

    <div className="text-center mt-6">
      <button
        onClick={() => setStep("feedback")}
        className="bg-purple-600 px-8 py-3 rounded-lg"
      >
        Continue to Feedback
      </button>
    </div>
  </div>
)}


           {step === "feedback" && (
  <div className="max-w-xl mx-auto bg-slate-800 p-6 rounded-xl border border-slate-700">
    <h2 className="text-2xl font-bold text-center mb-4">
      Course Feedback
    </h2>

    {/* ⭐ STAR RATING */}
    <div className="flex justify-center gap-2 mb-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={32}
          onClick={() => setRating(i)}
          className={`cursor-pointer ${
            i <= rating ? "text-yellow-400" : "text-slate-500"
          }`}
          fill={i <= rating ? "#facc15" : "none"}
        />
      ))}
    </div>

    <p className="text-center text-slate-400 mb-4">
      Rating: {rating} / 5
    </p>

    {/* ✍ FEEDBACK TEXT */}
    <textarea
      value={feedback}
      onChange={(e) => setFeedback(e.target.value)}
      placeholder="Write your feedback here..."
      className="w-full h-28 p-3 rounded-lg bg-slate-900 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />

    <div className="text-center mt-6">
      <button
        onClick={submitFeedback}
        className="bg-purple-600 px-8 py-3 rounded-lg"
      >
        Submit Feedback
      </button>
    </div>
  </div>
)}


            {step === "certificate" && (
              <div className="text-center">
                <Award size={64} className="mx-auto text-yellow-400" />
                <h2 className="text-2xl font-bold">Certificate Ready</h2>
                <button onClick={generateCertificate} className="bg-green-600 px-6 py-2 rounded-lg">
                  Download Certificate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HIDDEN CERTIFICATE HTML */}
      <div
  id="certificate-html"
  style={{
    position: "absolute",
    top: "-9999px",
    left: "-9999px",
    width: "1123px",
    height: "794px",
    backgroundColor: "#0b1220",
    padding: "40px",
    fontFamily: "'Poppins', Arial, sans-serif",
    boxSizing: "border-box",
  }}
>
  {/* OUTER BLUE FRAME */}
  <div
    style={{
      width: "100%",
      height: "100%",
      background:
        "linear-gradient(135deg, #0f172a 0%, #0b3c7a 50%, #0f172a 100%)",
      padding: "30px",
      boxSizing: "border-box",
    }}
  >
    {/* INNER WHITE CARD */}
    <div
      style={{
        backgroundColor: "#ffffff",
        width: "100%",
        height: "100%",
        padding: "50px 70px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* LOGO */}
      <img
        src={CERTIFICATE_LOGO}
        alt="Logo"
        style={{ width: "160px", marginBottom: "30px" }}
      />

      {/* TITLE */}
      <h1
        style={{
          fontSize: "46px",
          margin: "0",
          color: "#0f172a",
          letterSpacing: "1px",
        }}
      >
        CERTIFICATE
      </h1>

      <h3
        style={{
          marginTop: "8px",
          fontSize: "18px",
          letterSpacing: "3px",
          color: "#2563eb",
          fontWeight: 500,
        }}
      >
        OF COMPLETION
      </h3>

      <p style={{ marginTop: "30px", fontSize: "16px", color: "#334155" }}>
        This certifies that
      </p>

      {/* USER NAME */}
      <h2
        style={{
          fontSize: "40px",
          margin: "10px 0 20px",
          color: "#020617",
          fontWeight: 700,
        }}
      >
        {user.name}
      </h2>

      <p style={{ fontSize: "16px", color: "#334155", maxWidth: "600px" }}>
        has successfully completed the course
      </p>

      {/* COURSE TITLE */}
      <h3
        style={{
          fontSize: "22px",
          marginTop: "10px",
          fontWeight: 600,
          color: "#020617",
        }}
      >
        “{certificate.title}”
      </h3>

      {/* META INFO */}
      <div
        style={{
          marginTop: "40px",
          fontSize: "14px",
          color: "#334155",
          lineHeight: "1.8",
        }}
      >
        <p>
          <b>Certificate ID:</b> {certificate.id}
        </p>
        <p>
          <b>Issued On:</b> {certificate.issue_date}
        </p>
        <p>
          <b>Expiry:</b> {certificate.expiry_date || "Lifetime"}
        </p>
        <p>
          <b>Status:</b> Active
        </p>
      </div>

      {/* SIGNATURE */}
      <div
        style={{
          position: "absolute",
          bottom: "60px",
          left: "70px",
        }}
      >
        <div
          style={{
            width: "200px",
            borderTop: "2px solid #0f172a",
            marginBottom: "6px",
          }}
        />
        <p style={{ fontWeight: 600, color: "#020617", margin: 0 }}>
          Authorized Signature
        </p>
        <p style={{ fontSize: "13px", color: "#475569", margin: 0 }}>
          OnRequestLab LMS
        </p>
      </div>

      {/* FOOTER */}
      <p
        style={{
          position: "absolute",
          bottom: "40px",
          right: "70px",
          fontSize: "13px",
          color: "#475569",
        }}
      >
        Verified & Issued by <b>OnRequestLab</b>
      </p>
    </div>
  </div>
</div>



      <Footer />
    </>
  );
};

export default CourseTestFinal;
