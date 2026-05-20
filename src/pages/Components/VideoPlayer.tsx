import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronDown,
  X,
  Menu,
  Clock3,
  PlayCircle,
  FileText,
  Trophy,
  CheckCircle2,
  BookOpen,
  Star,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import { useParams } from "react-router-dom";

import api from "../../services/api";

const VideoPlayer: React.FC = () => {
  const { id } = useParams();

  const [loading, setLoading] =
    useState(false);

  const [course, setCourse] =
    useState<any>(null);

  const [sections, setSections] =
    useState<any[]>([]);

  const [currentLesson, setCurrentLesson] =
    useState<any>(null);

  const [quizList, setQuizList] =
    useState<any[]>([]);

  const [expandedSections, setExpandedSections] =
    useState<string[]>([]);

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [selectedAnswers, setSelectedAnswers] =
    useState<any>({});

  const [showResult, setShowResult] =
    useState(false);

  const [score, setScore] =
    useState(0);

  const [timeLeft, setTimeLeft] =
    useState(60);

  const [completedLessons, setCompletedLessons] =
    useState<string[]>([]);

  const videoRef =
    useRef<HTMLVideoElement>(null);

  // ======================================================
  // FETCH
  // ======================================================

  useEffect(() => {
    if (!id) return;

    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);

      const res = await api.post(
        "/api/v1/course/getFullCourseDetails",
        {
          courseId: id,
        }
      );

      const data =
        res?.data?.data;

      setCourse(data);

      const formattedSections =
        data?.courseContent?.map(
          (sec: any) => ({
            id: sec._id,
            title: sec.sectionName,

            lessons:
              sec.subSection?.map(
                (sub: any) => ({
                  id: sub._id,
                  title: sub.title,
                  description:
                    sub.description,
                  video: sub.videoUrl,
                  pdfUrl: sub.pdfUrl,
                  quizzes:
                    sub.quizzes || [],
                  timeDuration:
                    sub.timeDuration,
                })
              ) || [],
          })
        ) || [];

      setSections(formattedSections);

      setExpandedSections(
        formattedSections.map(
          (s: any) => s.id
        )
      );

      if (
        formattedSections?.[0]
          ?.lessons?.[0]
      ) {
        handleLessonClick(
          formattedSections[0]
            .lessons[0]
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // LESSON CLICK
  // ======================================================

  const handleLessonClick = (
    lesson: any
  ) => {
    setCurrentLesson(lesson);

    setQuizList(
      lesson.quizzes || []
    );

    setSelectedAnswers({});

    setShowResult(false);

    setScore(0);

    setTimeLeft(60);

    if (
      window.innerWidth < 1024
    ) {
      setSidebarOpen(false);
    }
  };

  // ======================================================
  // TOGGLE
  // ======================================================

  const toggleSection = (
    sectionId: string
  ) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter(
            (id) => id !== sectionId
          )
        : [...prev, sectionId]
    );
  };

  // ======================================================
  // TIMER
  // ======================================================

  useEffect(() => {
    if (showResult) return;

    if (timeLeft <= 0) {
      submitQuiz();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(
        (prev) => prev - 1
      );
    }, 1000);

    return () =>
      clearTimeout(timer);
  }, [timeLeft, showResult]);

  // ======================================================
  // SUBMIT QUIZ
  // ======================================================

  const submitQuiz = () => {
    let correct = 0;

    quizList.forEach(
      (
        q: any,
        index: number
      ) => {
        if (
          selectedAnswers[index] ===
          q.correctAnswer
        ) {
          correct++;
        }
      }
    );

    setScore(correct);

    setShowResult(true);
  };

  const percentage =
    quizList.length > 0
      ? Math.round(
          (score /
            quizList.length) *
            100
        )
      : 0;

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-5" />

          <h2 className="text-white text-xl font-medium">
            Loading Premium
            Experience...
          </h2>
        </div>
      </div>
    );
  }

  // ======================================================
  // NO COURSE
  // ======================================================

  if (!course) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center p-6">
        <div className="bg-[#0B1023] border border-white/5 rounded-[30px] p-10 max-w-md text-center">
          <AlertCircle
            size={70}
            className="mx-auto text-red-400 mb-5"
          />

          <h2 className="text-3xl font-semibold text-white">
            Course Not Found
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white flex overflow-hidden">
      {/* ====================================================== */}
      {/* OVERLAY */}
      {/* ====================================================== */}

      {sidebarOpen && (
        <div
          onClick={() =>
            setSidebarOpen(false)
          }
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* ====================================================== */}
      {/* SIDEBAR */}
      {/* ====================================================== */}

      <div
        className={`
        fixed top-0 left-0
        z-50
        h-screen
        w-[320px]

        bg-[#0A0F1F]/95
        backdrop-blur-2xl

        border-r border-white/5

        overflow-y-auto

        transition-all duration-300

        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }

        lg:translate-x-0
      `}
      >
        {/* HEADER */}

        <div className="sticky top-0 z-20 bg-[#0A0F1F]/95 backdrop-blur-xl border-b border-white/5 px-5 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Course Content
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              {sections.length} Sections
            </p>
          </div>

          <button
            onClick={() =>
              setSidebarOpen(false)
            }
            className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}

        <div className="p-4 space-y-5">
          {sections?.map((section) => (
            <div
              key={section.id}
              className="rounded-[28px] overflow-hidden bg-[#111827]/60 border border-white/5 backdrop-blur-xl"
            >
              <button
                onClick={() =>
                  toggleSection(
                    section.id
                  )
                }
                className="w-full px-5 py-5 flex items-center justify-between"
              >
                <div className="text-left">
                  <h3 className="font-medium">
                    {section.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1">
                    {
                      section.lessons
                        ?.length
                    }{" "}
                    lessons
                  </p>
                </div>

                <ChevronDown
                  className={`transition-all ${
                    expandedSections.includes(
                      section.id
                    )
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {expandedSections.includes(
                section.id
              ) && (
                <div className="px-4 pb-4 space-y-4">
                  {section.lessons?.map(
                    (lesson: any) => (
                      <div
                        key={lesson.id}
                        onClick={() =>
                          handleLessonClick(
                            lesson
                          )
                        }
                        className={`rounded-[24px] border p-5 cursor-pointer transition-all duration-300 ${
                          currentLesson?.id ===
                          lesson.id
                            ? "bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-400/20"
                            : "bg-[#0F172A]/70 border-white/5 hover:bg-[#1E293B]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-medium leading-7">
                              {lesson.title}
                            </h4>

                            <div className="flex flex-wrap gap-2 mt-4">
                              {lesson.video && (
                                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/10 text-blue-300 text-xs">
                                  Video
                                </span>
                              )}

                              {lesson.pdfUrl && (
                                <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-400/10 text-green-300 text-xs">
                                  PDF
                                </span>
                              )}

                              {lesson.quizzes
                                ?.length > 0 && (
                                <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-400/10 text-purple-300 text-xs">
                                  Quiz
                                </span>
                              )}
                            </div>
                          </div>

                          {completedLessons.includes(
                            lesson.id
                          ) && (
                            <CheckCircle2 className="text-green-400" />
                          )}
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

      {/* ====================================================== */}
      {/* MAIN */}
      {/* ====================================================== */}

      <div className="flex-1 overflow-y-auto lg:ml-[320px]">
        {/* ====================================================== */}
        {/* HERO */}
        {/* ====================================================== */}

        <div className="relative mx-4 lg:mx-6 mt-6 overflow-hidden rounded-[36px] border border-white/5 bg-[#0B1023] shadow-[0_10px_80px_rgba(0,0,0,0.4)]">
          {/* BG IMAGE */}

          <div className="absolute inset-0">
            <img
              src={
                course?.thumbnailImage
              }
              alt="thumbnail"
              className="w-full h-full object-cover opacity-30 scale-105 blur-[1px]"
            />

            <div className="absolute inset-0 bg-gradient-to-br from-[#050816] via-[#0B1023]/90 to-[#111827]/70" />
          </div>

          {/* CONTENT */}

          <div className="relative z-10 p-6 lg:p-10">
            <div className="grid xl:grid-cols-[1fr_420px] gap-10 items-center">
              {/* LEFT */}

              <div>
                {/* BADGES */}

                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/10 text-purple-200 text-xs">
                    {
                      course?.difficulty
                    }
                  </span>

                  <span className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/10 text-blue-200 text-xs">
                    ₹ {course?.price}
                  </span>

                  <span className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-slate-300 text-xs">
                    {
                      course?.category
                        ?.name
                    }
                  </span>
                </div>

                {/* TITLE */}

                <h1 className="text-[34px] lg:text-[62px] leading-[1.05] font-semibold tracking-[-2px] max-w-4xl">
                  {
                    course?.courseName
                  }
                </h1>

                {/* SUBTITLE */}

                <p className="text-slate-300 leading-8 mt-6 max-w-3xl text-[15px]">
                  {course?.subtitle}
                </p>

                {/* STATS */}

                <div className="flex flex-wrap gap-5 mt-8">
                  <div className="bg-white/5 border border-white/5 rounded-2xl px-5 py-4 flex items-center gap-4">
                    <BookOpen className="text-purple-300" />

                    <div>
                      <p className="text-xs text-slate-400">
                        Sections
                      </p>

                      <h4 className="font-medium mt-1">
                        {
                          sections.length
                        }
                      </h4>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/5 rounded-2xl px-5 py-4 flex items-center gap-4">
                    <Sparkles className="text-blue-300" />

                    <div>
                      <p className="text-xs text-slate-400">
                        Experience
                      </p>

                      <h4 className="font-medium mt-1">
                        Premium
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT */}

              <div className="relative">
                <div className="overflow-hidden rounded-[28px] border border-purple-500/10 bg-[#111827] shadow-[0_10px_50px_rgba(0,0,0,0.4)]">
                  <img
                    src={
                      course?.thumbnailImage
                    }
                    alt="course"
                    className="w-full h-[260px] object-cover"
                  />

                  <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-sm">
                    Premium Learning
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================== */}
        {/* VIDEO + PDF */}
        {/* ====================================================== */}

        <div className="grid xl:grid-cols-[1fr_320px] gap-6 px-4 lg:px-6 mt-6">
          {/* LEFT */}

          <div className="space-y-6">
            {/* VIDEO */}

            <div className="bg-[#0B1023] border border-white/5 rounded-[32px] overflow-hidden shadow-[0_10px_60px_rgba(0,0,0,0.35)]">
              {/* HEADER */}

              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <div>
                  <h2 className="text-lg font-medium">
                    {
                      currentLesson?.title
                    }
                  </h2>

                  <p className="text-sm text-slate-400 mt-1">
                    Current Lesson
                    Video
                  </p>
                </div>

                <div className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/10 text-purple-300 text-xs">
                  {
                    currentLesson?.timeDuration
                  }
                  s
                </div>
              </div>

              {/* PLAYER */}

              <div className="p-5">
                <div className="overflow-hidden rounded-[24px] border border-purple-500/10 bg-black">
                  {currentLesson?.video ? (
                    <video
                      ref={videoRef}
                      src={
                        currentLesson?.video
                      }
                      controls
                      className="w-full aspect-video"
                    />
                  ) : (
                    <div className="h-[400px] flex flex-col items-center justify-center">
                      <PlayCircle
                        size={70}
                        className="text-slate-500 mb-5"
                      />

                      <h2 className="text-2xl font-medium">
                        Video Not
                        Available
                      </h2>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* QUIZ */}

            {quizList?.length >
              0 && (
              <div className="bg-[#0F172A]/90 border border-white/5 rounded-[32px] p-6 lg:p-8 backdrop-blur-xl">
                {!showResult ? (
                  <>
                    {/* HEADER */}

                    <div className="flex flex-col lg:flex-row justify-between gap-6 mb-10">
                      <div>
                        <h2 className="text-3xl font-semibold">
                          Quiz Test
                        </h2>

                        <p className="text-slate-400 mt-3">
                          Complete
                          before timer
                          ends
                        </p>
                      </div>

                      {/* TIMER */}

                      <div className="w-24 h-24 rounded-2xl bg-[#111827] border border-purple-500/20 flex flex-col items-center justify-center">
                        <span className="text-3xl font-semibold">
                          {timeLeft}
                        </span>

                        <span className="text-xs text-slate-400 mt-1">
                          Seconds
                        </span>
                      </div>
                    </div>

                    {/* QUESTIONS */}

                    <div className="space-y-6">
                      {quizList?.map(
                        (
                          q: any,
                          qIndex: number
                        ) => (
                          <div
                            key={q._id}
                            className="bg-[#111827]/70 border border-white/5 rounded-[28px] p-6"
                          >
                            <h3 className="text-lg font-medium leading-8 mb-6">
                              Q
                              {qIndex +
                                1}
                              .{" "}
                              {
                                q.question
                              }
                            </h3>

                            <div className="space-y-4">
                              {q.options?.map(
                                (
                                  opt: any,
                                  optIndex: number
                                ) => (
                                  <button
                                    key={
                                      optIndex
                                    }
                                    onClick={() =>
                                      setSelectedAnswers(
                                        {
                                          ...selectedAnswers,

                                          [qIndex]:
                                            optIndex,
                                        }
                                      )
                                    }
                                    className={`w-full text-left rounded-2xl p-5 border transition-all duration-300 ${
                                      selectedAnswers[
                                        qIndex
                                      ] ===
                                      optIndex
                                        ? "bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-400/30"
                                        : "bg-[#111827] border-white/5 hover:border-purple-500/30 hover:bg-[#1E293B]"
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    {/* BUTTON */}

                    <button
                      onClick={
                        submitQuiz
                      }
                      className="mt-10 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] rounded-2xl px-10 py-4 font-medium"
                    >
                      Submit Quiz
                    </button>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] flex items-center justify-center mx-auto mb-8">
                      <Trophy
                        size={55}
                      />
                    </div>

                    <h2 className="text-4xl font-semibold">
                      Quiz
                      Completed
                    </h2>

                    <p className="text-slate-400 mt-4">
                      Your Score
                    </p>

                    <h3 className="text-6xl font-semibold text-purple-300 mt-5">
                      {score}/
                      {
                        quizList.length
                      }
                    </h3>

                    <p className="text-xl text-slate-300 mt-4">
                      {percentage}%
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT */}

          <div className="space-y-6">
            {/* PDF */}

            {currentLesson?.pdfUrl && (
              <div className="bg-[#0F172A]/90 border border-white/5 rounded-[32px] overflow-hidden backdrop-blur-xl">
                <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
                  <FileText
                    size={18}
                    className="text-green-300"
                  />

                  <h2 className="font-medium">
                    Lesson Notes
                  </h2>
                </div>

                <iframe
                  src={`http://localhost:4000${currentLesson?.pdfUrl}`}
                  className="w-full h-[420px]"
                />
              </div>
            )}

            {/* COURSE DETAILS */}

            <div className="bg-[#0F172A]/90 border border-white/5 rounded-[32px] p-6 backdrop-blur-xl">
              <h2 className="text-xl font-medium mb-6">
                Course Details
              </h2>

              <div className="space-y-5">
                <div>
                  <p className="text-sm text-slate-400">
                    Course Name
                  </p>

                  <h4 className="mt-2 font-medium">
                    {
                      course?.courseName
                    }
                  </h4>
                </div>

                <div>
                  <p className="text-sm text-slate-400">
                    Category
                  </p>

                  <h4 className="mt-2 font-medium">
                    {
                      course?.category
                        ?.name
                    }
                  </h4>
                </div>

                <div>
                  <p className="text-sm text-slate-400">
                    Difficulty
                  </p>

                  <h4 className="mt-2 font-medium">
                    {
                      course?.difficulty
                    }
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================== */}
      {/* OPEN BUTTON */}
      {/* ====================================================== */}

      {!sidebarOpen && (
        <button
          onClick={() =>
            setSidebarOpen(true)
          }
          className="fixed top-5 left-5 z-50 w-12 h-12 rounded-2xl bg-[#111827]/90 border border-white/5 backdrop-blur-xl flex items-center justify-center"
        >
          <Menu size={20} />
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;