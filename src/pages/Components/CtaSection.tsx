import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CtaSection = ({ course }) => {
  const navigate = useNavigate();
const handleStart = (course) => {
  if (!course?.id) {
    console.error("Invalid course data", course);
    return;
  }
  navigate(`/course/${course.id}`);
};
  return (
    <section className="relative py-28 bg-[#0b0b1f] overflow-hidden">

      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/20 blur-[140px]" />

      <div className="container max-w-3xl mx-auto px-4 text-center relative z-10">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold text-white mb-6"
        >
          {course?.title || "Start Your Learning Journey"}
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg mb-8"
        >
          {course?.learningOutcomes ||
            "Get full access + training at best price"}
        </motion.p>

        {/* Price */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <p className="text-5xl font-extrabold text-cyan-400 mb-2">
            ₹{course?.price || "5,000"}
          </p>

          <span className="inline-block px-4 py-1 text-sm rounded-full bg-green-500/10 text-green-400 border border-green-400/30">
            🚀 Limited Offer
          </span>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
            <Button className="text-lg px-10 py-7 font-bold gap-3 bg-gradient-to-r from-purple-500 to-cyan-500" onClick={() => handleStart(course)}>
              Start Course
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Footer Line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-gray-500 mt-6"
        >
          Instant access • Learn anytime • No hidden cost
        </motion.p>

      </div>
    </section>
  );
};

export default CtaSection;