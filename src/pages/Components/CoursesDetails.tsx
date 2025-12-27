import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock, GraduationCap, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ================= AXIOS ================= */

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

/* ================= COMPONENT ================= */

export default function CoursesList() {
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  /* 🔥 FRONTEND PAGINATION CONFIG */
  const PAGE_SIZE = 3;       // items per page
  const PAGE_GROUP_SIZE = 3; // page numbers group

  /* ================= FETCH ALL COURSES ================= */

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/course/courses/");
      setAllCourses(res.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  /* ================= FRONTEND PAGINATION LOGIC ================= */

  const totalItems = allCourses.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const visibleCourses = allCourses.slice(startIndex, endIndex);

  /* 3–3 PAGE GROUP */
  const currentGroup = Math.ceil(page / PAGE_GROUP_SIZE);
  const startPage = (currentGroup - 1) * PAGE_GROUP_SIZE + 1;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPages);

  const pages: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#0b0617] py-20 px-6">
      <div className="max-w-6xl mx-auto">

        {loading && (
          <p className="text-center text-gray-400 mb-6">
            Loading courses...
          </p>
        )}

        {/* COURSES */}
        <div className="grid md:grid-cols-3 gap-6">
          {visibleCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
            >
              <img
                src={
                  course.thumbnail?.image_url ||
                  "https://cfvod.kaltura.com/p/1727411/sp/172741100/thumbnail/entry_id/1_dsoakh0b/version/100000/width/412/height/248"
                }
                className="h-40 w-full object-cover"
              />

              <div className="p-4">
                <h3 className="text-white font-semibold text-lg">
                  {course.title}
                </h3>

                <p className="text-gray-400 text-sm my-2 line-clamp-2">
                  {course.description}
                </p>

                <div className="text-gray-300 text-sm space-y-1">
                  <div className="flex gap-2 items-center">
                    <Tag size={14} /> {course.category}
                  </div>
                  <div className="flex gap-2 items-center">
                    <GraduationCap size={14} /> {course.difficulty}
                  </div>
                  <div className="flex gap-2 items-center">
                    <Clock size={14} /> {course.duration}
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-white font-bold">
                    ₹{course.price}
                  </span>

                  <button
                    onClick={() =>
                      navigate(`/course-preview/${course.id}`)
                    }
                    className="px-3 py-1 bg-purple-600 text-white rounded"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= PAGINATION ================= */}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">

            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 bg-white/10 text-white rounded disabled:opacity-40"
            >
              Prev
            </button>

            {pages.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded ${
                  page === p
                    ? "bg-purple-500 text-white"
                    : "bg-white/10 text-gray-300"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 bg-white/10 text-white rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
