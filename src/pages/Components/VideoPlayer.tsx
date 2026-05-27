import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  PlayCircle,
  FileText,
  ChevronDown,
  ChevronRight,
  Clock3,
  Users,
  Star,
  Award,
  CheckCircle,
  X,
  Menu,
} from "lucide-react";

import { useParams } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";

const VideoPlayer = () => {
  const { id } = useParams();

  const [course, setCourse] =
    useState<any>(null);

  const [sections, setSections] =
    useState<any[]>([]);

  const [currentLecture,
    setCurrentLecture] =
    useState<any>(null);

  const [expandedSections,
    setExpandedSections] =
    useState<string[]>([]);

  // SIDEBAR DEFAULT OPEN
  const [sidebarOpen,
    setSidebarOpen] =
    useState(true);

  const videoRef =
    useRef<HTMLVideoElement>(null);

  // FETCH COURSE
  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(
        "https://orn-ai-all-bakcned.onrender.com/api/v1/course/getFullCourseDetails",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            courseId: id,
          }),
        }
      );

      const result =
        await response.json();

      const data = {
        ...result.data,
        totalDuration:
          result.totalDuration,
      };

      setCourse(data);

      const formattedSections =
        data?.courseContent?.map(
          (section: any) => ({
            id: section._id,
            title:
              section.sectionName,

            lessons:
              section.subSection?.map(
                (sub: any) => ({
                  id: sub._id,
                  title: sub.title,
                  description:
                    sub.description,
                  videoUrl:
                    sub.videoUrl,
                  pdfUrl:
                    sub.pdfUrl,
                  duration:
                    sub.timeDuration,
                })
              ) || [],
          })
        ) || [];

      setSections(
        formattedSections
      );

      if (
        formattedSections.length >
          0 &&
        formattedSections[0]
          .lessons.length > 0
      ) {
        setCurrentLecture(
          formattedSections[0]
            .lessons[0]
        );

        setExpandedSections([
          formattedSections[0].id,
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // OPEN LECTURE
  const handleLecture = (
    lecture: any
  ) => {
    setCurrentLecture(lecture);

    // MOBILE PE SIDEBAR CLOSE
    if (
      window.innerWidth < 1024
    ) {
      setSidebarOpen(false);
    }
  };

  // AUTO NEXT
  const playNextLecture = () => {
    for (let sec of sections) {
      const index =
        sec.lessons.findIndex(
          (lesson: any) =>
            lesson.id ===
            currentLecture?.id
        );

      if (
        index !== -1 &&
        index <
          sec.lessons.length - 1
      ) {
        handleLecture(
          sec.lessons[index + 1]
        );

        return;
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f5f7fb]">

        {/* HERO */}
        <div className="relative overflow-hidden">

          {/* BG */}
          <div className="absolute inset-0">

            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-400/20 blur-[140px]" />

            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-400/20 blur-[140px]" />

          </div>

          {/* MAIN */}
          <div className="relative z-10 max-w-[1700px] mx-auto px-3 sm:px-4 lg:px-6 py-4 md:py-8">

            <div className="flex gap-6 relative">

              {/* LEFT CONTENT */}
              <div
                className={`
                  min-w-0 transition-all duration-300 ease-in-out
                  ${
                    sidebarOpen
                      ? "w-full lg:w-[calc(100%-380px)]"
                      : "w-full"
                  }
                `}
              >

                {/* VIDEO CARD */}
                <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">

                  <div className="w-full aspect-video">

                    {currentLecture?.videoUrl ? (

                      <video
                        ref={videoRef}
                        src={
                          currentLecture.videoUrl
                        }
                        controls
                        onEnded={
                          playNextLecture
                        }
                        className="w-full h-full object-cover"
                      />

                    ) : currentLecture?.pdfUrl ? (

                      <iframe
                        src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
                          currentLecture.pdfUrl
                        )}`}
                        className="w-full min-h-[400px] md:min-h-[700px] bg-white"
                        title="PDF"
                      />

                    ) : course?.promotionalVideo ? (

                      <video
                        src={
                          course.promotionalVideo
                        }
                        controls
                        className="w-full h-full object-cover"
                      />

                    ) : (

                      <img
                        src={
                          course?.thumbnailImage
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />

                    )}
                  </div>
                </div>

                {/* DETAILS */}
                <div className="mt-6 md:mt-8">

                  {/* TITLE */}
                  <h1 className="text-3xl md:text-5xl font-bold text-[#111827] leading-tight mb-3">
                    {
                      course?.courseName
                    }
                  </h1>

                  {/* SUBTITLE */}
                  <p className="text-base md:text-xl text-gray-600 mb-6">
                    {course?.subtitle}
                  </p>

                  {/* BADGES */}
                  <div className="grid grid-cols-2 lg:flex gap-3 mb-8">

                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3 flex items-center gap-2">
                      <Star
                        className="text-yellow-500"
                        size={18}
                      />
                      <span className="font-semibold text-sm md:text-base">
                        4.8 Rating
                      </span>
                    </div>

                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3 flex items-center gap-2">
                      <Users
                        className="text-blue-500"
                        size={18}
                      />
                      <span className="text-sm md:text-base">
                        {
                          course
                            ?.studentsEnrolled
                            ?.length
                        }{" "}
                        Students
                      </span>
                    </div>

                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3 flex items-center gap-2">
                      <Clock3
                        className="text-purple-500"
                        size={18}
                      />
                      <span className="text-sm md:text-base">
                        {
                          course?.totalDuration
                        }{" "}
                        sec
                      </span>
                    </div>

                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl px-4 py-3 font-semibold text-center text-sm md:text-base">
                      {
                        course?.difficulty
                      }
                    </div>

                    <div className="bg-green-600 text-white rounded-xl px-4 py-3 font-semibold text-center text-sm md:text-base">
                      ₹ {course?.price}
                    </div>
                  </div>

                  {/* WHAT YOU LEARN */}
                  <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100 mb-6">

                    <h2 className="text-2xl md:text-3xl font-bold text-[#111827] mb-6">
                      What you'll learn
                    </h2>

                    <div className="grid md:grid-cols-2 gap-5">

                      {course?.whatYouWillLearn?.map(
                        (
                          item: string,
                          index: number
                        ) => (
                          <div
                            key={index}
                            className="flex gap-3"
                          >

                            <CheckCircle
                              className="text-green-500 mt-1"
                              size={20}
                            />

                            <p className="text-gray-700 text-sm md:text-base">
                              {item}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100 mb-6">

                    <h2 className="text-2xl md:text-3xl font-bold text-[#111827] mb-5">
                      Course Description
                    </h2>

                    <p className="text-gray-700 leading-7 md:leading-8 text-sm md:text-base">
                      {
                        course?.courseDescription
                      }
                    </p>
                  </div>

                </div>
              </div>

              {/* SIDEBAR */}
              <div
                className={`
                  fixed lg:sticky
                  top-0 right-0
                  h-screen lg:h-[calc(100vh-40px)]
                  bg-white
                  border-l border-gray-200
                  shadow-2xl
                  overflow-y-auto
                  z-50
                  transition-all duration-300 ease-in-out

                  ${
                    sidebarOpen
                      ? "w-[90%] sm:w-[380px] lg:w-[380px] translate-x-0"
                      : "w-0 translate-x-full overflow-hidden border-0"
                  }
                `}
              >

                {/* HEADER */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-20">

                  <h2 className="text-xl md:text-2xl font-bold text-[#111827]">
                    Course Content
                  </h2>

                  {/* CLOSE BUTTON */}
                  <button
                    onClick={() =>
                      setSidebarOpen(false)
                    }
                    className="
                      flex items-center justify-center
                      w-10 h-10
                      rounded-full
                      bg-red-500 text-white
                      hover:bg-red-600
                      transition
                    "
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* BODY */}
                <div className="p-4">

                  {sections.map(
                    (section) => (
                      <div
                        key={section.id}
                        className="mb-4 border border-gray-200 rounded-2xl overflow-hidden"
                      >

                        {/* SECTION */}
                        <button
                          onClick={() =>
                            setExpandedSections(
                              (
                                prev
                              ) =>
                                prev.includes(
                                  section.id
                                )
                                  ? prev.filter(
                                      (
                                        item
                                      ) =>
                                        item !==
                                        section.id
                                    )
                                  : [
                                      ...prev,
                                      section.id,
                                    ]
                            )
                          }
                          className="w-full p-5 bg-gray-50 hover:bg-gray-100 flex justify-between"
                        >

                          <div className="text-left">

                            <h3 className="font-bold text-[#111827] text-sm md:text-base">
                              {
                                section.title
                              }
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                              {
                                section
                                  .lessons
                                  .length
                              }{" "}
                              lectures
                            </p>
                          </div>

                          {expandedSections.includes(
                            section.id
                          ) ? (
                            <ChevronDown />
                          ) : (
                            <ChevronRight />
                          )}
                        </button>

                        {/* LESSONS */}
                        {expandedSections.includes(
                          section.id
                        ) &&
                          section.lessons.map(
                            (
                              lesson: any
                            ) => (
                              <div
                                key={
                                  lesson.id
                                }
                                onClick={() =>
                                  handleLecture(
                                    lesson
                                  )
                                }
                                className={`p-4 cursor-pointer border-t border-gray-100 hover:bg-purple-50 transition ${
                                  currentLecture?.id ===
                                  lesson.id
                                    ? "bg-purple-100"
                                    : ""
                                }`}
                              >

                                <div className="flex gap-3">

                                  {lesson.videoUrl ? (
                                    <PlayCircle
                                      className="text-purple-600 mt-1"
                                      size={
                                        20
                                      }
                                    />
                                  ) : (
                                    <FileText
                                      className="text-blue-600 mt-1"
                                      size={
                                        20
                                      }
                                    />
                                  )}

                                  <div>

                                    <h3 className="font-semibold text-[#111827] text-sm md:text-base">
                                      {
                                        lesson.title
                                      }
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                      {
                                        lesson.duration
                                      }{" "}
                                      sec
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                      </div>
                    )
                  )}

                  {/* CERTIFICATE */}
                  <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-6 md:p-8 text-white mt-8">

                    <Award
                      size={50}
                      className="mb-5"
                    />

                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                      Get Certificate
                    </h2>

                    <p className="opacity-90 mb-6 leading-7 text-sm md:text-base">
                      Complete this
                      course and earn
                      your certificate.
                    </p>

                    <button className="bg-white text-purple-700 font-semibold px-6 py-4 rounded-2xl w-full">
                      Download
                      Certificate
                    </button>
                  </div>
                </div>
              </div>

              {/* OVERLAY */}
              {sidebarOpen && (
                <div
                  onClick={() =>
                    setSidebarOpen(
                      false
                    )
                  }
                  className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                />
              )}

              {/* OPEN BUTTON */}
              {!sidebarOpen && (
                <button
                  onClick={() =>
                    setSidebarOpen(
                      true
                    )
                  }
                  className="fixed bottom-5 right-5 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-2xl"
                >
                  <Menu size={24} />
                </button>
              )}

            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default VideoPlayer;