import { GraduationCap, Terminal, Container, Users } from "lucide-react";
import { motion } from "framer-motion";

const WhoIsThisForSection = ({ course }) => {

  // ✅ dynamic personas
  const personas = [
    {
      icon: GraduationCap,
      label: course?.category || "Learners",
    },
    {
      icon: Terminal,
      label: `${course?.difficulty || "Beginner"} Level`,
    },
    {
      icon: Container,
      label: course?.modules?.length
        ? `${course.modules.length} Modules Training`
        : "Practical Training",
    },
    {
      icon: Users,
      label: "Job & Skill Growth",
    },
  ];

  return (
    <section className="relative py-24 bg-[#0b0b1f] overflow-hidden">

      <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] bg-purple-600/20 blur-[100px]" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[300px] h-[300px] bg-cyan-600/20 blur-[100px]" />

      <div className="container max-w-5xl mx-auto px-4 relative z-10 text-center">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Who Is This{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              For?
            </span>
          </h2>

          <p className="text-gray-400 text-lg">
            {course?.learningOutcomes || "Designed for learners & professionals"}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">

          {personas.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="group relative p-[1px] rounded-2xl bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"
            >
              <div className="rounded-2xl bg-[#111132] p-6 border border-white/10 backdrop-blur-xl transition-all duration-300 group-hover:bg-[#15153a]">

                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:scale-110 transition">
                  <p.icon className="w-7 h-7 text-white" />
                </div>

                <p className="text-white font-medium text-sm sm:text-base">
                  {p.label}
                </p>

                <div className="absolute inset-0 rounded-2xl bg-cyan-500/10 blur-xl opacity-0 group-hover:opacity-100 transition" />
              </div>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default WhoIsThisForSection;