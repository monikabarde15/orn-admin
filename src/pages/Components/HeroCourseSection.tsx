import heroBg from "../../../public/assets/hero-bg.jpg";
import { motion } from "framer-motion";

const HeroCourseSection = ({ course }) => {

  const imageUrl = course?.thumbnail?.image
    ? `https://${course.thumbnail.image}`
    : heroBg;

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center text-center overflow-hidden">

      {/* 🔥 Background Image */}
      <motion.img
        src={imageUrl}
        alt="bg"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 🔥 DARK OVERLAY (MOST IMPORTANT FIX) */}
      <div className="absolute inset-0 bg-black/70" />

      {/* 🔥 GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#0b0b1f]/80 to-[#0b0b1f]" />

      {/* 🔥 CONTENT */}
      <div className="relative z-10 max-w-3xl px-4">

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight">
          {course?.title || "Course Title"}
        </h1>

        <p className="mt-4 text-lg sm:text-xl text-gray-300">
          {course?.description || "Course description"}
        </p>

        <div className="mt-4">
          <span className="px-4 py-1 text-sm rounded-full bg-purple-500/20 border border-purple-400 text-purple-300">
            {course?.category || "Category"}
          </span>
        </div>

      </div>

    </section>
  );
};

export default HeroCourseSection;