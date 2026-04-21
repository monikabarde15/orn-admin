import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";

const useCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        const res = await api.get(`/course/courses/${id}/preview/`);
        setCourse(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  return { course, loading };
};

export default useCourse;