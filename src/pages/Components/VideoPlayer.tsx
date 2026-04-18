import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  X,
  Menu,
} from "lucide-react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const VideoPlayer: React.FC = () => {
  const { id } = useParams();

  const [course, setCourse] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [currentChapter, setCurrentChapter] = useState<any>(null);

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
    await api.post(`/api/feedback/feedback_vc/`, {
      course: id,
      feedback: feedbackText,
    });

    await api.post(`/certificate/certificate/`, {
      certificate: "Completed",
      title: course.title,
      issue_date: new Date().toISOString().split("T")[0],
      expiry_date: new Date().toISOString().split("T")[0],
      is_active: true,
      user: 1,
      course: id,
    });

    alert("🎉 Certificate Generated!");
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
    <div className="min-h-screen bg-slate-900 text-white flex">

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* CONTENT */}
        <div className="bg-black aspect-video">
          {currentChapter?.video ? (
            <video
              ref={videoRef}
              src={`https://${currentChapter.video}`}
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
          ) : currentChapter?.thumbnail || course?.thumbnail ? (
            <img
              src={currentChapter?.thumbnail || course?.thumbnail}
              className="w-full h-full object-cover"
            />
          ) : currentChapter?.file ? (
            <iframe src={currentChapter.file} className="w-full h-full" />
          ) : (
            <div className="flex items-center justify-center h-full">
              No Document Found
            </div>
          )}
        </div>

        {/* TABS */}
        <div className="bg-white text-black p-4">
          <div className="flex gap-4 border-b mb-4">
            <button onClick={() => setActiveTab("overview")}>Overview</button>
            <button onClick={() => setActiveTab("quiz")}>Quiz</button>
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
            <div className="bg-green-100 p-4">
              Score: {score}/{quizList.length}

              <button
                onClick={() => setShowFeedback(true)}
                className="block mt-2 bg-purple-500 text-white px-3 py-1"
              >
                Feedback
              </button>

              <button
                onClick={goToNextChapter}
                className="block mt-2 bg-blue-500 text-white px-3 py-1"
              >
                Next Chapter ▶
              </button>
            </div>
          )}

          {/* FEEDBACK */}
          {showFeedback && (
            <div>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full border p-2"
              />
              <button
                onClick={handleFeedbackSubmit}
                className="mt-2 bg-green-500 text-white px-3 py-1"
              >
                Submit
              </button>
            </div>
          )}
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
    </div>
  );
};

export default VideoPlayer;