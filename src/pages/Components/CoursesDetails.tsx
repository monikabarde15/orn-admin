import React, { useEffect, useState } from "react";
import axios from "axios";
import { BookOpen, Clock, GraduationCap, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS

const api = axios.create({
  baseURL: "https://dev.backend.onrequestlab.com",
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("jwt-auth") ||
    "";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function CoursesList() {
  const navigate = useNavigate(); // ✅ ADD THIS

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const PAGE_SIZE = 6;

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/course/courses/", {
        params: { page, search },
      });
      setCourses(res.data.results || []);
      setCount(res.data.count || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, search]);

  const totalPages = Math.ceil(count / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0617] via-[#120a24] to-[#0b0617] py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-6 mb-14">
          <h1 className="text-4xl font-extrabold text-white">
            Explore Courses
          </h1>

          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-72 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* LOADER */}
        {loading && (
          <p className="text-center text-gray-400">
            Loading courses...
          </p>
        )}

        {/* COURSE GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course: any) => (
            <div
              key={course.id}
              className="group relative rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20"
            >
              <h3 className="text-2xl font-bold text-white mb-2">
                {course.title}
              </h3>

              <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                {course.description}
              </p>

              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-purple-400" />
                  Category: {course.category}
                </div>

                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                  Level: {course.difficulty}
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-400" />
                  Duration: {course.duration}
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <span className="text-xl font-bold text-white">
                  ₹{course.price}
                </span>

                <button
                  onClick={() => navigate(`/course-preview/${course.id}`)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold hover:opacity-90"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-16">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-40"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  page === i + 1
                    ? "bg-purple-500 text-white"
                    : "bg-white/10 text-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
