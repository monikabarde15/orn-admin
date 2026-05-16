"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  Plus,
  X,
  Check,
  ChevronRight,
  ChevronDown,
  Edit,
  Trash2,
  BookOpen,
} from "lucide-react"

import { toast, Toaster } from "react-hot-toast"
import api from "../../services/api"

/* =======================================================
   TYPES
======================================================= */

interface Subscription {
  id: number
  name: string
}

interface Category {
  _id: string
  name: string
}

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

  price: string

  thumbnailImage: File | null
  ebook: File | null
}

interface Lesson {
  id: string
  title: string
  duration: string
  content: string
  videoFile?: File | null
}

interface Module {
  id: string
  title: string
  description: string
  lessons: Lesson[]
}

/* =======================================================
   API FUNCTIONS
======================================================= */

const mockApi = {
  // ================= CREATE COURSE =================

  createCourse: async (data: CourseFormData) => {
    const formData = new FormData()

    formData.append("courseName", data.title)

    formData.append(
      "courseDescription",
      data.description
    )

    formData.append(
      "whatYouWillLearn",
      data.learningOutcomes.join(", ")
    )

    formData.append(
      "price",
      data.price || "0"
    )

    formData.append(
      "tag",
      JSON.stringify([
        data.category,
        data.difficulty,
      ])
    )

    formData.append(
      "instructions",
      JSON.stringify(data.prerequisites)
    )

    formData.append(
      "category",
      data.category
    )

    formData.append(
      "status",
      "Draft"
    )

    if (data.thumbnailImage) {
      formData.append(
        "thumbnailImage",
        data.thumbnailImage
      )
    }

    if (data.ebook) {
      formData.append(
        "ebook",
        data.ebook
      )
    }

    const res = await api.post(
      "/api/v1/course/createCourse",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    )

    return {
      success: true,
      id: res.data?.data?._id,
    }
  },

  // ================= ADD SECTION =================

addModule: async (
  courseId: string,
  module: {
    title: string
  }
) => {

  const res = await api.post(
    "/api/v1/course/addSection",
    {
      sectionName: module.title,
      courseId,
    }
  )

  console.log(
    "SECTION RESPONSE",
    res.data
  )

  // latest section
  const latestSection =
    res.data.updatedCourse
      ?.courseContent?.[
        res.data.updatedCourse
          ?.courseContent
          .length - 1
      ]

  return {
    success: true,

    id: latestSection?._id,
  }
}
,



  // ================= ADD SUBSECTION =================

addLesson: async (
  sectionId: string,
  lesson: Lesson
) => {

  const formData =
    new FormData()

  formData.append(
    "sectionId",
    sectionId
  )

  formData.append(
    "title",
    lesson.title
  )

  formData.append(
    "description",
    lesson.content
  )

  if (lesson.videoFile) {
    formData.append(
      "video",
      lesson.videoFile
    )
  }

  const res = await api.post(
    "api/v1/course/addSubSection",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  )
console.log(
    "SECTION RESPONSE1",
    res.data
  )
  return {
    success: true,
    id: res.data?.data?._id,
  }
}
,

  // ================= PUBLISH =================

  publishCourse: async (
    courseId: string
  ) => {
    const formData = new FormData()

    formData.append("courseId", courseId)

    formData.append(
      "status",
      "Published"
    )

    await api.post(
      "/api/v1/course/editCourse",
      formData
    )

    return {
      success: true,
    }
  },
}

/* =======================================================
   UI COMPONENTS
======================================================= */

