import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PlayCircle,
  FileText,
  ListChecks,
  ChevronLeft,
  ChevronRight,
  Award,
  Eye,
  Download,
  Star,
  X,
} from "lucide-react";
import { useParams } from "react-router-dom";
import Navbar from "../../pages/Components/Navbar";
import Footer from "../../pages/Components/Footer";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  pdf?: string | null;
  quizzes?: Quiz[];
}
interface Module {
  id: string;
  title: string;
  chapters: Chapter[];
}

type Step = "learning" | "result" | "review" | "feedback" | "certificate";

interface FlowItem {
  type: "video" | "pdf" | "quiz";
  data: any;
  moduleId: string;
  chapterId: string;
}
import logoimg from "../../../public/assets/orllogo.png";

const CERTIFICATE_LOGO =logoimg;
 // "https://upload.wikimedia.org/wikipedia/commons/e/e3/Udemy_logo.svg";

/* ================= MAIN ================= */
const CourseTestFinal: React.FC = () => {
  const { id: courseId } = useParams<{ id: string }>();

  const token =
    document.cookie
      .split("; ")
      .find((r) => r.startsWith("access="))
      ?.split("=")[1] || localStorage.getItem("access");

  const api = axios.create({
    baseURL: "https://dev.backend.onrequestlab.com",
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
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");

  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [showCertificatePreview, setShowCertificatePreview] = useState(false);
const [courseTitle, setCourseTitle] = useState("");

  const current = flow[flowIndex];
  const isLast = flowIndex === flow.length - 1;
const getCookie = (name) => {
    if (typeof document === "undefined") return "";
    const v = `; ${document.cookie}`;
    const parts = v.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return "";
  };

  const token1 =
    (getCookie("access") ||
      localStorage.getItem("access") ||
      localStorage.getItem("jwt-auth"))?.trim();
  const userId = getCookie("user_id");
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
          pdf: c.pdf,
          quizzes: c.quizzes || [],
        })),
      }));

      setModules(mapped);

      const tempFlow: FlowItem[] = [];
      mapped.forEach((m) =>
        m.chapters.forEach((c) => {
          if (c.video)
            tempFlow.push({
              type: "video",
              data: "https://" + c.video,
              moduleId: m.id,
              chapterId: c.id,
            });
          if (c.pdf)
            tempFlow.push({
              type: "pdf",
              data: "https://" + c.pdf,
              moduleId: m.id,
              chapterId: c.id,
            });
          c.quizzes?.forEach((q) =>
            tempFlow.push({
              type: "quiz",
              data: q,
              moduleId: m.id,
              chapterId: c.id,
            })
          );
        })
      );

      setFlow(tempFlow);
      if (tempFlow.length) setActiveModuleId(tempFlow[0].moduleId);
    });
  }, [courseId]);

  useEffect(() => {
    if (current) setActiveModuleId(current.moduleId);
  }, [current]);
/* ================= PROGRESS API ================= */

const getProgress = async (item_type: string, item_value: string) => {
  const res = await api.get(
    `/course/progress/?item_type=${item_type}&status=started`
  );

  return res.data.find(
    (p: any) =>
      p.item_type === item_type &&
      String(p.item_value) === String(item_value)
  );
};

const createProgress = async (
  item_type: string,
  item_value: string,
  status: "started" | "completed"
) => {
  return api.post("/course/progress/", {
    item_type,
    item_value,
    status,
    user: Number(userId),
  });
};

const updateProgress = async (
  progressId: number,
  status: "started" | "completed"
) => {
  return api.patch(`/course/progress/${progressId}/`, {
    status,
  });
};

