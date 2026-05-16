import React, {
  useEffect,
  useState,
} from "react"

import {
  useParams,
} from "react-router-dom"

import api from "../../services/api"

interface Lesson {
  id?: string
  title: string
  content: string
  duration?: string
  videoFile?: File | null
  pdfFile?: File | null
}

interface Module {
  id?: string
  title: string
  lessons: Lesson[]
}

interface CourseFormData {
  title: string
  description: string
  category: string
  learningOutcomes: string[]
  prerequisites: string[]
}

export default function EditCoursePage() {

  const { id } = useParams()

  const [loading, setLoading] =
    useState(false)

  const [thumbnail, setThumbnail] =
    useState("")

  const [courseId, setCourseId] =
    useState("")

  const [published, setPublished] =
    useState(false)

  const [courseData, setCourseData] =
    useState<CourseFormData>({
      title: "",
      description: "",
      category: "",
      learningOutcomes: [""],
      prerequisites: [""],
    })

  const [modules, setModules] =
    useState<Module[]>([])

  // =====================================
  // FETCH COURSE
  // =====================================

  useEffect(() => {

    if (!id) return

    const fetchCourse =
      async () => {

        try {

          setLoading(true)

          const res =
            await api.post(
              "/api/v1/course/getFullCourseDetails",
              {
                courseId: id,
              }
            )

          const d =
            res.data.data.courseDetails

          setCourseId(d._id)

          setCourseData({
            title: d.courseName,

            description:
              d.courseDescription,

            category:
              d.category?._id || "",

            learningOutcomes:
              d.whatYouWillLearn?.split(
                "\n"
              ) || [""],

            prerequisites:
              d.instructions || [""],
          })

          setModules(
            (
              d.courseContent || []
            ).map((s: any) => ({
              id: s._id,

              title: s.sectionName,

              lessons:
                (
                  s.subSection || []
                ).map((l: any) => ({
                  id: l._id,

                  title: l.title,

                  content:
                    l.description,
                })),
            }))
          )

          setThumbnail(d.thumbnail)

          setPublished(
            d.status === "Published"
          )

        } catch (error) {

          console.log(error)
        } finally {

          setLoading(false)
        }
      }

    fetchCourse()

  }, [id])

  // =====================================
  // UPDATE COURSE
  // =====================================

  const updateCourse =
    async () => {

      try {

        setLoading(true)

        await api.post(
          "/api/v1/course/editCourse",
          {
            courseId,

            courseName:
              courseData.title,

            courseDescription:
              courseData.description,

            whatYouWillLearn:
              courseData.learningOutcomes.join(
                "\n"
              ),

            category:
              courseData.category,

            instructions:
              JSON.stringify(
                courseData.prerequisites
              ),
          }
        )

        alert("Course Updated")

      } catch (error) {

        console.log(error)
      } finally {

        setLoading(false)
      }
    }

  // =====================================
  // ADD MODULE
  // =====================================

  const addModule =
    async () => {

      const title = prompt(
        "Enter module title"
      )

      if (!title) return

      try {

        const res =
          await api.post(
            "/api/v1/course/addSection",
            {
              sectionName: title,
              courseId,
            }
          )

        const latestSection =
          res.data
            ?.updatedCourse
            ?.courseContent?.[
              res.data
                ?.updatedCourse
                ?.courseContent
                .length - 1
            ]

        setModules([
          ...modules,
          {
            id: latestSection?._id,
            title:
              latestSection?.sectionName,
            lessons: [],
          },
        ])

      } catch (error) {

        console.log(error)
      }
    }

  // =====================================
  // DELETE MODULE
  // =====================================

  const deleteModule =
    async (
      sectionId?: string
    ) => {

      if (!sectionId) return

      try {

        await api.post(
          "/api/v1/course/deleteSection",
          {
            sectionId,
          }
        )

        setModules(
          modules.filter(
            (m) =>
              m.id !== sectionId
          )
        )

      } catch (error) {

        console.log(error)
      }
    }

  // =====================================
  // ADD LESSON
  // =====================================

  const addLesson =
    async (
      sectionId?: string
    ) => {

      if (!sectionId) return

      const title = prompt(
        "Lesson title"
      )

      if (!title) return

      try {

        const formData =
          new FormData()

        formData.append(
          "sectionId",
          sectionId
        )

        formData.append(
          "title",
          title
        )

        formData.append(
          "description",
          "Lesson Description"
        )

        formData.append(
          "timeDuration",
          "10"
        )

        const res =
          await api.post(
            "/api/v1/course/addSubSection",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          )

        const newLesson = {
          id:
            res.data?.data?._id,

          title,

          content:
            "Lesson Description",
        }

        setModules(
          modules.map((m) => {
            if (
              m.id === sectionId
            ) {
              return {
                ...m,
                lessons: [
                  ...m.lessons,
                  newLesson,
                ],
              }
            }

            return m
          })
        )

      } catch (error) {

        console.log(error)
      }
    }

  // =====================================
  // DELETE LESSON
  // =====================================

  const deleteLesson =
    async (
      subSectionId?: string,
      sectionId?: string
    ) => {

      if (!subSectionId)
        return

      try {

        await api.post(
          "/api/v1/course/deleteSubSection",
          {
            subSectionId,
          }
        )

        setModules(
          modules.map((m) => {
            if (
              m.id === sectionId
            ) {
              return {
                ...m,
                lessons:
                  m.lessons.filter(
                    (l) =>
                      l.id !==
                      subSectionId
                  ),
              }
            }

            return m
          })
        )

      } catch (error) {

        console.log(error)
      }
    }

  // =====================================
  // PUBLISH COURSE
  // =====================================

  const publishCourse =
    async () => {

      try {

        await api.post(
          "/api/v1/course/editCourse",
          {
            courseId,
            status:
              "Published",
          }
        )

        setPublished(true)

        alert("Published")

      } catch (error) {

        console.log(error)
      }
    }

  // =====================================
  // UI
  // =====================================

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Edit Course
        </h1>

        <button
          onClick={publishCourse}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {published
            ? "Published"
            : "Publish"}
        </button>
      </div>

      <div className="space-y-4 border p-4 rounded-lg bg-white">

        <input
          className="w-full border p-3 rounded"
          placeholder="Course Title"
          value={courseData.title}
          onChange={(e) =>
            setCourseData({
              ...courseData,
              title:
                e.target.value,
            })
          }
        />

        <textarea
          className="w-full border p-3 rounded"
          placeholder="Description"
          value={courseData.description}
          onChange={(e) =>
            setCourseData({
              ...courseData,
              description:
                e.target.value,
            })
          }
        />

        <button
          onClick={updateCourse}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading
            ? "Updating..."
            : "Update Course"}
        </button>
      </div>

      <div className="mt-8">

        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">
            Modules
          </h2>

          <button
            onClick={addModule}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Add Module
          </button>
        </div>

        <div className="space-y-4">

          {modules.map((module) => (
            <div
              key={module.id}
              className="border rounded-lg p-4 bg-white"
            >

              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold">
                  {module.title}
                </h3>

                <div className="flex gap-2">

                  <button
                    onClick={() =>
                      addLesson(module.id)
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Add Lesson
                  </button>

                  <button
                    onClick={() =>
                      deleteModule(module.id)
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="space-y-2">

                {module.lessons.map(
                  (lesson) => (
                    <div
                      key={lesson.id}
                      className="border p-3 rounded flex justify-between"
                    >

                      <div>
                        <h4 className="font-semibold">
                          {lesson.title}
                        </h4>

                        <p className="text-sm text-gray-500">
                          {lesson.content}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          deleteLesson(
                            lesson.id,
                            module.id
                          )
                        }
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
