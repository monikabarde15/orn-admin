import React, { useState } from "react";
import { Clock, GraduationCap, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { courses } from "../../mock/courses";

export default function CoursesList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 3;
  const PAGE_GROUP_SIZE = 3;

  // Use mock data
  const allCourses = courses;
  const totalItems = allCourses.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const visibleCourses = allCourses.slice(startIndex, endIndex);

  // Pagination group
  const currentGroup = Math.ceil(page / PAGE_GROUP_SIZE);
  const startPage = (currentGroup - 1) * PAGE_GROUP_SIZE + 1;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPages);
  const pages: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="min-h-screen bg-[#0b0617] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* COURSES */}
        <div className="grid md:grid-cols-3 gap-6">
          {visibleCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
            >
              <img
                src={
                  course.thumbnail?.image?.startsWith('http')
                    ? course.thumbnail.image
                    : `https://${course.thumbnail.image}`
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
