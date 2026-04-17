import { IndianRupee, Wrench, Building, Clock } from "lucide-react";
import { motion } from "framer-motion";

const WhyChooseSection = ({ course }) => {

  const reasons = [
    {
      icon: IndianRupee,
      text: "Affordable pricing",
      highlight: true,
    },
    {
      icon: Wrench,
      text: course?.learningOutcomes || "Practical hands-on skills",
    },
    {
      icon: Building,
      text: course?.category
        ? `${course.category} based real-world use`
        : "Industry-focused learning",
    },
    {
      icon: Clock,
      text: course?.duration
        ? `${course.duration} hrs flexible learning`
        : "Learn at your own pace",
    },
  ];

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
            Why Choose{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {course?.subscription_name || "This Course"}
            </span>
          </h2>

          <p className="text-gray-400 text-lg">
            {course?.description || "Smart investment for real-world skills"}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 gap-6">

          {reasons.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className={`relative group p-[1px] rounded-2xl
              ${
                r.highlight
                  ? "bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500"
                  : "bg-gradient-to-r from-purple-500/50 to-cyan-500/50"
              }`}
            >
              <div
                className={`rounded-2xl p-6 h-full border backdrop-blur-xl flex items-center gap-4 transition-all duration-300
                ${
                  r.highlight
                    ? "bg-[#152e2e] border-green-400/30 shadow-xl"
                    : "bg-[#111132] border-white/10 group-hover:bg-[#15153a]"
                }`}
              >

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition
                  ${
                    r.highlight
                      ? "bg-gradient-to-r from-green-400 to-cyan-500 scale-110"
                      : "bg-gradient-to-r from-purple-500 to-cyan-500 group-hover:scale-110"
                  }`}
                >
                  <r.icon className="w-6 h-6 text-white" />
                </div>

                <p
                  className={`font-semibold text-lg
                  ${r.highlight ? "text-green-300" : "text-white"}`}
                >
                  {r.text}
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

export default WhyChooseSection;