function Button({
  children,
  onClick,
  type = "button",
  className = "",
}: any) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition ${className}`}
    >
      {children}
    </button>
  )
}

function Input(props: any) {
  return (
    <input
      {...props}
      className="w-full border rounded-lg px-4 py-2"
    />
  )
}

function Textarea(props: any) {
  return (
    <textarea
      {...props}
      className="w-full border rounded-lg px-4 py-2"
    />
  )
}

/* =======================================================
   MAIN COMPONENT
======================================================= */

function CreateCourseForm() {
  const [step, setStep] = useState(1)

  const [categories, setCategories] =
  useState<Category[]>([])

  const [loading, setLoading] =
    useState(false)

  const [courseId, setCourseId] =
    useState("")

  const [modules, setModules] =
    useState<Module[]>([])

  const [moduleTitle, setModuleTitle] =
    useState("")

  const [lessonForms, setLessonForms] =
    useState<Record<string, Lesson>>({})

  const [formData, setFormData] =
    useState<CourseFormData>({
      title: "",
      description: "",
      category: "",
      difficulty: "beginner",
      duration: "",
      instructor: "",
      subscription_name: "",

      learningOutcomes: [""],

      prerequisites: [""],

      price: "",

      thumbnailImage: null,

      ebook: null,
    })

    useEffect(() => {
      fetchCategories()
    }, [])

  /* =======================================================
     CREATE COURSE
  ======================================================= */

  const handleCreateCourse = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    try {
      setLoading(true)

      const res =
        await mockApi.createCourse(
          formData
        )

      setCourseId(res.id)

      toast.success(
        "Course Created"
      )

      setStep(2)
    } catch (err) {
      console.log(err)

      toast.error(
        "Failed to create course"
      )
    } finally {
      setLoading(false)
    }
  }


  const fetchCategories =
    async () => {
      try {
        const res = await api.get(
          "/api/v1/category/showAllCategories"
        )

        console.log(
          "Categories:",
          res.data
        )

        setCategories(
          res.data?.data || []
        )
      } catch (error) {
        console.log(
          "Category Error",
          error
        )
      }
    }

  /* =======================================================
     ADD MODULE
  ======================================================= */

  const handleAddModule =
    async () => {
      if (!moduleTitle) return

      try {
        const res =
          await mockApi.addModule(
            courseId,
            {
              title: moduleTitle,
            }
          )

        setModules((prev) => [
          ...prev,
          {
            id: res.id,
            title: moduleTitle,
            description: "",
            lessons: [],
          },
        ])

        setModuleTitle("")

        toast.success(
          "Module Added"
        )
      } catch (err) {
        toast.error(
          "Failed to add module"
        )
      }
    }

  /* =======================================================
     ADD LESSON
  ======================================================= */

  const handleAddLesson =
    async (moduleId: string) => {
      const lesson =
        lessonForms[moduleId]

      if (!lesson?.title) {
        toast.error(
          "Lesson title required"
        )

        return
      }

      try {
        const res =
          await mockApi.addLesson(
            moduleId,
            lesson
          )

        setModules((prev) =>
          prev.map((m) =>
            m.id === moduleId
              ? {
                  ...m,
                  lessons: [
                    ...m.lessons,
                    {
                      ...lesson,
                      id: res.id,
                    },
                  ],
                }
              : m
          )
        )

        setLessonForms((prev) => ({
          ...prev,
          [moduleId]: {
            id: "",
            title: "",
            duration: "",
            content: "",
            videoFile: null,
          },
        }))

        toast.success(
          "Lesson Added"
        )
      } catch (err) {
        toast.error(
          "Failed to add lesson"
        )
      }
    }

  /* =======================================================
     PUBLISH
  ======================================================= */

  const handlePublish =
    async () => {
      try {
        setLoading(true)

        await mockApi.publishCourse(
          courseId
        )

        toast.success(
          "Course Published"
        )

        setStep(3)
      } catch (err) {
        toast.error(
          "Failed to publish"
        )
      } finally {
        setLoading(false)
      }
    }

  /* =======================================================
     SUCCESS
  ======================================================= */

  if (step === 3) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center">
        <div className="text-4xl mb-4">
          ✅
        </div>

        <h2 className="text-2xl font-bold">
          Course Published Successfully
        </h2>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Toaster />

      {/* =======================================================
          STEP 1
      ======================================================= */}

      {step === 1 && (
        <form
          onSubmit={
            handleCreateCourse
          }
          className="space-y-6"
        >
          <h1 className="text-2xl font-bold">
            Create Course
          </h1>

          <div>
            <label>
              Course Title
            </label>

            <Input
              required
              value={formData.title}
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  title:
                    e.target.value,
                })
              }
            />
          </div>

          <div>
            <label>
              Description
            </label>

            <Textarea
              rows={5}
              required
              value={
                formData.description
              }
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  description:
                    e.target.value,
                })
              }
            />
          </div>

          <div>
            <label>
              Category
            </label>

            <select
              required
              value={formData.category}
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  category:
                    e.target.value,
                })
              }
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">
                Select Category
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </option>
                )
              )}
            </select>
          </div>



          <div>
            <label>Price</label>

            <Input
              type="number"
              value={
                formData.price
              }
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  price:
                    e.target.value,
                })
              }
            />
          </div>

          <div>
            <label>
              What You Will Learn
            </label>

            {formData.learningOutcomes.map(
              (
                item,
                index
              ) => (
                <div
                  key={index}
                  className="flex gap-2 mb-2"
                >
                  <Input
                    value={item}
                    onChange={(
                      e: any
                    ) => {
                      const arr =
                        [
                          ...formData.learningOutcomes,
                        ]

                      arr[index] =
                        e.target.value

                      setFormData({
                        ...formData,
                        learningOutcomes:
                          arr,
                      })
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      const arr =
                        formData.learningOutcomes.filter(
                          (
                            _,
                            i
                          ) =>
                            i !==
                            index
                        )

                      setFormData({
                        ...formData,
                        learningOutcomes:
                          arr,
                      })
                    }}
                  >
                    <X />
                  </button>
                </div>
              )
            )}

            <Button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  learningOutcomes:
                    [
                      ...formData.learningOutcomes,
                      "",
                    ],
                })
              }
            >
              Add Outcome
            </Button>
          </div>

          <div>
            <label>
              Prerequisites
            </label>

            {formData.prerequisites.map(
              (
                item,
                index
              ) => (
                <div
                  key={index}
                  className="flex gap-2 mb-2"
                >
                  <Input
                    value={item}
                    onChange={(
                      e: any
                    ) => {
                      const arr =
                        [
                          ...formData.prerequisites,
                        ]

                      arr[index] =
                        e.target.value

                      setFormData({
                        ...formData,
                        prerequisites:
                          arr,
                      })
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      const arr =
                        formData.prerequisites.filter(
                          (
                            _,
                            i
                          ) =>
                            i !==
                            index
                        )

                      setFormData({
                        ...formData,
                        prerequisites:
                          arr,
                      })
                    }}
                  >
                    <X />
                  </button>
                </div>
              )
            )}

            <Button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  prerequisites:
                    [
                      ...formData.prerequisites,
                      "",
                    ],
                })
              }
            >
              Add Prerequisite
            </Button>
          </div>

          <div>
            <label>
              Thumbnail Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  thumbnailImage:
                    e.target
                      .files?.[0] ||
                    null,
                })
              }
            />
          </div>

          <div>
            <label>
              Ebook PDF
            </label>

            <input
              type="file"
              accept=".pdf"
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  ebook:
                    e.target
                      .files?.[0] ||
                    null,
                })
              }
            />
          </div>

          <Button
            type="submit"
            className="w-full"
          >
            {loading
              ? "Creating..."
              : "Create Course"}
          </Button>
        </form>
      )}

      {/* =======================================================
          STEP 2
      ======================================================= */}

      {step === 2 && (
        <div className="space-y-8">
          <h1 className="text-2xl font-bold">
            Add Modules & Lessons
          </h1>

          {/* ADD MODULE */}

          <div className="flex gap-3">
            <Input
              placeholder="Module Title"
              value={moduleTitle}
              onChange={(e: any) =>
                setModuleTitle(
                  e.target.value
                )
              }
            />

            <Button
              onClick={
                handleAddModule
              }
            >
              Add Module
            </Button>
          </div>

          {/* MODULES */}

          {modules.map((module) => (
            <div
              key={module.id}
              className="border rounded-xl p-5"
            >
              <h2 className="text-xl font-semibold mb-5">
                {module.title}
              </h2>

              {/* LESSON FORM */}

              <div className="space-y-3 mb-6">
                <Input
                  placeholder="Lesson Title"
                  value={
                    lessonForms[
                      module.id
                    ]?.title || ""
                  }
                  onChange={(
                    e: any
                  ) =>
                    setLessonForms(
                      (
                        prev
                      ) => ({
                        ...prev,
                        [module.id]:
                          {
                            ...prev[
                              module.id
                            ],
                            title:
                              e
                                .target
                                .value,
                          },
                      })
                    )
                  }
                />

                <Input
                  placeholder="Duration"
                  value={
                    lessonForms[
                      module.id
                    ]?.duration || ""
                  }
                  onChange={(
                    e: any
                  ) =>
                    setLessonForms(
                      (
                        prev
                      ) => ({
                        ...prev,
                        [module.id]:
                          {
                            ...prev[
                              module.id
                            ],
                            duration:
                              e
                                .target
                                .value,
                          },
                      })
                    )
                  }
                />

                <Textarea
                  placeholder="Lesson Description"
                  rows={4}
                  value={
                    lessonForms[
                      module.id
                    ]?.content || ""
                  }
                  onChange={(
                    e: any
                  ) =>
                    setLessonForms(
                      (
                        prev
                      ) => ({
                        ...prev,
                        [module.id]:
                          {
                            ...prev[
                              module.id
                            ],
                            content:
                              e
                                .target
                                .value,
                          },
                      })
                    )
                  }
                />

                <input
                  type="file"
                  accept="video/*"
                  onChange={(
                    e: any
                  ) =>
                    setLessonForms(
                      (
                        prev
                      ) => ({
                        ...prev,
                        [module.id]:
                          {
                            ...prev[
                              module.id
                            ],
                            videoFile:
                              e
                                .target
                                .files?.[0] ||
                              null,
                          },
                      })
                    )
                  }
                />

                <Button
                  onClick={() =>
                    handleAddLesson(
                      module.id
                    )
                  }
                >
                  Add Lesson
                </Button>
              </div>

              {/* LESSON LIST */}

              <div className="space-y-2">
                {module.lessons.map(
                  (lesson) => (
                    <div
                      key={
                        lesson.id
                      }
                      className="border rounded-lg p-3 flex justify-between"
                    >
                      <div>
                        <h3 className="font-medium">
                          {
                            lesson.title
                          }
                        </h3>

                        <p className="text-sm text-gray-500">
                          {
                            lesson.duration
                          }
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}

          <Button
            onClick={handlePublish}
            className="w-full"
          >
            {loading
              ? "Publishing..."
              : "Publish Course"}
          </Button>
        </div>
      )}
    </div>
  )
}
export default CreateCourseForm

