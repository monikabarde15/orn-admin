import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  X,
  Menu,
} from "lucide-react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import Navbar from "./Navbar";
import Footer from "./Footer";

const VideoPlayer: React.FC = () => {
  const { id } = useParams();

  const [course, setCourse] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [currentChapter, setCurrentChapter] = useState<any>(null);
  const [certificateGenerated, setCertificateGenerated] = useState(false);

  // QUIZ
  const [quizList, setQuizList] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<any>({});
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  // TIMER
  const [timeLeft, setTimeLeft] = useState(30);

  // UI
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const videoRef = useRef<HTMLVideoElement>(null);

  const token = localStorage.getItem("access_token");
const userId = localStorage.getItem("userId");

const isLoggedIn = !!token && !!userId;

  // 🔥 FETCH API
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const res = await api.get(`/course/courses/${id}/`);
      const data = res.data;

      setCourse(data);

      const formatted = data.modules.map((mod: any) => ({
        id: String(mod.id),
        title: mod.title,
        lessons: mod.chapters.map((chap: any) => ({
          ...chap,
        })),
      }));

      setSections(formatted);

      if (formatted.length > 0) {
        const first = formatted[0].lessons[0];
        setCurrentChapter(first);
        setQuizList(first.quizzes || []);
      }
    };

    fetchData();
  }, [id]);

  // 🔥 TIMER
  useEffect(() => {
    if (activeTab !== "quiz" || showResult) return;

    if (timeLeft === 0) {
      handleQuizSubmit();
      return;
    }

    const t = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(t);
  }, [timeLeft, activeTab, showResult]);

  // 🔥 LESSON CLICK
  const handleLessonClick = (lesson: any) => {
    setCurrentChapter(lesson);

    setSelectedAnswers({});
    setShowResult(false);
    setShowFeedback(false);
    setCurrentQuizIndex(0);
    setTimeLeft(30);

    setQuizList(lesson.quizzes || []);
  };

  // 🔥 QUIZ SUBMIT
  const handleQuizSubmit = async () => {
    let correct = 0;

    quizList.forEach((q, i) => {
      const selected = selectedAnswers[i];
      const correctOpt = q.options.find((o: any) => o.is_correct);

      if (selected === correctOpt?.id) correct++;
    });

    setScore(correct);
    setShowResult(true);

    await api.post(`/course/progress/`, {
      item_type: "quiz",
      item_value: currentChapter?.id,
      status: "completed",
      user: 1,
    });
  };

  // 🔥 FEEDBACK + CERTIFICATE
  const handleFeedbackSubmit = async () => {
  try {
    // ✅ FEEDBACK
    await api.post(`/api/feedback/feedback_vc/`, {
      course: id,
      description: feedbackText,
      user: 1,
    });

    // ✅ CERTIFICATE CREATE
    await api.post(`/certificate/certificate/`, {
      title: course.title,
      user: 1,
      course: id,
    });

    setCertificateGenerated(true);

  } catch (err: any) {
    const errorData = err?.response?.data;

    const raw = errorData?.error?.bunny_error;

    if (raw) {
      try {
        // 🔥 FIX: single quotes → double quotes
        const cleaned = raw.replace(/'/g, '"');

        const parsed = JSON.parse(cleaned);

        if (parsed?.certificate_id) {
          const certId = parsed.certificate_id;

          // ✅ REDIRECT
          window.location.href = `/certificate-view/${certId}`;
          return;
        }

      } catch (e) {
        console.error("Still parse error", e);
      }
    }

    console.error("Final Error:", err);
  }
};

  // 🔥 NEXT CHAPTER
  const goToNextChapter = () => {
    for (let sec of sections) {
      const i = sec.lessons.findIndex(
        (l: any) => l.id === currentChapter.id
      );

      if (i !== -1 && i < sec.lessons.length - 1) {
        handleLessonClick(sec.lessons[i + 1]);
        return;
      }
    }
  };

  // 🔥 TOGGLE
  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-900 text-white flex">
      
      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* CONTENT */}
        <div className="bg-black aspect-video w-full">

  {/* VIDEO */}
  {currentChapter?.video ? (
    <video
      ref={videoRef}
      src={
        currentChapter.video.startsWith("http")
          ? currentChapter.video
          : `https://${currentChapter.video}`
      }
      controls
      className="w-full h-full"
      onEnded={async () => {
        await api.post(`/course/progress/`, {
          item_type: "chapter",
          item_value: currentChapter?.id,
          status: "completed",
          user: 1,
        });
      }}
    />
  ) : currentChapter?.file ? (

    /* PDF / DOC VIEWER */
    currentChapter.file.endsWith(".pdf") ? (
      <iframe
        src={
          currentChapter.file.startsWith("http")
            ? currentChapter.file
            : `https://${currentChapter.file}`
        }
        className="w-full h-full bg-white"
        title="PDF Viewer"
      />
    ) : (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-white">
        <p>Document Available</p>

        <a
          href={
            currentChapter.file.startsWith("http")
              ? currentChapter.file
              : `https://${currentChapter.file}`
          }
          target="_blank"
          rel="noreferrer"
          className="bg-purple-600 px-4 py-2 rounded"
        >
          Open File
        </a>
      </div>
    )

  ) : course?.thumbnail?.image ? (

    /* THUMBNAIL */
    <img
      src={`https://${course.thumbnail.image}`}
      alt="thumbnail"
      className="w-full h-full object-cover"
    />

  ) : (
    <div className="flex items-center justify-center h-full text-white">
      No Content Found
    </div>
  )}