const markProgress = async (
  item_type: string,
  item_value: string,
  status: "started" | "completed"
) => {
  try {
    const existing = await getProgress(item_type, item_value);

    if (existing) {
      await updateProgress(existing.id, status);
    } else {
      await createProgress(item_type, item_value, status);
    }
  } catch (err) {
    console.error("Progress error:", err);
  }
};
useEffect(() => {
  if (current?.type === "video") {
    markProgress("video", current.chapterId, "started");
  }
}, [current]);

  /* ================= NAVIGATION ================= */
  // const handleNext = () => {
  //   if (isLast) setStep("result");
  //   else setFlowIndex((i) => i + 1);
  // };

  const handleNext = async () => {
  if (current) {
    await markProgress(
      current.type,
      current.chapterId,
      "completed"
    );
  }

  if (isLast) setStep("result");
  else setFlowIndex((i) => i + 1);
};
useEffect(() => {
  if (current?.type === "pdf") {
    markProgress("chapter", current.chapterId, "started");
  }
}, [current]);
useEffect(() => {
  if (current?.type === "quiz") {
    markProgress("quiz", current.data.id, "started");
  }
}, [current]);
useEffect(() => {
  if (step === "result") {
    modules.forEach((m) => {
      markProgress("module", m.id, "completed");
    });

    markProgress("course", courseId!, "completed");
  }
}, [step]);
const deleteProgress = async (progressId: number) => {
  await api.delete(`/course/progress/${progressId}/`);
};

  
  /* ================= RESULT ================= */
  const allQuizzes: Quiz[] = modules.flatMap((m) =>
    m.chapters.flatMap((c) => c.quizzes || [])
  );

  const getResultStats = () => {
    let attempted = 0,
      correct = 0;
    allQuizzes.forEach((q) => {
      if (answers[q.id]) {
        attempted++;
        if (
          answers[q.id] === q.options.find((o) => o.is_correct)?.id
        )
          correct++;
      }
    });
    return {
      total: allQuizzes.length,
      attempted,
      correct,
      wrong: attempted - correct,
      percentage: allQuizzes.length
        ? Math.round((correct / allQuizzes.length) * 100)
        : 0,
    };
  };

  /* ================= CERTIFICATE ================= */
  const downloadDemoCertificate = () => {
  const pdfUrl =
    "https://udemy-certificate.s3.amazonaws.com/pdf/UC-c0bafa92-1608-41c8-a6bc-331698f5682c.pdf";

  const link = document.createElement("a");
  link.href = pdfUrl;
  link.download = "Certificate-of-Completion.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  const saveCertificateRecordOnly = async () => {
  await api.post("/certificate/certificate/", {
    course: courseId,
    title: courseTitle,
    issue_date: new Date().toISOString().split("T")[0],
    is_active: true,
  });
};

// const generateCertificate = async () => {
//   try {
//     // 1. Save certificate record in backend (PDF null rahega)
//     await saveCertificateRecordOnly();

//     // 2. Download Udemy demo PDF locally
//     downloadDemoCertificate();

//     alert("Certificate downloaded (demo PDF)");
//   } catch (e) {
//     console.error(e);
//     alert("Certificate generation failed");
//   }
// };
const th = {
  border: "1px solid #000",
  padding: "6px",
};

const td = {
  border: "1px solid #000",
  padding: "6px",
  textAlign: "center",
};

const getModuleResults = () => {
  return modules.map((module) => {
    let total = 0;
    let correct = 0;

    module.chapters.forEach((chapter) => {
      chapter.quizzes?.forEach((quiz) => {
        total++;

        const selected = answers[quiz.id];
        const correctOption = quiz.options.find(o => o.is_correct)?.id;

        if (selected && selected === correctOption) {
          correct++;
        }
      });
    });

    const percentage = total
      ? Math.round((correct / total) * 100)
      : 0;

    return {
      moduleId: module.id,
      moduleTitle: module.title,
      total,
      correct,
      wrong: total - correct,
      percentage,
      status: percentage >= 40 ? "PASS" : "FAIL", // threshold
    };
  });
};
// const generateCertificate = async () => {
//   try {
//     await saveCertificateRecordOnly();

//     const element = document.getElementById("certificate-html");
//     if (!element) return;

//     const canvas = await html2canvas(element, {
//       scale: 2,
//       useCORS: true,
//       backgroundColor: "#ffffff",
//     });

//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("landscape", "px", "a4");

//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = pdf.internal.pageSize.getHeight();

//     const imgWidth = pdfWidth;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;

//     let heightLeft = imgHeight;
//     let position = 0;

//     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//     heightLeft -= pdfHeight;

//     while (heightLeft > 0) {
//       position -= pdfHeight;
//       pdf.addPage();
//       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//       heightLeft -= pdfHeight;
//     }

//     pdf.save("Certificate-of-Completion.pdf");
//   } catch (error) {
//     console.error(error);
//     alert("Certificate generation failed");
//   }
// };
const capture = async (id: string) => {
  const el = document.getElementById(id);
  if (!el) return null;
  const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#fff" });
  return canvas.toDataURL("image/png");
};


