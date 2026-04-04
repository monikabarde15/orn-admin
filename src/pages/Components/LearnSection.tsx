import { Check } from "lucide-react";
import { motion } from "framer-motion";

const LearnSection = ({ course }) => {

  // ✅ chapters se topics auto generate
  const topics =
    course?.modules?.flatMap((m) =>
      m.chapters?.map((c) => c.title)
    ) || [];

  return (
    <section className="relative py-24 bg-[#0b0b1f] overflow-hidden">

      <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] bg-purple-600/20 blur-[100px]" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[300px] h-[300px] bg-cyan-600/20 blur-[100px]" />

      <div className="container max-w-5xl mx-auto px-4 relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            What You'll{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Learn
            </span>
          </h2>

          <p className="text-gray-400 text-lg">
            {course?.description || "Course topics overview"}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {(topics.length ? topics : ["No topics available"]).map((topic, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="relative group p-[1px] rounded-2xl bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"
            >
              <div className="rounded-2xl bg-[#111132] p-6 h-full border border-white/10 backdrop-blur-xl transition-all duration-300 group-hover:bg-[#15153a]">

                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition">
                  <Check className="w-5 h-5 text-white" />
                </div>

                <h3 className="text-white font-semibold text-lg leading-snug">
                  {topic}
                </h3>

                <div className="absolute inset-0 rounded-2xl bg-cyan-500/10 blur-xl opacity-0 group-hover:opacity-100 transition" />
              </div>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default LearnSection;