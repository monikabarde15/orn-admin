"use client"

import React, { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import {
  Plus, X, Clock, BookOpen, Video, ImageIcon, FileText,
  ChevronRight, ChevronDown, Check, Edit, Trash2, Upload, GripVertical
} from "lucide-react"

/* ================= HELPERS ================= */

const getCookie = (name: string) => {
  if (typeof document === "undefined") return ""
  const v = `; ${document.cookie}`
  const parts = v.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift()
  return ""
}

const userId = getCookie("user_id")

/* ================= AXIOS ================= */
console.log(import.meta.env.VITE_API_URL);
const VIT=import.meta.env.VITE_API_URL; 

const api = axios.create({
  baseURL: `${VIT}`,
  withCredentials: true,
})
const publicApi = axios.create({
  baseURL: `${VIT}`,
})
const privateApi = axios.create({
  baseURL: `${VIT}`,
  withCredentials: true,
})

privateApi.interceptors.request.use((config) => {
  const token =
    getCookie("access") || localStorage.getItem("access")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
const fetchSubscriptions = async (): Promise<Subscription[]> => {
  const res = await publicApi.get("/api/v1/packages/")
  return res.data
}

const mockApi = {
  // =========================
  // CREATE COURSE
  // =========================
  createCourse: async (data: CourseFormData): Promise<{ id: string; success: boolean }> => {
    const res = await privateApi.post(
      "/course/courses/",
      {
        title: data.title,
        description: data.description,
        category: data.category,
        difficulty: data.difficulty,
        duration: data.duration,
        instructor: data.instructor,
        price: Number(data.price || 0),
        learningOutcomes: data.learningOutcomes.join("\n"),
        prerequisites: data.prerequisites.join("\n"),
        isPublished: false,
        user: userId,
      }
    )

    return { id: String(res.data.id), success: true }
  },

  // =========================
  // ADD MODULE
  // =========================
  addModule: async (
    courseId: string,
    module: Omit<Module, "id">
  ): Promise<{ id: string; success: boolean }> => {
    const res = await privateApi.post(
      "/course/modules/",
      {
        title: module.title,
        description: module.description,
        order: Math.floor(Math.random() * 1000),
        course: courseId,
        user: userId,
      },
      
    )

    return { id: String(res.data.id), success: true }
  },

  // =========================
  // UPDATE MODULE
  // =========================
  updateModule: async (_moduleId: string, data: Partial<Module>): Promise<{ success: boolean }> => {
    await privateApi.patch(
      `/course/modules/${_moduleId}/`,
      data,
      
    )

    return { success: true }
  },

  // =========================
  // DELETE MODULE
  // =========================
  deleteModule: async (_moduleId: string): Promise<{ success: boolean }> => {
    await privateApi.delete(`/course/modules/${_moduleId}/`, {
    
    })

    return { success: true }
  },

  // =========================
  // ADD LESSON
  // =========================
  addLesson: async (
  moduleId: string,
  lesson: Omit<Lesson, "id">
): Promise<{ id: string; success: boolean }> => {
  const formData = new FormData()

  formData.append("title", lesson.title)
  formData.append("duration", lesson.duration)
  formData.append("description", lesson.content)
  formData.append("module", moduleId)
  formData.append("user", userId)

  if (lesson.videoFile) {
    formData.append("video_file", lesson.videoFile)
  }

  if (lesson.attachmentFile) {
    formData.append("attachment_file", lesson.attachmentFile)
  }

  const res = await privateApi.post("/course/chapter/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })

  return { id: String(res.data.id), success: true }
},


  // =========================
  // UPDATE LESSON
  // =========================
 updateLesson: async (
  lessonId: string,
  data: Partial<Lesson>
): Promise<{ success: boolean }> => {
  const formData = new FormData()

  if (data.title) formData.append("title", data.title)
  if (data.duration) formData.append("duration", data.duration)
  if (data.content) formData.append("description", data.content)
  if (data.videoFile) formData.append("video_file", data.videoFile)
  if (data.attachmentFile) formData.append("attachment_file", data.attachmentFile)

  await privateApi.patch(`/course/chapter/${lessonId}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })

  return { success: true }
}
,

  // =========================
  // DELETE LESSON
  // =========================
  deleteLesson: async (_lessonId: string): Promise<{ success: boolean }> => {
    await privateApi.delete(`/course/chapter/${_lessonId}/`, {
      
    })

    return { success: true }
  },
// =========================
  // QUIZ API METHODS ✅
  // =========================
   addQuiz : async (data: {
    chapter: number
    question: string
    options: { text: string; is_correct: boolean }[]
  }) => {
    return await privateApi.post("/course/quizzes/", data)
  },

   updateQuiz : async (
    quizId: string,
    data: {
      question: string
      options: { text: string; is_correct: boolean }[]
    }
  ) => {
    return await privateApi.patch(`/course/quizzes/${quizId}/`, data)
  },
  // =========================
// DELETE QUIZ
// =========================
deleteQuiz: async (
  quizId: string
): Promise<{ success: boolean }> => {
  await privateApi.delete(`/course/quizzes/${quizId}/`)
  return { success: true }
},
  // =========================
  // UPLOAD THUMBNAIL
  // =========================
 uploadThumbnail: async (
  file: File,
  courseId: number
): Promise<{ url: string; success: boolean }> => {

  const formData = new FormData()
  formData.append("image_url", file)   // 🔥 actual FILE
  formData.append("course", String(courseId))
  formData.append("user", String(userId))

  const res = await privateApi.post(
    "/course/thumbnail/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )

  return {
    url: res.data.image_url, // backend se jo URL aaye
    success: true,
  }
}
,

  // =========================
  // PUBLISH COURSE
  // =========================
  publishCourse: async (_courseId: string): Promise<{ success: boolean }> => {
    await privateApi.patch(
      `/course/courses/${_courseId}/`,
      { isPublished: true },
      
    )

    return { success: true }
  },
}
api.interceptors.request.use((config) => {
  const token =
    getCookie("access") ||
    localStorage.getItem("access") ||
    localStorage.getItem("jwt-auth")

  if (token) config.headers.Authorization = `Bearer ${token}`

  const csrf = getCookie("csrftoken")
  if (csrf) config.headers["X-CSRFTOKEN"] = csrf

  return config
})

/* ================= TYPES ================= */
interface Subscription {
  id: number
  name: string
}
// interface CourseFormData {
//   title: string
//   description: string
//   category: string
//   difficulty: string
//   duration: string
//   instructor: string
//   price: string
//   learningOutcomes: string[]
//   prerequisites: string[]
// }

interface CourseFormData {
  title: string
  description: string
  category: string
  difficulty: string
  duration: string
  instructor: string
  subscription_name: string
  learningOutcomes: string[]
  prerequisites: string[]
}
interface QuizOption {
  text: string
  is_correct: boolean
}
interface QuizQuestion {
  chapter: number
  question: string
  options: QuizOption[]
}
// interface Lesson {
//   id: string
//   title: string
//   type: "video" | "text" | "quiz"
//   duration: string
//   content: string,
//   quiz?: QuizQuestion
// }

interface Lesson {
  id: string
  title: string
  type: "video" | "text" | "quiz" | "pdf"   // ✅ pdf added
  duration: string
  content: string
  quiz?: QuizQuestion
  videoFile?: File | null
  attachmentFile?: File | null
}

interface Module {
  id: string
  title: string
  description: string
  lessons: Lesson[]
}
function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}: {
  children: React.ReactNode
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"
  size?: "sm" | "md" | "lg" | "icon"
  disabled?: boolean
  className?: string
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "p-2",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}

// Input Component
function Input({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
}: {
  id?: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  className?: string
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${className}`}
    />
  )
}

// Textarea Component
function Textarea({
  id,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
  className = "",
}: {
  id?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  rows?: number
  required?: boolean
  className?: string
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${className}`}
    />
  )
}

// Select Component
function Select({
  id,
  value,
  onChange,
  options,
  className = "",
}: {
  id?: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors flex items-center justify-between"
      >
        <span>{selectedOption?.label || "Select..."}</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors ${
                  option.value === value ? "bg-blue-50 text-blue-600" : "text-gray-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// Label Component
function Label({
  htmlFor,
  children,
  className = "",
}: { htmlFor?: string; children: React.ReactNode; className?: string }) {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-1.5 ${className}`}>
      {children}
    </label>
  )
}

// Card Component
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>{children}</div>
}

function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>{children}</div>
}

function CardTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
}