const generateCertificate = async () => {
  try {
    await saveCertificateRecordOnly();

    const element = document.getElementById("certificate-html");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    // A4 Landscape size
    const pdf = new jsPDF("landscape", "px", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // 🔑 SCALE IMAGE TO FIT ONE PAGE
    const imgRatio = canvas.width / canvas.height;
    const pdfRatio = pdfWidth / pdfHeight;

    let renderWidth = pdfWidth;
    let renderHeight = pdfHeight;

    if (imgRatio > pdfRatio) {
      renderHeight = pdfWidth / imgRatio;
    } else {
      renderWidth = pdfHeight * imgRatio;
    }

    const x = (pdfWidth - renderWidth) / 2;
    const y = (pdfHeight - renderHeight) / 2;

    pdf.addImage(
      imgData,
      "PNG",
      x,
      y,
      renderWidth,
      renderHeight
    );

    pdf.save("Certificate-of-Completion.pdf");
  } catch (err) {
    console.error(err);
    alert("Certificate generation failed");
  }
};


// const generateCertificate = async () => {
//   try {
//     // 1️⃣ Backend me sirf record save
//     await saveCertificateRecordOnly();

//     // 2️⃣ HTML → Canvas
//     const element = document.getElementById("certificate-html");
//     if (!element) return;

//     const canvas = await html2canvas(element, {
//       scale: 2,
//       useCORS: true,
//     });

//     // 3️⃣ Canvas → PDF
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("landscape", "px", [1123, 794]);

//     pdf.addImage(imgData, "PNG", 0, 0, 1123, 794);

//     // 4️⃣ Local Download
//     pdf.save("Certificate-of-Completion.pdf");

//     alert("Certificate downloaded successfully");
//   } catch (error) {
//     console.error(error);
//     alert("Certificate generation failed");
//   }
// };
// const submitFeedback = async () => {
//   try {
//     await api.post("/api/feedback/feedback_vc/", {
//       course: courseId,
//       rating: rating,
//       description: feedback, // ✅ IMPORTANT FIX
//       user: userId,
//     });

//     setStep("certificate");
//   } catch (error) {
//     console.error("Feedback error:", error);
//     alert("Feedback submit failed. Please try again.");
//   }
// };



const submitFeedback = async () => {
  // ❗ FRONTEND VALIDATION
  if (!feedback.trim()) {
    alert("Please write your feedback before submitting.");
    return;
  }

  if (!rating) {
    alert("Please select a rating.");
    return;
  }

  try {
    await api.post("/api/feedback/feedback_vc/", {
      course: courseId,
      rating: rating,
      description: feedback.trim(), // ✅ blank nahi jayega
      user: userId  // agar backend token se user leta hai to hata bhi sakte ho
    });

    setStep("certificate");
  } catch (error) {
    console.error("Feedback error:", error);
    alert("Feedback submit failed. Please try again.");
  }
};



  const previewCertificate = async () => {
    if (!certificateId) return;
    const res = await api.get(`/certificate/certificate/${certificateId}/`);
    setCertificateUrl(res.data.certificate_file);
    setShowCertificatePreview(true);
  };
const user = {
    name: getCookie("username"),
    email: getCookie("email"),
  };
  console.log('user=',user.name);
  /* ================= UI ================= */
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#020617] text-white">
        <div className="max-w-[1400px] mx-auto px-6 py-8 flex gap-6">

          {/* LEFT MODULES */}
          <div className="w-[300px] border border-slate-800 rounded-xl">
            <div className="p-4 font-semibold border-b">Modules</div>
            {modules.map((m) => (
              <button
                key={m.id}
                onClick={() => setFlowIndex(flow.findIndex(f => f.moduleId === m.id))}
                className={`w-full p-4 text-left hover:bg-slate-800 ${
                  activeModuleId === m.id && "bg-slate-800"
                }`}
              >
                {m.title}
              </button>
            ))}
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-8">

            {/* VIDEO */}
            {step === "learning" && current?.type === "video" && (
              <>
                <video src={current.data} controls className="w-full rounded-lg" />
                <div className="text-right mt-4">
                  <button onClick={handleNext} className="bg-purple-600 px-6 py-2 rounded-lg">
                    {isLast ? "Submit Test" : "Next"}
                  </button>
                </div>
              </>
            )}

            {/* PDF */}
            {step === "learning" && current?.type === "pdf" && (
              <>
                <iframe src={current.data} className="w-full h-[75vh] rounded-lg bg-white" />
                <div className="text-right mt-4">
                  <button onClick={handleNext} className="bg-purple-600 px-6 py-2 rounded-lg">
                    {isLast ? "Submit Test" : "Next"}
                  </button>
                </div>
              </>
            )}

            {/* QUIZ */}
            {step === "learning" && current?.type === "quiz" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">{current.data.question}</h2>
                {current.data.options.map((o: QuizOption) => (
                  <label
                    key={o.id}
                    className={`block p-4 rounded-lg border cursor-pointer ${
                      answers[current.data.id] === o.id
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-slate-700"
                    }`}
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
                <div className="flex items-center justify-between mt-6">
  {/* PREV */}
  <button
    disabled={flowIndex === 0}
    onClick={() => setFlowIndex(flowIndex - 1)}
    className={`flex items-center gap-2 px-5 py-2 rounded-lg border
      ${
        flowIndex === 0
          ? "border-slate-700 text-slate-500 cursor-not-allowed"
          : "border-slate-600 text-white hover:bg-slate-800"
      }`}
  >
    <ChevronLeft size={18} />
    Prev
  </button>

  {/* NEXT */}
  <button
    onClick={handleNext}
    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg text-white"
  >
    {isLast ? "Submit Test" : "Next"}
    <ChevronRight size={18} />
  </button>
</div>

              </div>
            )}

            {/* RESULT */}
            {step === "result" && (() => {
              const r = getResultStats();
              return (
                <div className="text-center space-y-4">
                  <Award size={72} className="mx-auto text-yellow-400" />
                  <h2 className="text-2xl font-bold">Result</h2>
                  <p>{r.correct} / {r.total} Correct ({r.percentage}%)</p>
                  <button onClick={() => setStep("review")} className="bg-purple-600 px-6 py-2 rounded-lg">
                    Review Answers
                  </button>
                </div>
              );
            })()}

            {/* REVIEW */}
            {step === "review" && (
              <div className="space-y-4">
                {allQuizzes.map((q) => (
                  <div key={q.id} className="border border-slate-700 p-4 rounded-lg">
                    <b>{q.question}</b>
                    {q.options.map((o) => (
                      <div
                        key={o.id}
                        className={
                          o.is_correct
                            ? "text-green-400"
                            : answers[q.id] === o.id
                            ? "text-red-400"
                            : "text-slate-300"
                        }
                      >
                        {o.text}
                      </div>
                    ))}
                  </div>
                ))}
                <button onClick={() => setStep("feedback")} className="bg-purple-600 px-6 py-2 rounded-lg">
                  Continue
                </button>
              </div>
            )}

            {/* FEEDBACK */}
            {step === "feedback" && (
              <div className="max-w-xl mx-auto bg-slate-800 p-6 rounded-xl space-y-4">
                <h2 className="text-xl font-semibold">Course Feedback</h2>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map((i) => (
                    <Star
                      key={i}
                      onClick={() => setRating(i)}
                      className={i <= rating ? "text-yellow-400" : "text-slate-600"}
                    />
                  ))}
                </div>
                <textarea
                  className="w-full h-28 bg-slate-900 p-3 rounded-lg"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <button   onClick={submitFeedback}
  disabled={!rating}
 className="w-full bg-purple-600 py-2 rounded-lg">
                  Submit Feedback
                </button>
              </div>
            )}

            {/* CERTIFICATE */}
            {step === "certificate" && (
              <div className="text-center space-y-4">
                <Award size={72} className="mx-auto text-yellow-400" />
                <h2 className="text-2xl font-bold">Certificate of Completion</h2>
                {!certificateId && (
                  <button onClick={generateCertificate} className="bg-green-600 px-6 py-2 rounded-lg">
                    Generate Certificate
                  </button>
                )}
                {certificateId && (
                  <div className="flex justify-center gap-4">
                    <button onClick={previewCertificate} className="bg-purple-600 px-4 py-2 rounded">
                      <Eye /> Preview
                    </button>
                    {certificateUrl && (
                      <a href={certificateUrl} download className="bg-slate-700 px-4 py-2 rounded">
                        <Download /> Download
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CERTIFICATE PREVIEW */}
      {showCertificatePreview && certificateUrl && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div className="bg-white w-[85%] h-[90%] rounded-xl overflow-hidden flex flex-col">

      {/* HEADER */}
      <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">
            Certificate of Completion
          </h2>
          <p className="text-sm text-slate-300">
            Cybersecurity Threat Hunting for SOC Analysts
          </p>
        </div>

        <div className="flex gap-3">
          <a
            href={certificateUrl}
            download
            className="bg-green-600 px-4 py-2 rounded"
          >
            Download PDF
          </a>
          <button
            onClick={() => setShowCertificatePreview(false)}
            className="bg-red-500 px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>

      {/* FINAL PDF */}
      <iframe
        src={certificateUrl}
        className="flex-1 w-full"
        title="Certificate PDF"
      />
    </div>
  </div>
)}

{/* ===== HIDDEN CERTIFICATE HTML (FOR PDF GENERATION) ===== */}
<div
  id="certificate-html"
  style={{
    position: "absolute",
    top: "-9999px",
    left: "-9999px",
    width: "1123px",
    padding: "60px",
    backgroundColor: "#ffffff",
    fontFamily: "Georgia, serif",
    color: "#000",
    border: "14px solid #1e3a8a",
    boxSizing: "border-box",
  }}
>
  {/* LOGO */}
  <img
    src={CERTIFICATE_LOGO}
    alt="Platform Logo"
    style={{
      width: "140px",
      display: "block",
      margin: "0 auto 30px",
    }}
  />

  <h1
    style={{
      textAlign: "center",
      fontSize: "42px",
      marginBottom: "10px",
    }}
  >
    Certificate of Completion & Verification
  </h1>

  <p
    style={{
      textAlign: "center",
      fontSize: "17px",
      marginTop: "20px",
    }}
  >
    This certificate is proudly presented to
  </p>

  <h2
    style={{
      textAlign: "center",
      fontSize: "36px",
      margin: "20px 0",
      fontWeight: "bold",
    }}
  >
    {user.name}
  </h2>

  <p style={{ textAlign: "center", fontSize: "18px" }}>
    for successfully completing the professional training program
  </p>

  <h3
    style={{
      textAlign: "center",
      fontSize: "26px",
      marginTop: "12px",
    }}
  >
    {courseTitle}
  </h3>

  {/* <p
    style={{
      marginTop: "35px",
      fontSize: "17px",
      lineHeight: "1.6",
      textAlign: "center",
      padding: "0 80px",
    }}
  >
    This certification verifies that the above-named learner has completed all
    required learning modules, instructional videos, reading materials, and
    mandatory assessments associated with this course. The learner appeared for
    the final evaluation and achieved the qualifying score as defined by the
    assessment criteria of the program.
  </p> */}

  {/* ASSESSMENT SUMMARY */}
  <div style={{ marginTop: "35px" }}>
    <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
      Assessment Summary
    </h3>
    <ul style={{ fontSize: "16px", lineHeight: "1.8" }}>
      <li>Total Modules Completed: <b>{modules.length}</b></li>
      <li>Total Questions in Assessment: <b>{getResultStats().total}</b></li>
      <li>Correct Answers: <b>{getResultStats().correct}</b></li>
      <li>Incorrect Answers: <b>{getResultStats().wrong}</b></li>
      <li>
        Final Score Achieved: <b>{getResultStats().percentage}%</b>
      </li>
      <li>Result Status: <b>PASS</b></li>
    </ul>
  </div>

  <p
    style={{
      marginTop: "30px",
      fontSize: "16px",
      lineHeight: "1.6",
      textAlign: "center",
      padding: "0 80px",
    }}
  >
    This certificate serves as an official verification record confirming that
    the course completion and assessment results have been reviewed and validated
    by <b>OnRequestLab LMS</b> in accordance with its academic and professional
    standards. The course duration represents the total instructional hours of
    video and article-based learning content available at the time of completion.
  </p>

  <p
    style={{
      marginTop: "25px",
      fontSize: "16px",
      textAlign: "center",
    }}
  >
    Date of Completion: <b>{new Date().toLocaleDateString()}</b>
  </p>

  {/* SIGNATURES */}
  <div
    style={{
      marginTop: "70px",
      display: "flex",
      justifyContent: "space-between",
      padding: "0 100px",
      textAlign: "center",
    }}
  >
    <div>
      <hr style={{ width: "220px" }} />
      <p>Instructor / Course Authority</p>
    </div>

    <div>
      <hr style={{ width: "220px" }} />
      <p>Platform Verification Authority</p>
    </div>
  </div>
</div>




      <Footer />
    </>
  );
};

export default CourseTestFinal;
