import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    quote: "OnRequestLab's Kubernetes course was exactly what I needed to get hands-on with real clusters. The labs are practical and easy to follow. Highly recommended for anyone wanting to master K8s!",
    author: "Andy Smith",
    role: "Systems Engineer",
    rating: 5,
    company: "Tech Solutions Inc."
  },
  {
    quote: "I used OnRequestLab to learn Docker and Red Hat Linux for my certification. The self-paced labs and instant feedback made all the difference. I passed my exam on the first try!",
    author: "Michael Rodriguez",
    role: "IT Specialist",
    rating: 5,
    company: "FashionBrand"
  },
  {
    quote: "The support team at OnRequestLab answered all my questions quickly. The platform is perfect for busy professionals who want to upskill in cloud and DevOps tech.",
    author: "Emily Thompson",
    role: "Student",
    rating: 5,
    company: "University of California"
  },
  {
    quote: "The High-Availability Cluster Lab was the highlight of my training. I now use these skills at work every day. Thank you OnRequestLab!",
    author: "David Kim",
    role: "Linux Administrator",
    rating: 5,
    company: "EcommPlus"
  },
  {
    quote: "OnRequestLab's real-world scenarios helped me land a DevOps job. The Docker and Kubernetes labs are the best I've seen online.",
    author: "Lisa Anderson",
    role: "DevOps Engineer",
    rating: 5,
    company: "RetailCo"
  },
  {
    quote: "I love how OnRequestLab lets me practice at my own pace. The progress tracking and detailed explanations made learning Linux fun and effective.",
    author: "James Wilson",
    role: "Network Engineer",
    rating: 5,
    company: "MediaGroup"
  },
  {
    quote: "The continuous learning platform at OnRequestLab gave me the confidence to tackle cloud projects at work. The labs are challenging but rewarding.",
    author: "Priya Sharma",
    role: "Cloud Engineer",
    rating: 5,
    company: "CloudTech"
  },
  {
    quote: "OnRequestLab's customer support went above and beyond to help me with my lab setup. I recommend them to anyone looking to advance their Linux and DevOps skills.",
    author: "Robert Chang",
    role: "Product Manager",
    rating: 5,
    company: "InnovateCorp"
  }
];

function QuoteIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <g>
        <path d="M6 19c.4-3.7 1.88-7.03 6-9V7a4 4 0 1 0-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        <path d="M17 19c.4-3.7 1.88-7.03 6-9V7a4 4 0 1 0-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentTestimonials = testimonials.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-purple-400 text-sm font-semibold tracking-wider uppercase">
            REAL CUSTOMERS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-4">
            Customers <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Feedback</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From career changes to dream jobs, here's how we helped.
          </p>
        </div>

        <div className="relative">
          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={handlePrev}
              className="bg-black hover:bg-gray-800 text-white p-3 rounded-full transition-all duration-300 border border-gray-700 hover:border-purple-500"
              aria-label="Previous testimonials"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="bg-black hover:bg-gray-800 text-white p-3 rounded-full transition-all duration-300 border border-gray-700 hover:border-purple-500"
              aria-label="Next testimonials"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Testimonials Grid */}
          <div className="overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {currentTestimonials.map((t, i) => (
                  <div
                    key={`${currentIndex}-${i}`}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-purple-500 transition-all duration-300 flex flex-col"
                  >
                    <div className="mb-4">
                      <QuoteIcon />
                    </div>
                    <div className="flex mb-4">
                      {Array.from({ length: t.rating }).map((_, idx) => (
                        <span key={idx} className="text-yellow-400 text-xl">★</span>
                      ))}
                    </div>
                    <blockquote className="text-gray-300 text-base leading-relaxed mb-6 flex-grow">
                      "{t.quote}"
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                        {t.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-white font-semibold">{t.author}</div>
                        <div className="text-gray-400 text-sm">
                          {t.role} {t.company && `at ${t.company}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'bg-purple-500 w-8' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;