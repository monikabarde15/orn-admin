import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronDown,
  X,
  Menu,
  PlayCircle,
  FileText,
  Clock3,
  Trophy,
  Star,
  Users,
  BookOpen,
} from "lucide-react";

import { useParams } from "react-router-dom";

import api from "../../services/api";

const VideoPlayer: React.FC = () => {

  const { id } = useParams();

  // =====================================================
  // STATES
  // =====================================================

  const [course, setCourse] =
    useState<any>(null);

  const [sections, setSections] =
    useState<any[]>([]);

  const [currentChapter, setCurrentChapter] =
    useState<any>(null);

  const [quizList, setQuizList] =
    useState<any[]>([]);

  const [selectedAnswers, setSelectedAnswers] =
    useState<any>({});

  const [currentQuizIndex, setCurrentQuizIndex] =
    useState(0);

  const [showResult, setShowResult] =
    useState(false);

  const [score, setScore] =
    useState(0);

  const [showFeedback, setShowFeedback] =
    useState(false);

  const [feedbackText, setFeedbackText] =
    useState("");

  const [certificateGenerated, setCertificateGenerated] =
    useState(false);

  const [timeLeft, setTimeLeft] =
    useState(30);

  const [expandedSections, setExpandedSections] =
    useState<string[]>([]);

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [activeTab, setActiveTab] =
    useState("overview");

  const videoRef =
    useRef<HTMLVideoElement>(null);

  // =====================================================
  // LOGIN
  // =====================================================

  const token =
    localStorage.getItem(
      "access_token"
    );

  const userId =
    localStorage.getItem(
      "userId"
    );

  const isLoggedIn =
    !!token && !!userId;

  // =====================================================
  // FETCH COURSE
  // =====================================================

  useEffect(() => {

    if (!id) return;

    const fetchCourseDetails =
      async () => {

        try {

          const res =
            await api.get(
              `/api/v1/course/${id}`
            );

          const data =
            res?.data?.data;

          console.log(
            "COURSE => ",
            data
          );

          setCourse(data);

          // FORMAT SECTIONS

          const formattedSections =
            data?.courseContent?.map(
              (section: any) => ({

                id: section._id,

                title:
                  section.sectionName,

                lessons:
                  section?.subSection?.map(
                    (sub: any) => ({

                      id: sub._id,

                      title:
                        sub.title,

                      description:
                        sub.description,

                      video:
                        sub.videoUrl || "",

                      timeDuration:
                        sub.timeDuration ||
                        "10",

                      quizzes:
                        sub.quizzes || [],
                    })
                  ) || [],
              })
            ) || [];

          setSections(
            formattedSections
          );

          // AUTO PLAY FIRST LESSON

          if (
            formattedSections.length > 0
          ) {

            setExpandedSections([
              formattedSections[0].id,
            ]);

            if (
              formattedSections[0]
                .lessons.length > 0
            ) {

              const firstLesson =
                formattedSections[0]
                  .lessons[0];

              setCurrentChapter(
                firstLesson
              );

              setQuizList(
                firstLesson.quizzes || []
              );
            }
          }

        } catch (error) {

          console.log(error);
        }
      };

    fetchCourseDetails();

  }, [id]);

  // =====================================================
  // TIMER
  // =====================================================

  useEffect(() => {

    if (
      activeTab !== "quiz" ||
      showResult
    )
      return;

    if (timeLeft === 0) {

      handleQuizSubmit();

      return;
    }

    const timer =
      setTimeout(() => {

        setTimeLeft(
          (prev) => prev - 1
        );

      }, 1000);

    return () =>
      clearTimeout(timer);

  }, [
    timeLeft,
    activeTab,
    showResult,
  ]);

  // =====================================================
  // LESSON CLICK
  // =====================================================

  const handleLessonClick = (
    lesson: any
  ) => {

    setCurrentChapter(
      lesson
    );

    setQuizList(
      lesson.quizzes || []
    );

    setSelectedAnswers({});

    setCurrentQuizIndex(0);

    setShowResult(false);

    setTimeLeft(30);

    setActiveTab(
      "overview"
    );
  };

  // =====================================================
  // QUIZ SUBMIT
  // =====================================================

  const handleQuizSubmit =
    () => {

      let correct = 0;

      quizList.forEach(
        (
          q: any,
          i: number
        ) => {

          const selected =
            selectedAnswers[i];

          const correctOpt =
            q.options?.find(
              (o: any) =>
                o.is_correct
            );

          if (
            selected ===
            correctOpt?.id
          ) {
            correct++;
          }
        }
      );

      setScore(correct);

      setShowResult(true);
    };

  // =====================================================
  // FEEDBACK
  // =====================================================

  const handleFeedbackSubmit =
    () => {

      setCertificateGenerated(
        true
      );
    };

  // =====================================================
  // NEXT LESSON
  // =====================================================

  const goToNextChapter =
    () => {

      for (let sec of sections) {

        const index =
          sec.lessons.findIndex(
            (l: any) =>
              l.id ===
              currentChapter.id
          );

        if (
          index !== -1 &&
          index <
            sec.lessons.length - 1
        ) {

          handleLessonClick(
            sec.lessons[index + 1]
          );

          return;
        }
      }
    };

  // =====================================================
  // PREV LESSON
  // =====================================================

  const goToPrevChapter =
    () => {

      for (let sec of sections) {

        const index =
          sec.lessons.findIndex(
            (l: any) =>
              l.id ===
              currentChapter.id
          );

        if (index > 0) {

          handleLessonClick(
            sec.lessons[index - 1]
          );

          return;
        }
      }
    };

  // =====================================================
  // TOGGLE SECTION
  // =====================================================

  const toggleSection = (
    id: string
  ) => {

    setExpandedSections(
      (prev) =>
        prev.includes(id)
          ? prev.filter(
              (i) => i !== id
            )
          : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex">

      {/* ===================================================== */}
      {/* MAIN */}
      {/* ===================================================== */}

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* VIDEO */}

        <div className="bg-black aspect-video rounded-b-[30px] overflow-hidden relative shadow-2xl">

          {currentChapter?.video ? (

            <video
              ref={videoRef}
              src={
                currentChapter.video
              }
              controls
              autoPlay
              controlsList="nodownload"
              className="w-full h-full"
            />

          ) : course?.thumbnail ? (

            <img
              src={
                course.thumbnail
              }
              alt="thumbnail"
              className="w-full h-full object-cover"
            />
          ) : (

            <div className="h-full flex items-center justify-center">
              Loading...
            </div>
          )}
        </div>

        {/* HEADER */}

        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-8">

          <h1 className="text-4xl font-bold">

            {currentChapter?.title ||
              course?.courseName}
          </h1>

          <p className="mt-4 text-lg text-purple-100">

            {currentChapter?.description ||
              course?.courseDescription}
          </p>

          <div className="flex flex-wrap gap-4 mt-6">

            <div className="bg-white/10 px-4 py-2 rounded-full flex items-center gap-2">
              <Users size={18} />
              {
                course?.studentsEnrolled
                  ?.length || 0
              }
            </div>

            <div className="bg-white/10 px-4 py-2 rounded-full flex items-center gap-2">
              <BookOpen size={18} />
              {
                course?.category?.name
              }
            </div>

            <div className="bg-white/10 px-4 py-2 rounded-full flex items-center gap-2">
              💰 ₹ {course?.price}
            </div>

            <div className="bg-white/10 px-4 py-2 rounded-full flex items-center gap-2">
              <Star size={18} />
              {
                course
                  ?.ratingAndReviews
                  ?.length || 0
              }
            </div>
          </div>
        </div>

        {/* CONTENT */}

        <div className="flex-1 overflow-y-auto bg-slate-100 text-black p-8">

          {/* NAV BUTTONS */}

          <div className="flex justify-between mb-6">

            <button
              onClick={
                goToPrevChapter
              }
              className="bg-gray-300 hover:bg-gray-400 px-5 py-3 rounded-2xl"
            >
              ⬅ Previous
            </button>

            <button
              onClick={
                goToNextChapter
              }
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-2xl"
            >
              Next ➡
            </button>
          </div>

          {/* TABS */}

          <div className="flex flex-wrap gap-4 border-b pb-5 mb-8">

            <button
              onClick={() =>
                setActiveTab(
                  "overview"
                )
              }
              className={`px-5 py-2 rounded-xl font-semibold transition ${
                activeTab ===
                "overview"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Overview
            </button>

            {course?.ebook && (
              <button
                onClick={() =>
                  setActiveTab(
                    "pdf"
                  )
                }
                className={`px-5 py-2 rounded-xl font-semibold transition ${
                  activeTab ===
                  "pdf"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                PDF Notes
              </button>
            )}

            {quizList?.length >
              0 && (
              <button
                onClick={() =>
                  setActiveTab(
                    "quiz"
                  )
                }
                className={`px-5 py-2 rounded-xl font-semibold transition ${
                  activeTab ===
                  "quiz"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Quiz
              </button>
            )}
          </div>

          {/* ===================================================== */}
          {/* OVERVIEW */}
          {/* ===================================================== */}

          {activeTab ===
            "overview" && (

            <div className="space-y-8">

              {/* INFO CARDS */}

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

                <div className="bg-white p-6 rounded-3xl shadow">
                  <h3 className="font-bold text-xl">
                    Instructor
                  </h3>

                  <p className="mt-3 text-gray-600">
                    {
                      course
                        ?.instructor
                        ?.firstName
                    }{" "}
                    {
                      course
                        ?.instructor
                        ?.lastName
                    }
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow">
                  <h3 className="font-bold text-xl">
                    Category
                  </h3>

                  <p className="mt-3 text-gray-600">
                    {
                      course
                        ?.category
                        ?.name
                    }
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow">
                  <h3 className="font-bold text-xl">
                    Price
                  </h3>

                  <p className="mt-3 text-gray-600">
                    ₹{" "}
                    {
                      course?.price
                    }
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow">
                  <h3 className="font-bold text-xl">
                    Students
                  </h3>

                  <p className="mt-3 text-gray-600">
                    {
                      course
                        ?.studentsEnrolled
                        ?.length || 0
                    }
                  </p>
                </div>
              </div>

              {/* DESCRIPTION */}

              <div className="bg-white p-8 rounded-3xl shadow">

                <h2 className="text-3xl font-bold mb-4">
                  About Course
                </h2>

                <p className="text-gray-700 leading-8">
                  {
                    course?.courseDescription
                  }
                </p>
              </div>

              {/* LEARN */}

              <div className="bg-white p-8 rounded-3xl shadow">

                <h2 className="text-3xl font-bold mb-4">
                  What You'll Learn
                </h2>

                <p className="text-gray-700 leading-8">
                  {
                    course?.whatYouWillLearn
                  }
                </p>
              </div>

              {/* MODULES */}

              <div className="bg-white p-8 rounded-3xl shadow">

                <h2 className="text-3xl font-bold mb-8">
                  Course Modules
                </h2>

                <div className="space-y-8">

                  {course?.courseContent?.map(
                    (
                      section: any,
                      secIndex: number
                    ) => (

                      <div
                        key={
                          section._id
                        }
                        className="border rounded-3xl overflow-hidden"
                      >

                        <div className="bg-purple-600 text-white p-5">

                          <h3 className="text-2xl font-bold">
                            Module{" "}
                            {
                              secIndex + 1
                            }
                            :
                            {" "}
                            {
                              section.sectionName
                            }
                          </h3>
                        </div>

                        <div className="p-6 space-y-5">

                          {section?.subSection?.map(
                            (
                              sub: any,
                              subIndex: number
                            ) => (

                              <div
                                key={
                                  sub._id
                                }
                                className="border rounded-2xl p-5 hover:shadow-xl transition"
                              >

                                <div className="flex gap-5">

                                  <div className="bg-purple-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl">

                                    {
                                      subIndex + 1
                                    }
                                  </div>

                                  <div className="flex-1">

                                    <h4 className="text-2xl font-bold">
                                      {
                                        sub.title
                                      }
                                    </h4>

                                    <p className="text-gray-600 mt-3">
                                      {
                                        sub.description
                                      }
                                    </p>

                                    <div className="flex flex-wrap gap-3 mt-5">

                                      {sub.videoUrl && (
                                        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm">
                                          🎥 Video
                                        </span>
                                      )}

                                      {course?.ebook && (
                                        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm">
                                          📄 PDF
                                        </span>
                                      )}

                                      {sub
                                        .quizzes
                                        ?.length >
                                        0 && (
                                        <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm">
                                          📝 Quiz
                                        </span>
                                      )}

                                      <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm">
                                        ⏱{" "}
                                        {
                                          sub.timeDuration
                                        }{" "}
                                        min
                                      </span>
                                    </div>

                                    <button
                                      onClick={() =>
                                        handleLessonClick(
                                          {
                                            id: sub._id,
                                            title:
                                              sub.title,
                                            description:
                                              sub.description,
                                            video:
                                              sub.videoUrl,
                                            timeDuration:
                                              sub.timeDuration,
                                            quizzes:
                                              sub.quizzes ||
                                              [],
                                          }
                                        )
                                      }
                                      className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl"
                                    >
                                      Start Lesson
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PDF */}

          {activeTab ===
            "pdf" &&
            course?.ebook && (

            <div className="bg-white rounded-3xl overflow-hidden shadow">

              <iframe
                src={`http://localhost:4000${course?.ebook}`}
                className="w-full h-[900px]"
                title="ebook"
              />
            </div>
          )}

          {/* QUIZ */}

          {activeTab ===
            "quiz" &&
            quizList.length > 0 &&
            !showResult && (

            <div className="bg-white rounded-3xl shadow p-8">

              <p className="text-red-500 font-bold mb-5">
                ⏱ Time Left:
                {" "}
                {timeLeft}s
              </p>

              <h2 className="text-3xl font-bold mb-5">

                Question{" "}
                {
                  currentQuizIndex + 1
                }{" "}
                /
                {
                  quizList.length
                }
              </h2>

              <p className="text-xl mb-8">

                {
                  quizList[
                    currentQuizIndex
                  ]?.question
                }
              </p>

              <div className="space-y-4">

                {quizList[
                  currentQuizIndex
                ]?.options?.map(
                  (
                    opt: any
                  ) => (

                    <label
                      key={
                        opt.id
                      }
                      className={`block border p-5 rounded-2xl cursor-pointer ${
                        selectedAnswers[
                          currentQuizIndex
                        ] ===
                        opt.id
                          ? "border-purple-600 bg-purple-100"
                          : ""
                      }`}
                    >

                      <input
                        type="radio"
                        className="mr-3"
                        checked={
                          selectedAnswers[
                            currentQuizIndex
                          ] ===
                          opt.id
                        }
                        onChange={() =>
                          setSelectedAnswers(
                            {
                              ...selectedAnswers,

                              [currentQuizIndex]:
                                opt.id,
                            }
                          )
                        }
                      />

                      {opt.text}
                    </label>
                  )
                )}
              </div>

              <div className="flex justify-between mt-8">

                <button
                  disabled={
                    currentQuizIndex ===
                    0
                  }
                  onClick={() =>
                    setCurrentQuizIndex(
                      (
                        p
                      ) => p - 1
                    )
                  }
                  className="bg-gray-300 px-5 py-3 rounded-2xl"
                >
                  Prev
                </button>

                {currentQuizIndex <
                quizList.length - 1 ? (

                  <button
                    onClick={() =>
                      setCurrentQuizIndex(
                        (
                          p
                        ) => p + 1
                      )
                    }
                    className="bg-blue-600 text-white px-5 py-3 rounded-2xl"
                  >
                    Next
                  </button>

                ) : (

                  <button
                    onClick={
                      handleQuizSubmit
                    }
                    className="bg-green-600 text-white px-5 py-3 rounded-2xl"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          )}

          {/* RESULT */}

          {showResult && (

            <div className="bg-purple-700 text-white p-8 rounded-3xl">

              <h2 className="text-4xl font-bold">
                🎉 Quiz Completed
              </h2>

              <p className="text-2xl mt-5">
                Score:
                {" "}
                {score}/
                {quizList.length}
              </p>

              {!showFeedback &&
                !certificateGenerated && (

                  <button
                    onClick={() =>
                      setShowFeedback(
                        true
                      )
                    }
                    className="bg-black px-6 py-3 rounded-2xl mt-6"
                  >
                    Give Feedback
                  </button>
                )}

              {showFeedback &&
                !certificateGenerated && (

                  <div className="mt-6">

                    <textarea
                      value={
                        feedbackText
                      }
                      onChange={(
                        e
                      ) =>
                        setFeedbackText(
                          e.target.value
                        )
                      }
                      className="w-full rounded-2xl p-5 text-black"
                    />

                    <button
                      onClick={
                        handleFeedbackSubmit
                      }
                      className="bg-white text-black px-6 py-3 rounded-2xl mt-4"
                    >
                      Submit Feedback
                    </button>
                  </div>
                )}

              {certificateGenerated && (

                <button
                  onClick={
                    goToNextChapter
                  }
                  className="bg-green-500 px-6 py-3 rounded-2xl mt-6"
                >
                  Next Chapter
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===================================================== */}
      {/* SIDEBAR */}
      {/* ===================================================== */}

      {sidebarOpen && (

        <div className="w-[370px] bg-white text-black overflow-y-auto border-l">

          <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white z-10">

            <h2 className="text-2xl font-bold">
              Course Content
            </h2>

            <button
              onClick={() =>
                setSidebarOpen(
                  false
                )
              }
            >
              <X />
            </button>
          </div>

          <div className="p-4 space-y-5">

            {sections.map((sec) => (

              <div
                key={sec.id}
              >

                <button
                  onClick={() =>
                    toggleSection(
                      sec.id
                    )
                  }
                  className="w-full bg-gray-100 p-4 rounded-2xl flex justify-between items-center"
                >

                  <span className="font-bold">
                    {sec.title}
                  </span>

                  <ChevronDown />
                </button>

                {expandedSections.includes(
                  sec.id
                ) && (

                  <div className="space-y-4 mt-4">

                    {sec.lessons.map(
                      (
                        lesson: any
                      ) => (

                        <div
                          key={
                            lesson.id
                          }
                          onClick={() =>
                            handleLessonClick(
                              lesson
                            )
                          }
                          className={`p-5 rounded-2xl cursor-pointer border transition ${
                            currentChapter?.id ===
                            lesson.id
                              ? "bg-purple-100 border-purple-500"
                              : "bg-white hover:bg-gray-50"
                          }`}
                        >

                          <div className="flex gap-4">

                            <div className="bg-purple-600 text-white w-12 h-12 rounded-xl flex items-center justify-center">
                              <PlayCircle />
                            </div>

                            <div className="flex-1">

                              <h3 className="font-bold text-lg">
                                {
                                  lesson.title
                                }
                              </h3>

                              <p className="text-sm text-gray-500 mt-2">
                                {
                                  lesson.description
                                }
                              </p>

                              <div className="flex gap-3 flex-wrap mt-4">

                                {lesson.video && (
                                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                                    Video
                                  </span>
                                )}

                                {course?.ebook && (
                                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                                    PDF
                                  </span>
                                )}

                                {lesson
                                  ?.quizzes
                                  ?.length >
                                  0 && (
                                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">
                                    Quiz
                                  </span>
                                )}

                                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                                  <Clock3 size={12} />
                                  {
                                    lesson.timeDuration
                                  }{" "}
                                  min
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MOBILE BTN */}

      {!sidebarOpen && (

        <button
          onClick={() =>
            setSidebarOpen(
              true
            )
          }
          className="fixed top-24 right-5 bg-purple-600 p-4 rounded-full shadow-2xl"
        >
          <Menu />
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;