import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Server, 
  FileCode, 
  Headphones, 
  CheckCircle, 
  Zap,
  Shield,
  Users,
  Award,
  RefreshCw
} from 'lucide-react';

const OurServices = () => {
  const services = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Hands-On Red Hat Cluster Training",
      description: "Practical training sessions for comprehensive cluster management",
      color: "from-purple-500 to-blue-500",
      features: [
        "Build a cluster from scratch",
        "Configure pacemaker and corosync",
        "Test failover and resource movement",
        "Work with shared storage (iSCSI / GFS2)",
        "Understand fencing / STONITH in real use cases"
      ]
    },
    {
      icon: <Server className="w-8 h-8" />,
      title: "Remote Lab Access",
      description: "Fully prepared cluster lab accessible anytime, anywhere",
      color: "from-blue-500 to-cyan-500",
      features: [
        "Multi-node Red Hat Linux servers",
        "Shared storage setup",
        "Access through WebSSH",
        "24/7 lab availability",
        "Pre-configured environments"
      ]
    },
    {
      icon: <FileCode className="w-8 h-8" />,
      title: "Real-Time Examples",
      description: "Working examples from real-world production scenarios",
      color: "from-cyan-500 to-teal-500",
      features: [
        "High availability website setup",
        "Service failover between nodes",
        "Shared file system usage",
        "Load balancing configurations",
        "Disaster recovery scenarios"
      ]
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "Guidance and Support",
      description: "Complete support throughout your learning journey",
      color: "from-teal-500 to-green-500",
      features: [
        "Step-by-step instructions",
        "Troubleshooting help",
        "Clear explanation of concepts",
        "Documentation and resources",
        "Community forum access"
      ]
    }
  ];

  const whyChooseUs = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real Hands-On Experience",
      description: "Practice on actual cluster environments, not simulations"
    },
    {
      icon: <FileCode className="w-6 h-6" />,
      title: "Clear & Simple Explanations",
      description: "Complex concepts broken down into easy-to-understand lessons"
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: "Unlimited Practice",
      description: "Practice as many times as you want at your own pace"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Exam Preparation",
      description: "Perfect for RHCE / RHCSA certification preparation"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "For Everyone",
      description: "Suitable for beginners and working professionals"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Production Ready",
      description: "Learn skills that directly apply to real production environments"
    }
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="text-purple-400 text-sm font-semibold tracking-wider uppercase bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20">
              What We Offer
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Our Services
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Comprehensive training and lab access for mastering Red Hat high-availability clusters
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20"
        >
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-purple-500/30 transition-all duration-300 h-full">
                {/* Icon and Title */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-4 bg-gradient-to-br ${service.color} rounded-xl text-white`}>
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                    <p className="text-gray-400">{service.description}</p>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  {service.features.map((feature, fIdx) => (
                    <div
                      key={fIdx}
                      className="flex items-start gap-3 text-gray-300"
                    >
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Why Choose Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                OnRequestLab
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We provide the best hands-on learning experience with real-world applications
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {whyChooseUs.map((reason, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl text-purple-400">
                    {reason.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{reason.title}</h3>
                    <p className="text-gray-400 text-sm">{reason.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-violet-500/20 rounded-3xl blur-2xl"></div>
            
            <div className="relative bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-violet-500/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Master Red Hat Clusters?
              </h3>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Start your hands-on learning journey today with our comprehensive lab environment
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
                >
                  Get Started Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300"
                >
                  View Pricing
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OurServices;
