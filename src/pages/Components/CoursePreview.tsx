import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const { id } = useParams();

  const [course, setCourse] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        const res = await api.get(`/course/courses/${id}/preview/`);
        setCourse(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourse();
  }, [id]);

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* ✅ props pass */}
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