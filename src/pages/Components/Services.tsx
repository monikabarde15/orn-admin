import React from "react";
import {
  BarChart3,
  ArrowRight,
  Users,
  Container,
  Server,
  Database,
} from "lucide-react";

import { AiOutlineKubernetes } from "react-icons/ai";
import { FaRedhat, FaDocker,FaLinux } from "react-icons/fa";

const services = [
  {
    icon: FaRedhat,
    title: "Pace Maker Linux High-Availability Cluster Lab",
    description:
      "Hands-on training with real-world scenarios for cluster setup and management.",
    stats: ["3 node linux  web ssh lab", "2 node iscsi Lab", "WebSSH Lab","3 Hrs Video Tutorial","Blogs","Complete steps along with screenshot example"],
    color: "text-purple-400",
    hoverColor: "hover:border-purple-400/50",
    dotBg: "bg-purple-400",
  },
  {
    icon: FaLinux as any,
    title: "Linux Lab",
    description:
      "Fully configured environment for professionals seeking Linux system administration expertise.",
    stats: ["Production-Ready Skills", "System Administration Mastery", "Real-World Problem Solving"],
    color: "text-blue-400",
    hoverColor: "hover:border-blue-400/50",
    dotBg: "bg-blue-400",
  },
  {
    icon: AiOutlineKubernetes,
    title: "Kubernetes Labs",
    description:
      "Hands-on experience with automation, Infrastructure as Code, and container orchestration.",
    stats: ["Cloud-Native Deployment", "Infrastructure Automation", "Container Orchestration"],
    color: "text-violet-400",
    hoverColor: "hover:border-violet-400/50",
    dotBg: "bg-violet-400",
  },
  {
    icon: FaDocker,
    title: "Docker Lab",
    description:
      "Hands-on container creation and management practice.",
    stats: ["Explore Dockerfiles, images, and registries", "Build, tag, and deploy multi-container application", "3 Hrs practical video tutorials", "Blogs covering Docker networking, volumes, and Compose setup", "Project: Deploy a simple web app using Docker Compose"],
    color: "text-cyan-400",
    hoverColor: "hover:border-cyan-400/50",
    dotBg: "bg-cyan-400",
  },
  {
    icon: Server,
    title: "Free Course Materials",
    description:
      "Comprehensive PDFs, guides, and videos for easy learning.",
    stats: ["Comprehensive Documentation", "Step-by-Step Tutorials", "Industry Best Practices"],
    color: "text-blue-400",
    hoverColor: "hover:border-blue-400/50",
    dotBg: "bg-blue-400",
  },
  {
    icon: BarChart3,
    title: "Self-Practice Labs",
    description:
      "Virtual labs accessible anytime for uninterrupted practice.",
    stats: ["On-Demand Access", "Flexible Learning Pace", "Performance Tracking"],
    color: "text-violet-400",
    hoverColor: "hover:border-violet-400/50",
    dotBg: "bg-violet-400",
  },
  {
    icon: Users,
    title: "21-Day Learning Module",
    description:
      "Structured daily lessons to achieve expertise in just three weeks.",
    stats: ["Structured Curriculum", "Progressive Learning Path", "Certification Preparation"],
    color: "text-purple-400",
    hoverColor: "hover:border-purple-400/50",
    dotBg: "bg-purple-400",
  }
];

const Services = () => {
  return (
    <section className="bg-[#0E0A1F] text-white py-16 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-gradient-to-r from-purple-400 to-transparent"></div>
            <h4 className="text-xs font-semibold text-purple-400 tracking-wider uppercase">
              Why OnRequest Lab
            </h4>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Hands-On Mastery with{" "}
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-violet-400 text-transparent bg-clip-text">
              Red Hat Cluster Lab
            </span>
          </h2>

          <p className="text-gray-400 text-base max-w-2xl">
            Virtual hands-on lab environment designed for efficient server and terminal operations.
          </p>
        </div>

        {/* Featured Card - First Service Takes Full Width */}
        <div className="mb-6">
          <div
            className={`relative p-6 md:p-8 bg-gradient-to-br from-[#1A1432] to-[#15102A] rounded-xl border border-gray-800 transition-all duration-300 group overflow-hidden ${services[0].hoverColor}`}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl -translate-y-24 translate-x-24 group-hover:scale-125 transition-transform duration-500"></div>

            <div className="relative z-10 grid md:grid-cols-2 gap-6 items-center">
              <div>
                <div className="mb-4 flex justify-center">
                <FaRedhat className="w-16 h-16 text-purple-400 transform -scale-x-100" />
                </div>

                <h3 className="text-xl md:text-2xl font-bold mb-3">
                  {services[0].title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {services[0].description}
                </p>

                <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group/btn">
                  <span>Explore Lab</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="bg-[#0E0A1F]/50 backdrop-blur-sm rounded-xl p-5 border border-purple-500/10">
                <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2.5">
                  {services[0].stats.map((stat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${services[0].dotBg}`} />
                      <span className="text-gray-300 text-sm">{stat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Layout - Row 2: 3 Labs */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          {services.slice(1, 4).map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className={`relative p-5 bg-[#15102A] rounded-xl border border-gray-800 transition-all duration-300 group overflow-hidden hover:-translate-y-1 ${service.hoverColor}`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-full blur-2xl -translate-y-16 translate-x-16 group-hover:scale-125 transition-transform duration-500"></div>

                <div className="relative z-10">
                  <div className="mb-4 flex justify-center">
                    <Icon className="w-16 h-16 text-purple-400" />
                  </div>

                  <h3 className="text-lg font-bold mb-2">{service.title}</h3>

                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mb-4 pt-4 border-t border-purple-500/10">
                    <ul className="space-y-2">
                      {service.stats.map((stat, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className={`w-1 h-1 rounded-full ${service.dotBg}`} />
                          <span className="text-gray-400 text-xs">{stat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="inline-flex items-center gap-1.5 text-xs font-semibold group/btn hover:gap-2 transition-all">
                    <span className={service.color}>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Grid Layout - Row 3: 3 Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.slice(4).map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className={`relative p-5 bg-[#15102A] rounded-xl border border-gray-800 transition-all duration-300 group overflow-hidden hover:-translate-y-1 ${service.hoverColor}`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-full blur-2xl -translate-y-16 translate-x-16 group-hover:scale-125 transition-transform duration-500"></div>

                <div className="relative z-10">
                  <div className="mb-4 flex justify-center">
                    <Icon className="w-16 h-16 text-purple-400" />
                  </div>

                  <h3 className="text-lg font-bold mb-2">{service.title}</h3>

                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mb-4 pt-4 border-t border-purple-500/10">
                    <ul className="space-y-2">
                      {service.stats.map((stat, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className={`w-1 h-1 rounded-full ${service.dotBg}`} />
                          <span className="text-gray-400 text-xs">{stat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="inline-flex items-center gap-1.5 text-xs font-semibold group/btn hover:gap-2 transition-all">
                    <span className={service.color}>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;