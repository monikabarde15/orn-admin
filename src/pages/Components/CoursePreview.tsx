
import { useParams } from "react-router-dom";
import { courses } from "../../mock/courses";

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
  // Find course by id (id from params is string)
  const course = courses.find((c) => String(c.id) === String(id));

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