"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";

import api from "../../services/api";

interface Course {
  _id: string;
  courseName: string;
  category?: {
    name?: string;
  };
  price?: string;
  status: string;
}

export default function CoursesListPage() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ================= FETCH COURSES =================

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/api/v1/course/getInstructorCourses"
      );

      console.log("Courses Response:", res.data);

      setCourses(res.data?.data || []);
    } catch (error) {
      console.log("Fetch courses error", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ================= DELETE COURSE =================

  const handleDelete = async (courseId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(courseId);

      const res = await api.delete(
        "/api/v1/course/deleteCourse",
        {
          data: {
            courseId,
          },
        }
      );

      console.log("Delete Response:", res.data);

      setCourses((prev) =>
        prev.filter((course) => course._id !== courseId)
      );
    } catch (error) {
      console.log("Delete error", error);
      alert("Failed to delete course");
    } finally {
      setDeletingId(null);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="text-center py-10 text-lg">
        Loading courses...
      </div>
    );
  }

  // ================= UI =================

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          My Courses
        </h1>

        <button
          onClick={() => navigate("/create-course")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {/* EMPTY */}
      {courses.length === 0 ? (
        <div className="text-gray-500">
          No courses found
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course._id}
              className="flex items-center justify-between border rounded-lg p-4 bg-white shadow-sm"
            >
              {/* LEFT */}
              <div>
                <h2 className="font-semibold text-lg">
                  {course.courseName}
                </h2>

                <p className="text-sm text-gray-500">
                  Category:{" "}
                  {course.category?.name || "N/A"}
                </p>

                {course.status === "Published" ? (
                  <span className="flex items-center gap-1 text-green-600 text-sm mt-1">
                    <CheckCircle className="w-4 h-4" />
                    Published
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-yellow-600 text-sm mt-1">
                    <XCircle className="w-4 h-4" />
                    Draft
                  </span>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    navigate(
                      `/courses/edit/${course._id}`
                    )
                  }
                  className="px-3 py-2 border rounded-md hover:bg-gray-50 flex items-center gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>

                <button
                  disabled={deletingId === course._id}
                  onClick={() =>
                    handleDelete(course._id)
                  }
                  className="px-3 py-2 border rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50 flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />

                  {deletingId === course._id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}