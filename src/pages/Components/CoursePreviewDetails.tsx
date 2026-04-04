import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import Navbar from "../../pages/Components/Navbar";
import Footer from "../Components/Footer";

const API = "https://dev.backend.onrequestlab.com";

export default function CoursePreviewPage() {

  const { id } = useParams();

  // ================= API =================
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["course-preview", id],
    queryFn: async () => {
      const res = await axios.get(`${API}/course/courses/${id}/preview/`);
      return res.data;
    },
    enabled: !!id,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // ================= MEMO =================
  const course = useMemo(() => {
    if (!data) return null;

    const totalChapters = data.modules?.reduce(
      (acc, m) => acc + (m.chapters?.length || 0),
      0
    );

    return {
      title: data.subscription_name || data.title,
      description: data.description,
      modules: data.modules || [],
      totalModules: data.modules?.length || 0,
      totalChapters,
      price: data.price || "₹5,000",
      thumbnail: data.thumbnail,
      category: data.category,
      difficulty: data.difficulty,
      duration: data.duration,
      instructor: data.instructor,
    };
  }, [data]);

  const bg =
    course?.thumbnail?.image
      ? `https://${course.thumbnail.image}`
      : "/assets/hero-bg.jpg";

  if (isLoading || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="w-14 h-14 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0718] text-white">

      <Navbar />

      {/* 🔥 TOP LOADER */}
      {isFetching && (
        <div className="fixed top-0 left-0 w-full h-1 bg-purple-500 animate-pulse z-50" />
      )}

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-4">

        <img src={bg} className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 max-w-3xl">

          <h1 className="text-4xl md:text-6xl font-bold">{course.title}</h1>

          <p className="text-gray-400 mt-4">{course.description}</p>

          <div className="mt-4 text-sm text-gray-400">
            {course.category} • {course.difficulty} • {course.duration}
          </div>

          <p className="text-3xl text-cyan-400 mt-6 font-bold">
            {course.price}
          </p>

          <button className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
            Enroll Now →
          </button>

        </div>
      </section>

      {/* ================= COURSE CONTENT ================= */}
      <section className="py-20 px-6">

        <h2 className="text-3xl font-bold text-center mb-12">
          Course Content 📚
        </h2>

        <div className="max-w-5xl mx-auto space-y-6">

          {course.modules.map((m, index) => (
            <div key={m.id} className="bg-[#110717] rounded-2xl border border-[#2b2136] overflow-hidden">

              <div className="p-5 border-b border-[#2b2136] flex justify-between">
                <h3 className="font-semibold">
                  Module {index + 1}: {m.title}
                </h3>
                <span className="text-xs text-gray-400">
                  {m.chapters?.length} Lessons
                </span>
              </div>

              {m.chapters?.map((c, i) => (
                <div key={c.id} className="p-5 border-b border-[#2b2136]">

                  <p className="font-medium">{i + 1}. {c.title}</p>

                  <p className="text-sm text-gray-400">{c.description}</p>

                  {/* VIDEO */}
                  {c.video && (
                    <video controls className="mt-3 rounded w-full max-h-[250px]">
                      <source src={`https://${c.video}`} />
                    </video>
                  )}

                  {/* FILE */}
                  {c.file && (
                    <a
                      href={`https://${c.file}`}
                      target="_blank"
                      className="text-blue-400 underline text-sm"
                    >
                      Download Resource
                    </a>
                  )}

                  {/* QUIZ */}
                  {c.quizzes?.length > 0 && (
                    <div className="mt-4 p-4 bg-[#0f0b16] rounded-xl border border-purple-500/20">

                      <h4 className="text-purple-400 mb-2">
                        Quiz ({c.quizzes.length})
                      </h4>

                      {c.quizzes.map((q) => (
                        <div key={q.id} className="mb-3">

                          <p className="mb-2">❓ {q.question}</p>

                          {q.options.map((opt) => (
                            <div
                              key={opt.id}
                              className={`px-3 py-2 rounded mb-1 text-sm
                                ${opt.is_correct
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-[#1a1024]"
                                }`}
                            >
                              {opt.text}
                            </div>
                          ))}

                        </div>
                      ))}

                    </div>
                  )}

                </div>
              ))}

            </div>
          ))}

        </div>

      </section>

      {/* ================= STATS ================= */}
      <section className="py-20 text-center">

        <h2 className="text-3xl font-bold mb-6">What You Get</h2>

        <p className="text-gray-400 text-lg">
          {course.totalModules} Modules • {course.totalChapters} Lessons
        </p>

      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 text-center">

        <h2 className="text-4xl font-bold mb-6">
          Start Learning Today 🚀
        </h2>

        <p className="text-2xl text-cyan-400 mb-6">
          {course.price}
        </p>

        <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
          Get Instant Access →
        </button>

      </section>

      <Footer />
    </main>
  );
}