function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>
}

// Badge Component
function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode
  variant?: "default" | "secondary" | "success" | "warning"
  className?: string
}) {
  const variants = {
    default: "bg-blue-100 text-blue-700",
    secondary: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

// ============================================
// STEP INDICATOR
// ============================================
function StepIndicator({ currentStep, steps }: { currentStep: number; steps: string[] }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                index < currentStep
                  ? "bg-blue-600 text-white"
                  : index === currentStep
                    ? "bg-blue-600 text-white ring-4 ring-blue-100"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
            </div>
            <span className={`mt-2 text-xs font-medium ${index <= currentStep ? "text-gray-900" : "text-gray-400"}`}>
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-12 md:w-20 h-1 mx-2 rounded-full ${index < currentStep ? "bg-blue-600" : "bg-gray-200"}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// ============================================
// COURSE FORM (Step 1)
// ============================================
function CourseForm({
  
  onSubmit,
  initialData,
  isLoading,
}: {
  onSubmit: (data: CourseFormData) => void
  initialData?: CourseFormData
  isLoading?: boolean
}) {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([])

  const [formData, setFormData] = useState<CourseFormData>(
    initialData || {
      title: "",
      description: "",
      category: "",
      difficulty: "beginner",
      duration: "",
      instructor: "",
      subscription_name: "",
      learningOutcomes: [""],
      prerequisites: [""],
    },
  )
useEffect(() => {
    fetchSubscriptions().then(setSubscriptions)
  }, [])
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addItem = (field: "learningOutcomes" | "prerequisites") => {
    setFormData({ ...formData, [field]: [...formData[field], ""] })
  }

  const updateItem = (field: "learningOutcomes" | "prerequisites", index: number, value: string) => {
    const newItems = [...formData[field]]
    newItems[index] = value
    setFormData({ ...formData, [field]: newItems })
  }

  const removeItem = (field: "learningOutcomes" | "prerequisites", index: number) => {
    const newItems = formData[field].filter((_, i) => i !== index)
    setFormData({ ...formData, [field]: newItems.length > 0 ? newItems : [""] })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Subscription *</Label>
        <Select
          value={formData.subscription_name}
          onChange={(value) =>
            setFormData({ ...formData, subscription_name: value })
          } 
          options={subscriptions.map((s) => ({
            value: `${s.name} (${s.billing_cycle})`,
            label: `${s.name} (${s.billing_cycle})`,
          }))}
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="title">Course Title *</Label>
          <Input
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Complete Web Development Bootcamp"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            placeholder="Describe what students will learn in this course..."
          />
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g., Web Development"
          />
        </div>


        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="e.g., 12 hours"
          />
        </div>


        <div className="md:col-span-2">
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="e.g., 49.99"
          />
        </div>
      </div>

      {/* Learning Outcomes */}
      <div>
        <Label>Learning Outcomes</Label>
        <div className="space-y-2">
          {formData.learningOutcomes.map((outcome, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={outcome}
                onChange={(e) => updateItem("learningOutcomes", index, e.target.value)}
                placeholder={`Outcome ${index + 1}`}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeItem("learningOutcomes", index)}
                disabled={formData.learningOutcomes.length === 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => addItem("learningOutcomes")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Outcome
          </Button>
        </div>
      </div>

      {/* Prerequisites */}
      <div>
        <Label>Prerequisites</Label>
        <div className="space-y-2">
          {formData.prerequisites.map((prereq, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={prereq}
                onChange={(e) => updateItem("prerequisites", index, e.target.value)}
                placeholder={`Prerequisite ${index + 1}`}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeItem("prerequisites", index)}
                disabled={formData.prerequisites.length === 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => addItem("prerequisites")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Prerequisite
          </Button>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Continue"}
          {!isLoading && <ChevronRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </form>
  )
}

// ============================================
// MODULE EDITOR (Step 2)
// ============================================
function ModuleEditor({
  modules,
  onAddModule,
  onUpdateModule,
  onDeleteModule,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson,
  onContinue,
  onBack,
  isLoading,
}: {
  modules: Module[]
  onAddModule: (module: Omit<Module, "id" | "chapter">) => void
  onUpdateModule: (moduleId: string, data: Partial<Module>) => void
  onDeleteModule: (moduleId: string) => void
  onAddLesson: (moduleId: string, lesson: Omit<Lesson, "id">) => void
  onUpdateLesson: (moduleId: string, lessonId: string, data: Partial<Lesson>) => void
  onDeleteLesson: (moduleId: string, lessonId: string) => void
  onContinue: () => void
  onBack: () => void
  isLoading?: boolean
}) {
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [showLessonForm, setShowLessonForm] = useState<string | null>(null)
  const [editingModule, setEditingModule] = useState<Module | null>(null)
  const [editingLesson, setEditingLesson] = useState<{ moduleId: string; lesson: Lesson } | null>(null)
  const [moduleForm, setModuleForm] = useState({ title: "", description: "" })
  const [lessonForm, setLessonForm] = useState<Omit<Lesson, "id">>({
  title: "",
  type: "video",
  duration: "",
  content: "",
  videoFile: null,
  attachmentFile: null,
})

  const handleAddModule = () => {
    if (moduleForm.title) {
      onAddModule(moduleForm)
      setModuleForm({ title: "", description: "" })
      setShowModuleForm(false)
    }
  }

  const handleUpdateModule = () => {
    if (editingModule && moduleForm.title) {
      onUpdateModule(editingModule.id, moduleForm)
      setModuleForm({ title: "", description: "" })
      setEditingModule(null)
    }
  }

  const handleAddLesson = (moduleId: string) => {
    if (lessonForm.title) {
      onAddLesson(moduleId, lessonForm)
      setLessonForm({ title: "", type: "video", duration: "", content: "" })
      setShowLessonForm(null)
    }
  }

  const handleUpdateLesson = () => {
    if (editingLesson && lessonForm.title) {
      onUpdateLesson(editingLesson.moduleId, editingLesson.lesson.id, lessonForm)
      setLessonForm({ title: "", type: "video", duration: "", content: "" })
      setEditingLesson(null)
    }
  }

  const getLessonIcon = (type: Lesson["type"]) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4 text-blue-600" />
          case "pdf":
          return <FileText className="h-4 w-4 text-red-600" />
      case "text":
        return <FileText className="h-4 w-4 text-green-600" />
      case "quiz":
        return <BookOpen className="h-4 w-4 text-purple-600" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Course Modules</h3>
          <p className="text-sm text-gray-500">Organize your course content into modules and lessons</p>
        </div>
        <Button
          onClick={() => {
            setShowModuleForm(true)
            setEditingModule(null)
            setModuleForm({ title: "", description: "" })
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Module
        </Button>
      </div>

      {/* Module Form */}
      {(showModuleForm || editingModule) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{editingModule ? "Edit Module" : "New Module"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="moduleTitle">Module Title *</Label>
              <Input
                id="moduleTitle"
                value={moduleForm.title}
                onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                placeholder="e.g., Introduction to JavaScript"
              />
            </div>
            <div>
              <Label htmlFor="moduleDescription">Description</Label>
              <Textarea
                id="moduleDescription"
                value={moduleForm.description}
                onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                placeholder="Brief description of this module..."
                rows={2}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowModuleForm(false)
                  setEditingModule(null)
                  setModuleForm({ title: "", description: "" })
                }}
              >
                Cancel
              </Button>
              <Button onClick={editingModule ? handleUpdateModule : handleAddModule}>
                {editingModule ? "Update Module" : "Add Module"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modules List */}
      <div className="space-y-4">
        {modules.map((module, moduleIndex) => (
          <Card key={module.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                    {moduleIndex + 1}
                  </div>
                  <div>
                    <CardTitle className="text-base">{module.title}</CardTitle>
                    {module.description && <p className="text-sm text-gray-500 mt-0.5">{module.description}</p>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingModule(module)
                      setModuleForm({ title: module.title, description: module.description })
                      setShowModuleForm(false)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDeleteModule(module.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          <CardContent className="pt-0">
            {/* ================= LESSON LIST ================= */}
            <div className="space-y-2 mb-4">
              {module.lessons.map((lesson, lessonIndex) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-gray-300" />
                    <span className="text-sm text-gray-400 w-5">
                      {lessonIndex + 1}.
                    </span>
                    {getLessonIcon(lesson.type)}
                    <span className="text-sm font-medium text-gray-900">
                      {lesson.title}
                    </span>
                    <Badge variant="secondary">{lesson.type}</Badge>
          
                    {lesson.duration && lesson.type !== "quiz" && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {lesson.duration}
                      </span>
                    )}
                  </div>
          
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingLesson({ moduleId: module.id, lesson })
                        setShowLessonForm(module.id)
          
                        setLessonForm({
                          title: lesson.title,
                          type: lesson.type,
                          duration: lesson.duration || "",
                          content: lesson.content || "",
                          videoFile: null,
                          attachmentFile: null,
                          quiz:
                            lesson.type === "quiz"
                              ? lesson.quiz
                              : {
                                  chapter: module.id,
                                  question: "",
                                  options: [{ text: "", is_correct: false }],
                                },
                        })
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
          
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteLesson(module.id, lesson.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          
            {/* ================= LESSON FORM ================= */}
            {(showLessonForm === module.id ||
              (editingLesson && editingLesson.moduleId === module.id)) && (
              <Card className="mb-4 border-blue-200 bg-blue-50/30">
                <CardContent className="pt-4 space-y-4">
                  {/* Title + Type */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Lesson Title *</Label>
                      <Input
                        value={lessonForm.title}
                        onChange={(e) =>
                          setLessonForm({ ...lessonForm, title: e.target.value })
                        }
                      />
                    </div>
          
                    <div>
                      <Label>Lesson Type</Label>
                      <Select
                        value={lessonForm.type}
                        onChange={(value) =>
                          setLessonForm({
                            ...lessonForm,
                            type: value as Lesson["type"],
                          })
                        }
                        options={[
                          { value: "video", label: "Video" },
                          { value: "pdf", label: "PDF Document" }, // ✅ NEW
                          { value: "text", label: "Text / Article" },
                          { value: "quiz", label: "Quiz" },
                        ]}
                      />
                    </div>
                  </div>
          
                  {/* VIDEO */}
                  {lessonForm.type === "video" && (
                    <>
                      <Label>Video File *</Label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          setLessonForm({
                            ...lessonForm,
                            videoFile: e.target.files?.[0] || null,
                          })
                        }
                      />
                    </>
                  )}
                   {/* PDF UPLOAD */}
                  {lessonForm.type === "pdf" && (
                    <>
                      <Label>Attach PDF *</Label>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) =>
                          setLessonForm({
                            ...lessonForm,
                            attachmentFile: e.target.files?.[0] || null,
                          })
                        }
                      />
                    </>
                  )}
          
                  {/* TEXT + VIDEO */}
                  {lessonForm.type !== "quiz" && (
                    <>
                      <Label>Duration</Label>
                      <Input
                        value={lessonForm.duration}
                        onChange={(e) =>
                          setLessonForm({
                            ...lessonForm,
                            duration: e.target.value,
                          })
                        }
                      />
          
                      <Label>Content / Description</Label>
                      <Textarea
                        value={lessonForm.content}
                        onChange={(e) =>
                          setLessonForm({
                            ...lessonForm,
                            content: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </>
                  )}
          
                  {/* ================= QUIZ ================= */}
                  {lessonForm.type === "quiz" && (
                    <div className="space-y-4">
                      <Label>Question</Label>
                      <Input
                        value={lessonForm.quiz.question}
                        onChange={(e) =>
                          setLessonForm({
                            ...lessonForm,
                            quiz: {
                              ...lessonForm.quiz,
                              question: e.target.value,
                            },
                          })
                        }
                      />
          
                      {lessonForm.quiz.options.map((opt, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <Input
                            placeholder={`Option ${i + 1}`}
                            value={opt.text}
                            onChange={(e) => {
                              const options = [...lessonForm.quiz.options]
                              options[i].text = e.target.value
                              setLessonForm({
                                ...lessonForm,
                                quiz: { ...lessonForm.quiz, options },
                              })
                            }}
                          />
                          <input
                            type="checkbox"
                            checked={opt.is_correct}
                            onChange={(e) => {
                              const options = [...lessonForm.quiz.options]
                              options[i].is_correct = e.target.checked
                              setLessonForm({
                                ...lessonForm,
                                quiz: { ...lessonForm.quiz, options },
                              })
                            }}
                          />
                          <span className="text-sm">Correct</span>
                        </div>
                      ))}
          
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setLessonForm({
                            ...lessonForm,
                            quiz: {
                              ...lessonForm.quiz,
                              options: [
                                ...lessonForm.quiz.options,
                                { text: "", is_correct: false },
                              ],
                            },
                          })
                        }
                      >
                        + Add Option
                      </Button>
                    </div>
                  )}
          
                  {/* ACTION BUTTONS */}
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowLessonForm(null)
                        setEditingLesson(null)
                        setLessonForm({
                          title: "",
                          type: "video",
                          duration: "",
                          content: "",
                          videoFile: null,
                          attachmentFile: null,
                          quiz: {
                            chapter: module.id,
                            question: "",
                            options: [{ text: "", is_correct: false }],
                          },
                        })
                      }}
                    >
                      Cancel
                    </Button>
          
                    <Button
                      onClick={
                        editingLesson
                          ? handleUpdateLesson
                          : () => handleAddLesson(module.id)
                      }
                    >
                      {editingLesson ? "Update Lesson" : "Add Lesson"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          
            {/* ================= ADD LESSON BUTTON ================= */}
            {showLessonForm !== module.id && !editingLesson && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowLessonForm(module.id)
                  setEditingLesson(null)
                  setLessonForm({
                    title: "",
                    type: "video",
                    duration: "",
                    content: "",
                    videoFile: null,
                    attachmentFile: null,
                    quiz: {
                      chapter: module.id,
                      question: "",
                      options: [{ text: "", is_correct: false }],
                    },
                  })
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Lesson
              </Button>
            )}
          </CardContent>
          </Card>
        ))}
      </div>

      {modules.length === 0 && !showModuleForm && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-1">No modules yet</h4>
          <p className="text-sm text-gray-500 mb-4">Start building your course by adding a module</p>
          <Button onClick={() => setShowModuleForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Module
          </Button>
        </div>
      )}

      <div className="flex justify-between pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onContinue} disabled={isLoading || modules.length === 0}>
          {isLoading ? "Saving..." : "Continue"}
          {!isLoading && <ChevronRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}

// ============================================
// THUMBNAIL UPLOAD (Step 3)
// ============================================
function ThumbnailUpload({
  thumbnail,
  onUpload,
  onPublish,
  onBack,
  isLoading,
}: {
  thumbnail: string | null
  onUpload: (file: File) => void
  onPublish: () => void
  onBack: () => void
  isLoading?: boolean
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) {
      onUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onUpload(e.target.files[0])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Course Thumbnail
        </h3>
        <p className="text-sm text-gray-500">
          Upload an attractive thumbnail (recommended: 1280×720px)
        </p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {thumbnail ? (
          <div className="relative">
            <img
              src={thumbnail}
              alt="Course thumbnail"
              className="max-h-64 mx-auto rounded-lg shadow-sm"
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Edit className="h-4 w-4 mr-2" />
              Change
            </Button>
          </div>
        ) : (
          <div className="py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-2">
              Drag and drop your image here, or
            </p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
            <p className="text-xs text-gray-400 mt-3">
              PNG, JPG, or GIF up to 5MB
            </p>
          </div>
        )}

        {/* ✅ Hidden input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      <div className="flex justify-between pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>

        <Button onClick={onPublish} disabled={isLoading}>
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Publishing...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Publish Course
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// ============================================
// SUCCESS VIEW
// ============================================
function SuccessView({ courseTitle, onCreateAnother }: { courseTitle: string; onCreateAnother: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="h-10 w-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Published!</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Your course &quot;{courseTitle}&quot; has been successfully published and is now available for students.
      </p>
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={onCreateAnother}>
          Create Another Course
        </Button>
        <Button>
          View Course
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
/* ========================================================= */
/* ====================== MAIN EDIT PAGE =================== */
/* ========================================================= */

export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>() // ✅ COURSE ID FROM URL

  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const [courseId, setCourseId] = useState<string | null>(null)
  const [courseData, setCourseData] = useState<CourseFormData | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [published, setPublished] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)


  const steps = ["Course Details", "Modules & Chapter", "Thumbnail & Publish"]

  /* ================= FETCH COURSE (EDIT MODE) ================= */

  useEffect(() => {
  if (!id) return

  api.get(`/course/courses/${id}/`).then((res) => {
    const d = res.data

    setCourseId(String(d.id))
    setCourseData({
      title: d.title,
      description: d.description,
      category: d.category,
      difficulty: d.difficulty,
      duration: d.duration,
      instructor: d.instructor,
      price: String(d.price),
      learningOutcomes: d.learningOutcomes?.split("\n") || [""],
      prerequisites: d.prerequisites?.split("\n") || [""],
    })

    setModules(
      (d.modules || []).map((m: any) => ({
        ...m,
        lessons: Array.isArray(m.lessons) ? m.lessons : [],
      }))
    )

    setThumbnail(d.thumbnail || null)
  })
}, [id])


  /* ================= UPDATE COURSE ================= */

  const handleCourseUpdate = async (data: CourseFormData) => {
    if (!courseId) return

    setLoading(true)

    await api.patch(`/course/courses/${courseId}/`, {
      ...data,
      price: Number(data.price || 0),
      learningOutcomes: data.learningOutcomes.join("\n"),
      prerequisites: data.prerequisites.join("\n"),
    })

    setCourseData(data)
    setCurrentStep(1)
    setLoading(false)
  }
 const handleAddModule = async (module: Omit<Module, "id" | "chapter">) => {
    if (!courseId) return
    const result = await mockApi.addModule(courseId, { ...module, lessons: [] })
    if (result.success) {
      setModules([...modules, { ...module, id: result.id, lessons: [] }])
    }
  }

  const handleUpdateModule = async (moduleId: string, data: Partial<Module>) => {
    const result = await mockApi.updateModule(moduleId, data)
    if (result.success) {
      setModules(modules.map((m) => (m.id === moduleId ? { ...m, ...data } : m)))
    }
  }

  const handleDeleteModule = async (moduleId: string) => {
    const result = await mockApi.deleteModule(moduleId)
    if (result.success) {
      setModules(modules.filter((m) => m.id !== moduleId))
    }
  }

  // const handleAddLesson = async (moduleId: string, lesson: Omit<Lesson, "id">) => {
  //   const result = await mockApi.addLesson(moduleId, lesson)
  //   if (result.success) {
  //     setModules(
  //       modules.map((m) => (m.id === moduleId ? { ...m, lessons: [...m.lessons, { ...lesson, id: result.id }] } : m)),
  //     )
  //   }
  // }

  // const handleUpdateLesson = async (moduleId: string, lessonId: string, data: Partial<Lesson>) => {
  //   const result = await mockApi.updateLesson(lessonId, data)
  //   if (result.success) {
  //     setModules(
  //       modules.map((m) =>
  //         m.id === moduleId ? { ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, ...data } : l)) } : m,
  //       ),
  //     )
  //   }
  // }

  // const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
  //   const result = await mockApi.deleteLesson(lessonId)
  //   if (result.success) {
  //     setModules(
  //       modules.map((m) => (m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m)),
  //     )
  //   }
  // }


  const handleAddLesson = async (
  moduleId: string,
  lesson: Omit<Lesson, "id">
) => {

  try {
    // 🔥 QUIZ FLOW (CORRECT)
    if (lesson.type === "quiz") {
      // 1️⃣ Create chapter first (empty lesson)
      const chapterRes = await mockApi.addLesson(moduleId, {
        title: lesson.title,
        type: "quiz",
        duration: "",
        content: "",
      })

      // 2️⃣ Use chapter ID for quiz
      await mockApi.addQuiz({
        chapter: Number(chapterRes.id), // ✅ REAL chapter ID
        question: lesson.quiz.question,
        options: lesson.quiz.options,
      })

      // 3️⃣ Update UI
      setModules(
        modules.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                lessons: [
                  ...m.lessons,
                  {
                    ...lesson,
                    id: chapterRes.id,
                  },
                ],
              }
            : m,
        ),
      )

      return
    }

    // 🔵 VIDEO / TEXT (same as before)
    const result = await mockApi.addLesson(moduleId, lesson)

    if (result.success) {
      setModules(
        modules.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                lessons: [...m.lessons, { ...lesson, id: result.id }],
              }
            : m,
        ),
      )
    }
  } finally {
  }
}

const handleUpdateLesson = async (
  moduleId: string,
  lessonId: string,
  data: Partial<Lesson>
) => {

  try {
    // 🔥 QUIZ UPDATE
    if (data.type === "quiz" && data.quiz) {
      const res = await mockApi.updateQuiz(lessonId, {
        question: data.quiz.question,
        options: data.quiz.options,
      })

      if (res.success) {
        setModules(
          modules.map((m) =>
            m.id === moduleId
              ? {
                  ...m,
                  lessons: m.lessons.map((l) =>
                    l.id === lessonId ? { ...l, ...data } : l,
                  ),
                }
              : m,
          ),
        )
      }

      return
    }

    // 🔵 VIDEO / TEXT UPDATE
    const result = await mockApi.updateLesson(lessonId, data)

    if (result.success) {
      setModules(
        modules.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                lessons: m.lessons.map((l) =>
                  l.id === lessonId ? { ...l, ...data } : l,
                ),
              }
            : m,
        ),
      )
    }
  } finally {
  }
}
const handleDeleteLesson = async (
  moduleId: string,
  lessonId: string
) => {

  try {
    // 🔥 Check if lesson is quiz
    const module = modules.find((m) => m.id === moduleId)
    const lesson = module?.lessons.find((l) => l.id === lessonId)

    if (lesson?.type === "quiz") {
      // 🔥 QUIZ DELETE API
      await mockApi.deleteQuiz(lessonId)
    } else {
      // 🔵 VIDEO / TEXT DELETE API
      await mockApi.deleteLesson(lessonId)
    }

    // ✅ Update UI
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.filter((l) => l.id !== lessonId),
            }
          : m,
      ),
    )
  } finally {
  }
}
  /* ================= THUMBNAIL ================= */

  const handleThumbnailUpload = async (file: File) => {
    if (!courseId) return

    setLoading(true)

    const formData = new FormData()
    formData.append("image_url", file)
    formData.append("course", courseId)
    formData.append("user", userId)

    await api.put(`/course/thumbnail/${courseId}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })

    setThumbnail(URL.createObjectURL(file))
    setLoading(false)
  }

  /* ================= PUBLISH ================= */

  const handlePublish = async () => {
    if (!courseId) return
    setLoading(true)

    await api.patch(`/course/courses/${courseId}/`, { isPublished: true })
    setPublished(true)

    setLoading(false)
  }

  if (published && courseData) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <Check className="mx-auto h-16 w-16 text-green-500" />
        <h2 className="text-2xl font-bold mt-4">
          Course "{courseData.title}" Published 🎉
        </h2>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Update Course</h1>
      <p className="text-gray-500 mb-6">Update your course content</p>

      <StepIndicator currentStep={currentStep} steps={steps} />

      <Card>
        <CardContent className="pt-6">
          {currentStep === 0 && courseData && (
            <CourseForm
              initialData={courseData}
              onSubmit={handleCourseUpdate}
              isLoading={loading}
            />
          )}

          {currentStep === 1 && (
             <ModuleEditor
    modules={modules}
    onAddModule={handleAddModule}
    onUpdateModule={handleUpdateModule}
    onDeleteModule={handleDeleteModule}
    onAddLesson={handleAddLesson}
    onUpdateLesson={handleUpdateLesson}
    onDeleteLesson={handleDeleteLesson}
    onBack={() => setCurrentStep(0)}
    onContinue={() => setCurrentStep(2)}
    isLoading={loading}
  />
          )}

          {currentStep === 2 && (
            <ThumbnailUpload
              thumbnail={thumbnail}
              onUpload={handleThumbnailUpload}
              onPublish={handlePublish}
              onBack={() => setCurrentStep(1)}
              isLoading={loading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
