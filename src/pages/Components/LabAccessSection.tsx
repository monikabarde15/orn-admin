import { Monitor, Wifi, Server, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const LabAccessSection = ({ course }) => {

  // ✅ dynamic detection
  const moduleCount = course?.modules?.length || 0;

  const hasVideo = course?.modules?.some((m) =>
    m.chapters?.some((c) => c.video)
  );

  const hasFiles = course?.modules?.some((m) =>
    m.chapters?.some((c) => c.file)
  );

  // ✅ dynamic items
  const items = [
    { icon: Monitor, text: `${moduleCount} Lab Modules` },
    { icon: Wifi, text: "Remote Access Available" },
    { icon: Server, text: hasVideo ? "Video Labs Included" : "No Video Labs" },
    { icon: BookOpen, text: hasFiles ? "Downloadable Files Included" : "Guided Labs Included" },
  ];

  return (
    <section className="relative py-24 bg-[#0b0b1f] overflow-hidden">

      <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] bg-purple-600/20 blur-[100px]" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[300px] h-[300px] bg-cyan-600/20 blur-[100px]" />

      <div className="container max-w-6xl mx-auto px-4 relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Lab Access{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Details
            </span>
          </h2>

          <p className="text-gray-400 text-lg">
            {course?.category || "Practice like real production environments"}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {items.map((item, i) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.03 }}
              className="group relative p-[1px] rounded-2xl bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"
            >
              <div className="h-full rounded-2xl bg-[#111132] p-6 border border-white/10 backdrop-blur-xl transition-all duration-300 group-hover:bg-[#15153a]">

                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition">
                  <item.icon className="w-6 h-6 text-white" />
                </div>

                <p className="text-white font-medium text-lg leading-snug">
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

export default LabAccessSection;