"use client"

import React, { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import {
  Plus, X, Clock, BookOpen, Video, ImageIcon, FileText,
  ChevronRight, ChevronDown, Check, Edit, Trash2, Upload, GripVertical
} from "lucide-react"
import { Toaster, toast } from "react-hot-toast"
import api from "../../services/api"; // 👈 path adjust if needed

/* ================= HELPERS ================= */



const userId = localStorage.getItem("userId")

/* ================= AXIOS ================= */


const fetchSubscriptions = async (): Promise<Subscription[]> => {
  const res = await api.get("/api/v1/packages/")
  return res.data
}

const mockApi = {
  // =========================
  // CREATE COURSE
  // =========================
  createCourse: async (data: CourseFormData): Promise<{ id: string; success: boolean }> => {
    const res = await api.post(
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
        user: Number(userId),

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
    const res = await api.post(
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
    await api.patch(
      `/course/modules/${_moduleId}/`,
      data,
      
    )

    return { success: true }
  },

  // =========================
  // DELETE MODULE
  // =========================
  deleteModule: async (_moduleId: string): Promise<{ success: boolean }> => {
    await api.delete(`/course/modules/${_moduleId}/`, {
    
    })

    return { success: true }
  },

  // =========================
  // ADD LESSON
  // =========================
 addLesson: async (
  moduleId: string,
  lesson: any,
  onProgress?: (type: "video" | "pdf", percent: number) => void
): Promise<{ id: string; success: boolean }> => {

  const formData = new FormData()
  formData.append("title", lesson.title)
  formData.append("duration", lesson.duration)
  formData.append("description", lesson.content)
  formData.append("module", moduleId)
  formData.append("user", userId)

 // 🔍 SEARCH: formData.append("video_file", lesson.videoFile)

if (lesson.videoFile) {
  formData.append("video_file", lesson.videoFile)
}

// ✅ YAHI ADD KARNA THA (PDF)
if (lesson.pdfFile) {
  formData.append("attachment_file", lesson.pdfFile)
}


  const res = await api.post(
    "/course/chapter/",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        console.log("📦 AXIOS PROGRESS", e.loaded, e.total)

        if (!e.total) return
        const percent = Math.round((e.loaded * 100) / e.total)

        if (lesson.videoFile) onProgress?.("video", percent)
        if (lesson.pdfFile) onProgress?.("pdf", percent)
      },
    }
  )

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

    

  await api.patch(`/course/chapter/${lessonId}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })

  return { success: true }
}
,

  // =========================
  // DELETE LESSON
  // =========================
  deleteLesson: async (_lessonId: string): Promise<{ success: boolean }> => {
    await api.delete(`/course/chapter/${_lessonId}/`, {
      
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
    return await api.post("/course/quizzes/", data)
  },

   updateQuiz : async (
    quizId: string,
    data: {
      question: string
      options: { text: string; is_correct: boolean }[]
    }
  ) => {
    return await api.patch(`/course/quizzes/${quizId}/`, data)
  },
  // =========================
// DELETE QUIZ
// =========================
deleteQuiz: async (
  quizId: string
): Promise<{ success: boolean }> => {
  await api.delete(`/course/quizzes/${quizId}/`)
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

  const res = await api.post(
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
    await api.patch(
      `/course/courses/${_courseId}/`,
      { isPublished: true },
      
    )

    return { success: true }
  },
}

/* ================= TYPES ================= */
// interface Subscription {
//   id: number
//   name: string
// }
interface Subscription {
  id: number
  name: string
  billing_cycle: string
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

// interface CourseFormData {
//   title: string
//   description: string
//   category: string
//   difficulty: string
//   duration: string
//   instructor: string
//   subscription_name: string
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
  subscription_name: string | null
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
//   content: string
//   video?: string | null
//   file?: string | null
//   quizzes: any[]
//   mcqCount: number
  
//   uploadStatus?: "idle" | "uploading" | "success" | "error"
//   uploadProgress?: number

// }

interface Lesson {
  id: string
  title: string
  content: string
  mcqCount: number

  uploadStatus?: "uploading" | "success" | "error"
  uploadProgress?: number
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

  // const [formData, setFormData] = useState<CourseFormData>(
  //   initialData || {
  //     title: "",
  //     description: "",
  //     category: "",
  //     difficulty: "beginner",
  //     duration: "",
  //     instructor: "",
  //     subscription_name: "",
  //     learningOutcomes: [""],
  //     prerequisites: [""],
  //   },
  // )

  useEffect(() => {
  if (
    initialData?.subscription_name &&
    subscriptions.length > 0
  ) {
    setFormData((prev) => ({
      ...prev,
      subscription_name: initialData.subscription_name,
    }))
  }
}, [subscriptions, initialData])

console.log("API subscription:", initialData?.subscription_name)
console.log(
  "Options:",
  subscriptions.map(s => `${s.name} (${s.billing_cycle})`)
)

 const [formData, setFormData] = useState<CourseFormData>({
  title: "",
  description: "",
  category: "",
  difficulty: "beginner",
  duration: "",
  instructor: "",
  subscription_name: "",
  learningOutcomes: [""],
  prerequisites: [""],
})

useEffect(() => {
  if (initialData) {
    setFormData(initialData)
  }
}, [initialData])


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
  value={formData.subscription_name || ""}
  onChange={(value) =>
    setFormData({
      ...formData,
      subscription_name: value,
    })
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


        {/* <div className="md:col-span-2">
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="e.g., 49.99"
          />
        </div> */}
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
// MCQ Module 
// ============================================

function MCQForm({ lessonId, editingMcq, onSaved }) {
  const [question, setQuestion] = useState(editingMcq?.question || "")
  const [options, setOptions] = useState(
    editingMcq?.options || [
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
    ]
  )

  const saveMCQ = async () => {
    let res

    if (editingMcq) {
      res = await mockApi.updateQuiz(editingMcq.id, {
        question,
        options,
      })
    } else {
      res = await mockApi.addQuiz({
        chapter: Number(lessonId),
        question,
        options,
      })
    }

    onSaved(res.data) // ✅ SAVE
  }

  return (
    <div className="mt-4 space-y-3">
      <Input
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      {options.map((opt, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            type="radio"
            checked={opt.is_correct}
            onChange={() =>
              setOptions(
                options.map((o, idx) => ({
                  ...o,
                  is_correct: idx === i,
                }))
              )
            }
          />
          <Input
            placeholder={`Option ${i + 1}`}
            value={opt.text}
            onChange={(e) => {
              const arr = [...options]
              arr[i].text = e.target.value
              setOptions(arr)
            }}
          />
        </div>
      ))}

      {/* 🔥 BUTTONS */}
      <div className="flex gap-2">
        <Button onClick={saveMCQ}>
          Save MCQ
        </Button>

        <Button
          variant="outline"
          onClick={() => onSaved(null)}   // ✅ CANCEL
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}



// ============================================
// MODULE EDITOR (Step 2)
// ============================================
function ModuleEditor({
  modules,
   setModules,
  lessonForm,
  setLessonForm,
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
   setModules: React.Dispatch<React.SetStateAction<Module[]>>
  lessonForm: any
  setLessonForm: React.Dispatch<React.SetStateAction<any>>
  onAddModule: any
  onUpdateModule: any
  onDeleteModule: any
  onAddLesson: any
  onUpdateLesson: any
  onDeleteLesson: any
  onContinue: () => void
  onBack: () => void
  isLoading?: boolean
})
 {
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [showLessonForm, setShowLessonForm] = useState<string | null>(null)
  const [editingModule, setEditingModule] = useState<Module | null>(null)
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null)


  const [editingLesson, setEditingLesson] = useState<{ moduleId: string; lesson: Lesson } | null>(null)
  const [moduleForm, setModuleForm] = useState({ title: "", description: "" })
const [activeLesson, setActiveLesson] = useState<string | null>(null)
const [editingMcq, setEditingMcq] = useState<any | null>(null)
const [mcqsByLesson, setMcqsByLesson] = useState<Record<string, any[]>>({})
const [mcqFormLessonId, setMcqFormLessonId] = useState<string | null>(null)



  

  const handleAddModule = () => {
    if (moduleForm.title) {
      onAddModule(moduleForm)
      setModuleForm({ title: "", description: "" })
      setShowModuleForm(false)
    }
  }

const fetchMCQs = async (lessonId: string) => {
  const res = await api.get(`/course/quizzes/?chapter=${lessonId}`)

  setMcqsByLesson((prev) => ({
    ...prev,
    [lessonId]: res.data,
  }))

  // ✅ sirf isi lesson ka count update
  setModules((prev) =>
    prev.map((m) => ({
      ...m,
      lessons: (m.lessons || []).map((l) =>
        l.id === lessonId
          ? { ...l, mcqCount: res.data.length }
          : l
      ),
    }))
  )
}





  const handleUpdateModule = () => {
    if (editingModule && moduleForm.title) {
      onUpdateModule(editingModule.id, moduleForm)
      setModuleForm({ title: "", description: "" })
      setEditingModule(null)
    }
  }

// const handleAddLesson = async (moduleId: string) => {
//   if (!lessonForm.title) {
//     toast.error("Lecture title required")
//     return
//   }

//   // 🔥 TEMP LESSON ID (for progress tracking)
//   const tempId = `temp-${Date.now()}`

// setModules((prev) =>
//   prev.map((m) =>
//     m.id === moduleId
//       ? {
//           ...m,
//           lessons: [
//             ...(m.lessons || []),
//             {
//               id: tempId,
//               title: lessonForm.title,
//               content: lessonForm.content,
//               mcqCount: 0,
//               uploadStatus: "uploading",
//               uploadProgress: 0,
//             },
//           ],
//         }
//       : m
//   )
// )



//   try {
//     // ✅ STEP 2: API CALL + PROGRESS
//   const res = await mockApi.addLesson(
//   moduleId,
//   lessonForm,
//   (_type, percent) => {
//     setModules((prev) =>
//       prev.map((m) =>
//         m.id === moduleId
//           ? {
//               ...m,
//               lessons: m.lessons.map((l) =>
//                 l.id === tempId
//                   ? { ...l, uploadProgress: percent }
//                   : l
//               ),
//             }
//           : m
//       )
//     )
//   }
// )


//     // ✅ STEP 3: TEMP → REAL LESSON (SUCCESS)
//    setModules((prev) =>
//   prev.map((m) =>
//     m.id === moduleId
//       ? {
//           ...m,
//           lessons: m.lessons.map((l) =>
//             l.id === tempId
//               ? {
//                   ...l,
//                   id: res.id,          // ✅ backend id
//                   uploadStatus: "success",
//                   uploadProgress: 100,
//                 }
//               : l
//           ),
//         }
//       : m
//   )
// )

//     toast.success("Lecture uploaded")

//     // ✅ reset form
//     setLessonForm({
//       title: "",
//       duration: "",
//       content: "",
//       videoFile: null,
//       pdfFile: null,
//       videoProgress: 0,
//       pdfProgress: 0,
//       videoStatus: "idle",
//       pdfStatus: "idle",
//     })
//   } catch (err) {
//     // ❌ STEP 4: ERROR STATE
//     setModules((prev) =>
//       prev.map((m) =>
//         m.id === moduleId
//           ? {
//               ...m,
//               lessons: (m.lessons || []).map((l) =>
//                 l.id === tempId
//                   ? { ...l, uploadStatus: "error" }
//                   : l
//               ),
//             }
//           : m
//       )
//     )

//     toast.error("Upload failed")
//   }
// }




  const handleUpdateLesson = () => {
    if (editingLesson && lessonForm.title) {
      onUpdateLesson(editingLesson.moduleId, editingLesson.lesson.id, lessonForm)
      setLessonForm({ title: "", type: "video", duration: "", content: "" })
      setEditingLesson(null)
    }
  }
const getLessonIcon = (lesson: Lesson) => {
  if (lesson.video) return <Video className="h-4 w-4 text-blue-600" />
  if (lesson.file) return <FileText className="h-4 w-4 text-red-600" />
  return <BookOpen className="h-4 w-4 text-gray-600" />
}

const confirmDeleteMCQ = async (mcqId: number, lessonId: string) => {
  if (!window.confirm("Are you sure?")) return

  await mockApi.deleteQuiz(mcqId)

  setMcqsByLesson((prev) => ({
    ...prev,
    [lessonId]: prev[lessonId].filter((q) => q.id !== mcqId),
  }))

  setModules((prev) =>
    prev.map((module) => ({
      ...module,
      lessons: module.lessons.map((lesson) =>
        lesson.id === lessonId
          ? { ...lesson, mcqCount: lesson.mcqCount - 1 }
          : lesson
      ),
    }))
  )

  toast.success("MCQ deleted")
}



  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

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
    {/* LEFT */}
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
        {moduleIndex + 1}
      </div>
      <div>
        <CardTitle className="text-base">{module.title}</CardTitle>
        {module.description && (
          <p className="text-sm text-gray-500 mt-0.5">
            {module.description}
          </p>
        )}
      </div>
    </div>

    {/* RIGHT (🔥 ACTIONS) */}
    <div className="flex gap-2">
      {/* EDIT */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setEditingModule(module)
          setModuleForm({
            title: module.title,
            description: module.description || "",
          })
          setShowModuleForm(true)
        }}
      >
        <Edit className="h-4 w-4 text-blue-600" />
      </Button>

      {/* DELETE */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          if (window.confirm("Delete this module?")) {
            onDeleteModule(module.id)
          }
        }}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  </div>
</CardHeader>

        
        <CardContent className="pt-0 space-y-3">
  {module.lessons.map((lesson, lessonIndex) => (
    <div key={lesson.id} className="space-y-2">

      {/* ===== LESSON ROW ===== */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {lessonIndex + 1}.
          </span>

          {getLessonIcon(lesson)}


          <span className="text-sm font-medium">
            {lesson.title}
          </span>

            {lesson.uploadStatus === "uploading" && (
  <span className="ml-3 text-xs text-blue-600">
    Uploading {lesson.uploadProgress}%
  </span>
)}

{lesson.uploadStatus === "success" && (
  <span className="ml-3 text-xs text-green-600">Uploaded</span>
)}

{lesson.uploadStatus === "error" && (
  <span className="ml-3 text-xs text-red-600">Failed</span>
)}


        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-green-600 text-white"
            onClick={async () => {
              setEditingMcq(null)
              setMcqFormLessonId(null)

              setActiveLessonId(
                activeLessonId === lesson.id ? null : lesson.id
              )

              if (activeLessonId !== lesson.id) {
                await fetchMCQs(lesson.id)
              }
            }}
          >
            Manage MCQs ({lesson.mcqCount})
          </Button>
          <Button
  variant="ghost"
  size="icon"
  onClick={() => {
    setEditingLesson({
      moduleId: module.id,
      lesson: lesson,
    })

    setLessonForm({
      title: lesson.title,
      duration: lesson.duration || "",
      content: lesson.content || "",
      videoFile: null,
      pdfFile: null,
      videoProgress: 0,
      pdfProgress: 0,
      videoStatus: "idle",
      pdfStatus: "idle",
    })

    setShowLessonForm(module.id) // 🔥 same form open
  }}
>
  <Edit className="h-4 w-4 text-blue-600" />
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

      {/* ===== MCQ PANEL (ONLY ONE) ===== */}
      {activeLessonId === lesson.id && (
        <div className="ml-10 mt-3 border rounded-xl bg-white p-4 space-y-3">

          {/* MCQ LIST */}
         {/* MCQ LIST */}
{(mcqsByLesson[lesson.id] || []).map((mcq, i) => (
  <div
    key={mcq.id}
    className="border rounded-lg p-4 bg-gray-50 space-y-2"
  >
    {/* QUESTION */}
    <div className="flex justify-between items-start">
      <p className="font-medium text-gray-900">
        {i + 1}. {mcq.question}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => {
            setEditingMcq(mcq)
            setMcqFormLessonId(lesson.id)
          }}
        >
          ✏️
        </button>

        <button
          onClick={() => confirmDeleteMCQ(mcq.id, lesson.id)}
        >
          🗑️
        </button>
      </div>
    </div>

    {/* OPTIONS */}
    <ul className="space-y-1">
      {mcq.options.map((opt, idx) => (
        <li
          key={idx}
          className={`flex items-center gap-2 text-sm px-3 py-2 rounded
            ${
              opt.is_correct
                ? "bg-green-100 text-green-800 font-medium"
                : "bg-white border"
            }`}
        >
          <span>
            {opt.is_correct ? "✅" : "○"}
          </span>
          {opt.text}
        </li>
      ))}
    </ul>
  </div>
))}


          {/* ADD MCQ BUTTON */}
          <Button
            size="sm"
            onClick={() => {
              setEditingMcq(null)
              setMcqFormLessonId(lesson.id)
            }}
          >
            + Add MCQ
          </Button>

          {/* MCQ FORM */}
          {mcqFormLessonId === lesson.id && (
           <MCQForm
  lessonId={lesson.id}
  editingMcq={editingMcq}
  onSaved={(newMcq) => {
  // ❌ Cancel
  if (!newMcq) {
    setMcqFormLessonId(null)
    setEditingMcq(null)
    return
  }

  setMcqsByLesson((prev) => {
    const list = prev[lesson.id] || []

    // 🔥 UPDATE CASE
    if (editingMcq) {
      return {
        ...prev,
        [lesson.id]: list.map((q) =>
          q.id === newMcq.id ? newMcq : q
        ),
      }
    }

    // ✅ ADD CASE
    return {
      ...prev,
      [lesson.id]: [...list, newMcq],
    }
  })

  // ✅ MCQ COUNT ONLY WHEN ADD
  if (!editingMcq) {
    setModules((prev) =>
      prev.map((m) => ({
        ...m,
        lessons: (m.lessons || []).map((l) =>
          l.id === lesson.id
            ? { ...l, mcqCount: l.mcqCount + 1 }
            : l
        ),
      }))
    )
  }

  setMcqFormLessonId(null)
  setEditingMcq(null)
}}


/>

          )}
        </div>
      )}
    </div>
  ))}
{showLessonForm === module.id && (
  <Card className="mt-3 ml-8">
    <CardHeader>
      <CardTitle className="text-base">Add Lecture</CardTitle>
    </CardHeader>

    <CardContent className="space-y-4">
      <div>
        <Label>Lecture Title *</Label>
        <Input
          value={lessonForm.title}
          onChange={(e) =>
            setLessonForm({ ...lessonForm, title: e.target.value })
          }
          placeholder="Lecture title"
        />
      </div>

      <div>
        <Label>Duration</Label>
        <Input
          value={lessonForm.duration}
          onChange={(e) =>
            setLessonForm({ ...lessonForm, duration: e.target.value })
          }
          placeholder="e.g. 10 min"
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={lessonForm.content}
          onChange={(e) =>
            setLessonForm({ ...lessonForm, content: e.target.value })
          }
        />
      </div>

     <div className="border-2 border-dashed rounded-lg p-4">
  <Label>Upload PDF (optional)</Label>

  <input
    type="file"
    accept=".pdf"
    onChange={(e) => {
      const file = e.target.files?.[0]
      if (!file) return

      setLessonForm((p) => ({
        ...p,
        pdfFile: file,
        pdfProgress: 0,
        pdfStatus: "idle",
      }))
    }}
  />

  {lessonForm.pdfStatus !== "idle" && (
  <div className="mt-2">
    <div className="h-2 bg-gray-200 rounded">
      <div
        className={`h-2 rounded ${
          lessonForm.pdfStatus === "error"
            ? "bg-red-500"
            : lessonForm.pdfStatus === "success"
            ? "bg-green-500"
            : "bg-blue-500"
        }`}
        style={{ width: `${lessonForm.pdfProgress}%` }}
      />
    </div>
    <p className="text-xs mt-1">
      PDF Upload: {lessonForm.pdfProgress}%
    </p>
  </div>
)}

</div>
<div className="border-2 border-dashed rounded-lg p-4">
  <Label>Upload Video (optional)</Label>

  <input
    type="file"
    accept="video/*"
    onChange={(e) => {
      const file = e.target.files?.[0]
      if (!file) return

      setLessonForm((p) => ({
        ...p,
        videoFile: file,
        videoProgress: 0,
        videoStatus: "idle",
      }))
    }}
  />

  {lessonForm.videoStatus !== "idle" && (
  <div className="mt-2">
    <div className="h-2 bg-gray-200 rounded">
      <div
        className={`h-2 rounded ${
          lessonForm.videoStatus === "error"
            ? "bg-red-500"
            : lessonForm.videoStatus === "success"
            ? "bg-green-500"
            : "bg-blue-500"
        }`}
        style={{ width: `${lessonForm.videoProgress}%` }}
      />
    </div>
    <p className="text-xs mt-1">
      Video Upload: {lessonForm.videoProgress}%
    </p>
  </div>
)}

</div>


      {lessonForm.progress > 0 && (
  <div className="mt-2">
    <div className="h-2 bg-gray-200 rounded">
      <div
        className="h-2 bg-blue-600 rounded transition-all"
        style={{ width: `${lessonForm.progress}%` }}
      />
    </div>
    <p className="text-xs mt-1">
      Uploading: {lessonForm.progress}%
    </p>
  </div>
)}


      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={() => setShowLessonForm(null)}
        >
          Cancel
        </Button>

        {/* <Button onClick={() => onAddLesson(module.id)}>
  Save Lecture
</Button> */}
{/* <Button
  onClick={() => {
    if (editingLesson) {
      onUpdateLesson(
        editingLesson.moduleId,
        editingLesson.lesson.id,
        lessonForm
      )

      setEditingLesson(null)
    } else {
      onAddLesson(module.id)
    }

    setShowLessonForm(null)
  }}
>
  {editingLesson ? "Update Lecture" : "Save Lecture"}
</Button>
 */}
 <Button
  onClick={() => {
    if (editingLesson) {
      // ✅ UPDATE MODE
      onUpdateLesson(
        editingLesson.moduleId,
        editingLesson.lesson.id,
        {
          title: lessonForm.title,
          duration: lessonForm.duration,
          content: lessonForm.content,
          videoFile: lessonForm.videoFile ?? undefined,
          attachmentFile: lessonForm.pdfFile ?? undefined,
        }
      )
      setEditingLesson(null)
    } else {
      // ✅ ADD MODE
      onAddLesson(module.id)
    }

    setShowLessonForm(null)
  }}
>
  {editingLesson ? "Update Lecture" : "Save Lecture"}
</Button>



      </div>
    </CardContent>
  </Card>
)}

  {/* ADD LECTURE */}
  <Button
    variant="outline"
    size="sm"
    onClick={() => setShowLessonForm(module.id)}
  >
    + Add Lecture
  </Button>
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
  const { id } = useParams<{ id: string }>() 

  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const [courseId, setCourseId] = useState<string | null>(null)
  const [courseData, setCourseData] = useState<CourseFormData | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [published, setPublished] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [lessonForm, setLessonForm] = useState({
  title: "",
  duration: "",
  content: "",

  videoFile: null as File | null,
  pdfFile: null as File | null,

  videoProgress: 0,
  pdfProgress: 0,

  videoStatus: "idle" as "idle" | "uploading" | "success" | "error",
  pdfStatus: "idle" as "idle" | "uploading" | "success" | "error",
})



  const steps = ["Course Details", "Modules & Chapter", "Thumbnail & Publish"]

  /* ================= FETCH COURSE (EDIT MODE) ================= */

  useEffect(() => {
  if (!id) return

  api.get(`/course/courses/${id}/`).then((res) => {
    const d = res.data
   // console.log('d=',d.subscription_name);
    setCourseId(String(d.id))
    setCourseData({
    subscription_name: d.subscription_name ?? "",
     // subscription_name:d.subscription_name,
      title: d.title,
      description: d.description,
      category: d.category,
      difficulty: d.difficulty,
      duration: d.duration,
      instructor: d.instructor,
      learningOutcomes: d.learningOutcomes?.split("\n") || [""],
      prerequisites: d.prerequisites?.split("\n") || [""],
    })

   setModules(
  (d.modules || []).map((m: any) => ({
    id: String(m.id),
    title: m.title,
    description: m.description,
    lessons: (m.chapters || []).map((c: any) => ({
      id: String(c.id),
      title: c.title,
      content: c.description || "",
      video: c.video || null,
      file: c.file || null,
      quizzes: c.quizzes || [],
      mcqCount: c.quizzes?.length || 0,
    })),
  }))
)


    // setThumbnail(d.thumbnail || null)
setThumbnail(
  d.thumbnail?.image
    ? `https://${d.thumbnail.image}`
    : null
)

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

const handleAddLesson = async (moduleId: string) => {
  if (!lessonForm.title) {
    toast.error("Lecture title required")
    return
  }

  const tempId = `temp-${Date.now()}`

  // ✅ TEMP LESSON — ONLY ONCE
  setModules(prev =>
    prev.map(m =>
      m.id === moduleId
        ? {
            ...m,
            lessons: [
              ...(m.lessons || []),
              {
                id: tempId,
                title: lessonForm.title,
                content: lessonForm.content,
                mcqCount: 0,
                uploadStatus: "uploading",
                uploadProgress: 0,
              },
            ],
          }
        : m
    )
  )

  try {
    const res = await mockApi.addLesson(
      moduleId,
      lessonForm,
      (_type, percent) => {
        // ✅ ONLY UPDATE PROGRESS
        setModules(prev =>
          prev.map(m =>
            m.id === moduleId
              ? {
                  ...m,
                  lessons: m.lessons.map(l =>
                    l.id === tempId
                      ? { ...l, uploadProgress: percent }
                      : l
                  ),
                }
              : m
          )
        )
      }
    )

    // ✅ TEMP → REAL
    setModules(prev =>
      prev.map(m =>
       m.id === moduleId

          ? {
              ...m,
              lessons: m.lessons.map(l =>
                l.id === tempId
                  ? {
                      ...l,
                      id: res.id,
                      uploadStatus: "success",
                      uploadProgress: 100,
                    }
                  : l
              ),
            }
          : m
      )
    )

    toast.success("Lecture uploaded")

  } catch {
    setModules(prev =>
      prev.map(m =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map(l =>
                l.id === tempId
                  ? { ...l, uploadStatus: "error" }
                  : l
              ),
            }
          : m
      )
    )
    toast.error("Upload failed")
  }
}


const handleUpdateLesson = async (
  moduleId: string,
  lessonId: string,
  data: Partial<Lesson>
) => {
  const res = await mockApi.updateLesson(lessonId, data)

  if (res.success) {
    setModules(prev =>
      prev.map(m =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map(l =>
                l.id === lessonId ? { ...l, ...data } : l
              ),
            }
          : m
      )
    )

    toast.success("Lecture updated")
  }
}

const handleDeleteLesson = async (
  moduleId: string,
  lessonId: string
) => {
  const res = await mockApi.deleteLesson(lessonId)

  if (res.success) {
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.filter((l) => l.id !== lessonId),
            }
          : m
      )
    )
  }
}
const getThumbnailId = async () => {
  if (!courseId) return null

  try {
    const res = await api.get(`/course/thumbnail/?course=${courseId}`)

    // agar ek hi thumbnail hai
    if (res.data.length > 0) {
      return res.data[0].id   // 👈 thumbnail ID
    }

    return null
  } catch (error) {
    console.error("Failed to fetch thumbnail", error)
    return null
  }
}

  /* ================= THUMBNAIL ================= */

  // const handleThumbnailUpload = async (file: File) => {
  //   if (!courseId) return

  //   setLoading(true)

  //   const formData = new FormData()
  //   formData.append("image_url", file)
  //   formData.append("course", courseId)
  //   formData.append("user", userId)

  //   await api.put(`/course/thumbnail/${courseId}/`, formData, {
  //     headers: { "Content-Type": "multipart/form-data" },
  //   })

  //   setThumbnail(URL.createObjectURL(file))
  //   setLoading(false)
  // }
const handleThumbnailUpload = async (file: File) => {
  if (!courseId || !userId) return

  setLoading(true)

  try {
    // 1️⃣ get thumbnail ID
    const thumbnailId = await getThumbnailId()

    if (!thumbnailId) {
      alert("Thumbnail not found")
      return
    }

    // 2️⃣ prepare form data
   const formData = new FormData()
formData.append("image_url", file)
formData.append("course", String(courseId)) // 👈 REQUIRED


    // 3️⃣ update thumbnail
    await api.put(`/course/thumbnail/${thumbnailId}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    // 4️⃣ preview update
    setThumbnail(URL.createObjectURL(file))
  } catch (error) {
    console.error("Thumbnail update failed", error)
  } finally {
    setLoading(false)
  }
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
 setModules={setModules}
  lessonForm={lessonForm}
  setLessonForm={setLessonForm}

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
