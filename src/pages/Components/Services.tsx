import React from "react";
import {
  Megaphone,
  Target,
  BarChart3,
  ArrowRight,
  Users,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: Megaphone,
    title: "Red Hat Linux High-Availability Cluster Lab",
    description:
      "Hands-on training with real-world scenarios for cluster setup and management.",
    stats: ["45% Engagement Increase", "2.3x Follower Growth", "67% More Brand Mentions"],
    color: "text-purple-400",
    hoverColor: "hover:border-purple-400 group-hover:text-purple-400",
    dotBg: "bg-purple-400",
  },
  {
    icon: Target,
    title: "Free Course Materials",
    description:
      "Comprehensive PDFs, guides, and videos for easy learning.",
    stats: ["450% ROI Achieved", "85% Conversion Rate", "120% Revenue Growth"],
    color: "text-blue-400",
    hoverColor: "hover:border-blue-400 group-hover:text-blue-400",
    dotBg: "bg-blue-400",
  },
  {
    icon: BarChart3,
    title: "Self-Practice Labs",
    description:
      "Virtual labs accessible anytime for uninterrupted practice.",
    stats: ["Real-time Tracking", "Custom Dashboards", "Predictive Analytics"],
    color: "text-violet-400",
    hoverColor: "hover:border-violet-400 group-hover:text-violet-400",
    dotBg: "bg-violet-400",
  },
   {
    icon: TrendingUp,
    title: "Linux Lab",
    description:
      "Our Linux Lab has a fully configured environment. It is for professionals seeking to learn more about Linux system administration.",
    stats: ["User Acquisition", "Retention Strategy", "Conversion Optimization"],
    color: "text-blue-400",
    hoverColor: "hover:border-blue-400 group-hover:text-blue-400",
    dotBg: "bg-blue-400",
  },
  {
    icon: Zap,
    title: "Kubernetes Labs",
    description:
      "Ansible Lab, Terraform Lab, Kubernetes Labs: Hands-on experience with automation, Infrastructure as Code, and container orchestration.",
    stats: ["PPC Campaigns", "SEO Optimization", "Email Marketing"],
    color: "text-violet-400",
    hoverColor: "hover:border-violet-400 group-hover:text-violet-400",
    dotBg: "bg-violet-400",
  },
  {
    icon: Users,
    title: "21-Day Learning Module",
    description:
      "Structured daily lessons to achieve expertise in just three weeks.",
    stats: ["Brand Positioning", "Voice & Messaging", "Visual Identity"],
    color: "text-purple-400",
    hoverColor: "hover:border-purple-400 group-hover:text-purple-400",
    dotBg: "bg-purple-400",
  },
 
];

const Services = () => {
  return (
    <section className="bg-[#0E0A1F] text-white py-20 px-2 md:px-10">
      {/* Header */}
      <div className="text-center mb-16">
        <h4 className="text-sm font-semibold text-purple-400 tracking-wider mb-2">
          Why OnRequest Lab
        </h4>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
         OnRequestLab: Your Premier IT Training Platform
{" "}
          {/* <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            Results
          </span> */}
        </h2>
        <p className="text-gray-400  max-w-7xl mx-auto text-justify">
          Enhance your IT skills at OnRequestLab. We offer tailored solutions and labs that promote growth. Get affordable Red Hat training online. Unlock your potential with Red Hat Linux technical experts from India—OnRequestLab: Where innovation meets practical knowledge.
        </p>
      </div>
      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className={`p-8 bg-[#15102A] rounded-2xl border border-transparent backdrop-blur-sm shadow-lg transition-all duration-300 group ${service.hoverColor}`}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${service.hoverColor.split(" ")[1]}`}>
                {service.title}
              </h3>
              <p className="text-gray-400 mb-6">
                {service.description}
              </p>
              <ul className="space-y-2 mb-6">
                {service.stats.map((stat, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <div className={`w-1.5 h-1.5 rounded-full ${service.dotBg}`} />
                    <span className="text-gray-400">{stat}</span>
                  </li>
                ))}
              </ul>
              <button className="p-0 h-auto hover:bg-transparent group/btn">
                <span className={service.color}>Learn More</span>
                <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Services;
