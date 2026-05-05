import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
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
  const { slug } = useParams(); // ✅ correct

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchCourse = async () => {
      try {
        const res = await api.get(`/course/courses/slug/${slug}/`);
        setCourse(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchCourse(); // ✅ FIX HERE
  }, [slug]); // ✅ FIX HERE

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading course...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Course not found
      </div>
    );
  }

  return (
    <main className="min-h-screen">
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