</div>

        {/* TABS */}
        <div className="bg-white text-black p-4">
          <div className="flex gap-4 border-b mb-4">
            <button onClick={() => setActiveTab("overview")}>Overview</button>
            {isLoggedIn && (
              <button onClick={() => setActiveTab("quiz")}>
                Quiz
              </button>
            )}
          </div>

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-purple-600">
                {course?.subscription_name}
              </h1>

              <h2 className="text-xl font-semibold">
                {course?.title}
              </h2>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <p><b>Duration:</b> {course?.duration}</p>
                <p><b>Instructor:</b> {course?.instructor || "N/A"}</p>
                <p><b>Category:</b> {course?.category}</p>
                <p><b>Difficulty:</b> {course?.difficulty}</p>
              </div>

              <div>
                <p className="font-semibold">What you'll learn:</p>
                <p className="text-gray-600">{course?.learningOutcomes}</p>
              </div>

              <div>
                <p className="font-semibold">Prerequisites:</p>
                <p className="text-gray-600">{course?.prerequisites}</p>
              </div>

              <div>
                <p className="font-semibold">Description:</p>
                <p className="text-gray-600">{course?.description}</p>
              </div>
            </div>
          )}

          {/* QUIZ */}
          {activeTab === "quiz" && quizList.length > 0 && !showResult && (
            <div className="bg-white p-5 rounded-lg shadow space-y-4">

              {/* TIMER */}
              <p className="text-red-500 font-semibold">
                ⏱ Time Left: {timeLeft}s
              </p>

              {/* QUESTION */}
              <h2 className="text-lg font-bold">
                Question {currentQuizIndex + 1} of {quizList.length}
              </h2>

              <p className="text-gray-700">
                {quizList[currentQuizIndex]?.question}
              </p>

              {/* OPTIONS */}
              <div className="space-y-2">
                {quizList[currentQuizIndex]?.options.map((opt: any) => (
                  <label
                    key={opt.id}
                    className={`block border p-3 rounded cursor-pointer ${
                      selectedAnswers[currentQuizIndex] === opt.id
                        ? "bg-purple-100 border-purple-500"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`quiz-${currentQuizIndex}`}
                      checked={selectedAnswers[currentQuizIndex] === opt.id}
                      onChange={() =>
                        setSelectedAnswers({
                          ...selectedAnswers,
                          [currentQuizIndex]: opt.id,
                        })
                      }
                      className="mr-2"
                    />
                    {opt.text}
                  </label>
                ))}
              </div>

              {/* BUTTONS */}
              <div className="flex justify-between mt-4">
                <button
                  disabled={currentQuizIndex === 0}
                  onClick={() => setCurrentQuizIndex((p) => p - 1)}
                  className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                  Prev
                </button>

                {currentQuizIndex < quizList.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuizIndex((p) => p + 1)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleQuizSubmit}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          )}

          {/* RESULT */}
         {showResult && (
  <div className="w-full mt-6 px-4">
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-purple-700 to-indigo-600 text-white rounded-2xl shadow-xl p-6">

      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">🎉 Great Job!</h2>
        <p className="text-sm opacity-80">Quiz Completed Successfully</p>
      </div>

      <div className="bg-white text-black rounded-xl p-5 mb-4">
        <h3 className="text-lg font-semibold">Your Score</h3>
        <div className="text-3xl font-bold text-green-600">
          {score}/{quizList.length}
        </div>
      </div>

      {!showFeedback && !certificateGenerated && (
        <button
          onClick={() => setShowFeedback(true)}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          Give Feedback
        </button>
      )}

      {showFeedback && !certificateGenerated && (
        <div className="mt-4 bg-white text-black p-4 rounded-xl">
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          />
          <button
            onClick={handleFeedbackSubmit}
            className="w-full bg-purple-600 text-white py-2 rounded"
          >
            Submit & Generate Certificate
          </button>
        </div>
      )}

      {certificateGenerated && (
        <div className="mt-5 bg-white text-black p-5 rounded-xl text-center">
          <h3 className="text-xl font-bold">🎓 Certificate Ready!</h3>

          <button className="bg-indigo-600 text-white px-4 py-2 rounded mt-3 mr-2">
            Download
          </button>

          <button
            onClick={goToNextChapter}
            className="bg-green-500 text-white px-4 py-2 rounded mt-3"
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  </div>
)}
          {/* FEEDBACK */}
        
        </div>
      </div>

      {/* SIDEBAR */}
      {sidebarOpen && (
        <div className="w-[350px] bg-white text-black overflow-y-auto">
          <div className="p-4 flex justify-between">
            <h2>Course Content</h2>
            <button onClick={() => setSidebarOpen(false)}>
              <X />
            </button>
          </div>

          {sections.map((sec) => (
            <div key={sec.id}>
              <button
                onClick={() => toggleSection(sec.id)}
                className="w-full p-3 flex justify-between"
              >
                {sec.title}
                <ChevronDown />
              </button>

              {expandedSections.includes(sec.id) &&
                sec.lessons.map((lesson: any) => (
                  <div
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson)}
                    className="p-3 cursor-pointer hover:bg-gray-100"
                  >
                    ▶ {lesson.title}
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
      {/* OPEN SIDEBAR BUTTON */}
    {!sidebarOpen && (
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-24 right-4 z-50 bg-purple-600 text-white p-3 rounded-full shadow-lg"
      >
        <Menu size={22} />
      </button>
    )}
    </div>  
      <Footer/>
    </>
    
  );
};

export default VideoPlayer;