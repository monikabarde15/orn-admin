import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

import Navbar from "../../pages/Components/Navbar";
import Footer from "../Components/Footer";

import HeroCourseSection from "./HeroCourseSection";
import ComparisonSection from "./ComparisonSection";
import LearnSection from "./LearnSection";
import LabAccessSection from "./LabAccessSection";
import WhatYouGetSection from "./WhatYouGetSection";
import WhoIsThisForSection from "./WhoIsThisForSection";
import WhyChooseSection from "./WhyChooseSection";
import CtaSection from "./CtaSection";

const CoursePreview = () => {
  const { slug } = useParams();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        console.log("Slug:", slug);

        if (!slug) {
          setLoading(false);
          return;
        }

        const res = await api.get(`/course/courses/slug/${slug}/`);

        console.log("API Response:", res.data);

        // backend response handling
        const courseData =
          res.data?.data ||
          res.data?.course ||
          res.data;

        setCourse(courseData);
      } catch (error) {
        console.error("Fetch course error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl">
        Loading course...
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (!course) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-500 text-xl">
        Course not found
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <HeroCourseSection course={course} />
      <ComparisonSection course={course} />
      <LearnSection course={course} />
      <LabAccessSection course={course} />
      <WhatYouGetSection course={course} />
      <WhoIsThisForSection course={course} />
      <WhyChooseSection course={course} />
      <CtaSection course={course} />

      <Footer />
    </main>
  );
};

export default CoursePreview;