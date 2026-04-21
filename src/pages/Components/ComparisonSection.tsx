import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  course: any;
};

const ComparisonSection = ({ course }: Props) => {
  // ✅ safe calculations
  const moduleCount = course?.modules?.length || 0;

  const chapterCount =
    course?.modules?.reduce((acc: number, mod: any) => {
      return acc + (mod.chapters?.length || 0);
    }, 0) || 0;

  const hasVideo = course?.modules?.some((m: any) =>
    m.chapters?.some((c: any) => c.video)
  );

  const hasFiles = course?.modules?.some((m: any) =>
    m.chapters?.some((c: any) => c.file)
  );

  // ✅ rows (NO syntax error)
  const rows = [
    {
      feature: "Modules",
      typical: "Limited",
      orl: `${moduleCount} Modules`,
    },
    {
      feature: "Lectures",
      typical: "Basic",
      orl: `${chapterCount} Lectures`,
    },
    {
      feature: "Video Content",
      typical: "Limited",
      orl: hasVideo ? "Available 🎥" : "Not Included",
    },
    {
      feature: "Files",
      typical: "Rare",
      orl: hasFiles ? "Included 📁" : "Not Included",
    },
    {
      feature: "Level",
      typical: "Unclear",
      orl: course?.difficulty || "N/A",
    },
  ];

  return (
    <section className="relative py-24 bg-[#0b0b1f] overflow-hidden">
      {/* Glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-600/20 blur-[120px]" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-blue-600/20 blur-[120px]" />

      <div className="container max-w-6xl mx-auto px-4 relative z-10">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Why choose{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {course?.title || "this course"}?
            </span>
          </h2>

          <p className="text-gray-400 text-lg">
            Real course-based comparison
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Typical */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="p-8 rounded-3xl bg-[#111132] border border-red-400/20"
          >
            <h3 className="text-xl font-bold text-red-400 mb-6">
              Typical Institutes ❌
            </h3>

            <div className="space-y-4">
              {rows.map((row) => (
                <div
                  key={row.feature}
                  className="flex justify-between text-gray-300"
                >
                  <span>{row.feature}</span>
                  <span className="flex items-center gap-2 text-red-400">
                    <X className="w-4 h-4" />
                    {row.typical}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ORL */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.03 }}
            className="relative p-[2px] rounded-3xl bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500"
          >
            <div className="p-8 rounded-3xl bg-[#111132] border border-white/10">

              <div className="absolute -top-3 right-6 bg-green-500 text-black text-xs px-3 py-1 rounded-full font-bold">
                LIVE DATA 🚀
              </div>

              <h3 className="text-xl font-bold text-green-400 mb-6">
                {course?.subscription_name || "OnRequestLab"} ✅
              </h3>

              <div className="space-y-4">
                {rows.map((row) => (
                  <div
                    key={row.feature}
                    className="flex justify-between text-white"
                  >
                    <span>{row.feature}</span>
                    <span className="flex items-center gap-2 text-green-400 font-semibold">
                      <Check className="w-4 h-4" />
                      {row.orl}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;