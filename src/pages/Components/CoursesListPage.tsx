"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react"

/* ================= AUTH HELPERS ================= */

const getCookie = (name: string) => {
  if (typeof document === "undefined") return ""
  const v = `; ${document.cookie}`
  const parts = v.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift()
  return ""
}
console.log(import.meta.env.VITE_API_URL);
const VIT=import.meta.env.VITE_API_URL;

/* ================= AXIOS ================= */

const api = axios.create({
  baseURL: `${VIT}`,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token =
    getCookie("access") ||
    localStorage.getItem("access") ||
    localStorage.getItem("jwt-auth")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  const csrf = getCookie("csrftoken")
  if (csrf) {
    config.headers["X-CSRFTOKEN"] = csrf
  }

  return config
})

/* ================= TYPES ================= */

interface Course {
  id: number
  title: string
  category: string
  price: string
  isPublished: boolean
}

/* ================= PAGE ================= */

export default function CoursesListPage() {
  const router = useNavigate()

  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await api.get("/course/courses/")
      setCourses(res.data.results || [])
    } catch (err) {
      console.error("Failed to fetch courses", err)
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  /* ================= DELETE ================= */

  const handleDelete = async (courseId: number) => {
    if (!window.confirm("Delete this course?")) return

    try {
      setDeletingId(courseId)
      await api.delete(`/course/courses/${courseId}/`)
      setCourses((prev) => prev.filter((c) => c.id !== courseId))
    } catch {
      alert("Failed to delete course")
    } finally {
      setDeletingId(null)
    }
  }

  /* ================= UI ================= */

  if (loading) {
    return <p className="text-center py-10">Loading courses...</p>
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Courses</h1>

        <button
          onClick={() => router("/create-course")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {courses.length === 0 && (
        <p className="text-gray-500">No courses found.</p>
      )}

      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex items-center justify-between border rounded-lg p-4 bg-white"
          >
            {/* LEFT */}
            <div>
              <h2 className="font-semibold text-lg">{course.title}</h2>
              <p className="text-sm text-gray-500">
                Category: {course.category || "—"}
              </p>
              <p className="text-sm font-medium">
                Price: ${course.price || 0}
              </p>

              {course.isPublished ? (
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
                onClick={() => router(`/courses/edit/${course.id}`)}
                className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50 flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>

              <button
                disabled={deletingId === course.id}
                onClick={() => handleDelete(course.id)}
                className="px-3 py-2 text-sm border rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50 flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                {deletingId === course.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
