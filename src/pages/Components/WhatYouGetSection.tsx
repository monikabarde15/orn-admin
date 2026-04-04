import { Video, Play, FileText } from "lucide-react";
import { motion } from "framer-motion";

const WhatYouGetSection = ({ course }) => {

  // ✅ detect content
  const hasVideo = course?.modules?.some(m =>
    m.chapters?.some(c => c.video)
  );

  const hasFiles = course?.modules?.some(m =>
    m.chapters?.some(c => c.file)
  );

  const moduleCount = course?.modules?.length || 0;

  // ✅ dynamic items
  const items = [
    {
      icon: Video,
      text: hasVideo ? "Full recorded video training" : "No video content",
    },
    {
      icon: Play,
      text: `${moduleCount}+ Practical modules`,
      highlight: true,
    },
    {
      icon: FileText,
      text: hasFiles
        ? "Downloadable resources included"
        : course?.learningOutcomes || "Guided implementation",
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
            What You{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Get
            </span>
          </h2>

          <p className="text-gray-400 text-lg">
            {course?.description || "Everything you need in one place"}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-3 gap-8">

          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className={`relative group p-[1px] rounded-2xl 
              ${
                item.highlight
                  ? "bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 scale-105"
                  : "bg-gradient-to-r from-purple-500/50 to-cyan-500/50"
              }`}
            >
              <div
                className={`rounded-2xl p-8 h-full border backdrop-blur-xl transition-all duration-300
                ${
                  item.highlight
                    ? "bg-[#15153a] border-white/20 shadow-2xl"
                    : "bg-[#111132] border-white/10 group-hover:bg-[#15153a]"
                }`}
              >

                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg transition
                  ${
                    item.highlight
                      ? "bg-gradient-to-r from-purple-500 to-cyan-500 scale-110"
                      : "bg-gradient-to-r from-purple-500/70 to-cyan-500/70 group-hover:scale-110"
                  }`}
                >
                  <item.icon className="w-8 h-8 text-white" />
                </div>

                <p className="text-white font-semibold text-lg">
                  {item.text}
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

export default WhatYouGetSection;