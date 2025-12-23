"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

/* ================= HELPERS ================= */

const getCookie = (name: string) => {
  if (typeof document === "undefined") return ""
  const v = `; ${document.cookie}`
  const parts = v.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift()
  return ""
}

/* ================= AXIOS ================= */

const api = axios.create({
  baseURL: "https://dev.backend.onrequestlab.com",
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

/* ================= PAGE ================= */

export default function EditCoursePage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCourse()
  }, [])

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/course/courses/${id}/`)
      setForm({
        title: res.data.title || "",
        description: res.data.description || "",
        category: res.data.category || "",
        price: res.data.price || "",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    await api.patch(`/course/courses/${id}/`, {
      ...form,
      price: Number(form.price || 0),
    })

    setSaving(false)
    navigate("/courses")
  }

  if (loading) {
    return <p className="text-center py-10">Loading course...</p>
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Course</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title"
          className="w-full border p-2 rounded"
        />

        <textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          placeholder="Description"
          className="w-full border p-2 rounded"
        />

        <input
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
          placeholder="Category"
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
          placeholder="Price"
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {saving ? "Saving..." : "Update Course"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
