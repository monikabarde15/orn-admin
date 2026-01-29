import { api, getCSRFToken } from "../../Components/lib/api"

export const courseApi = {
  createCourse: async (data: any) => {
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
        user: 0,
      },
      { headers: { "X-CSRFTOKEN": getCSRFToken() } }
    )
    return res.data
  },

  addModule: async (courseId: number, module: any, order: number) => {
    const res = await api.post(
      "/course/modules/",
      {
        title: module.title,
        description: module.description,
        order,
        course: courseId,
        user: 0,
      },
      { headers: { "X-CSRFTOKEN": getCSRFToken() } }
    )
    return res.data
  },

  addLesson: async (moduleId: number, lesson: any) => {
    const res = await api.post(
      "/course/lessons/",
      {
        title: lesson.title,
        type: lesson.type,
        duration: lesson.duration,
        content: lesson.content,
        module: moduleId,
        user: 0,
      },
      { headers: { "X-CSRFTOKEN": getCSRFToken() } }
    )
    return res.data
  },

  uploadThumbnail: async (courseId: number, imageUrl: string) => {
    const res = await api.post(
      "/course/thumbnail/",
      {
        image_url: imageUrl,
        course: courseId,
        user: 0,
      },
      { headers: { "X-CSRFTOKEN": getCSRFToken() } }
    )
    return res.data
  },

  publishCourse: async (courseId: number) => {
    const res = await api.patch(
      `/course/courses/${courseId}/`,
      { isPublished: true },
      { headers: { "X-CSRFTOKEN": getCSRFToken() } }
    )
    return res.data
  },
}
