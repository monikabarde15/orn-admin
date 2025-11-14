import React from 'react';
import { motion } from 'framer-motion';
import '../../pages/Components/TestimonialSection.css';

const testimonials = [
    {
      quote: "I recently completed the 21-day learning module, and I must say, it exceeded my expectations! The course materials were detailed and easy to follow, and the self-practice labs allowed me to gain hands-on experience at my own pace. The Red Hat Linux High-Availability Cluster Lab was particularly impressive—it gave me the confidence to handle real-world scenarios. I highly recommend this platform to anyone looking to upskill in Linux!",
      author: "Andy Smith",
      role: "Los Angeles, CA",
      rating: 5,
    },
    {
      quote: "The team's expertise in social media marketing is unmatched. They grew our Instagram following by 300% and engagement is through the roof.",
      author: "Michael Rodriguez",
      role: "Marketing Director, FashionBrand",
      rating: 5,
    },
    {
      quote: "Working with PrismDigital was a game-changer. Their strategic approach and attention to detail delivered results beyond our expectations.",
      author: "Emily Thompson",
      role: "Founder, StartupX",
      rating: 5,
    },
    // {
    //   quote: "Exceptional service and incredible results. The campaign they created for our product launch reached 40M+ people and drove massive sales.",
    //   author: "David Kim",
    //   role: "CMO, EcommPlus",
    //   rating: 5,
    // },
    // {
    //   quote: "PrismDigital doesn't just deliver campaigns - they deliver growth. Our conversion rates have increased by 85% since partnering with them.",
    //   author: "Lisa Anderson",
    //   role: "VP Marketing, RetailCo",
    //   rating: 5,
    // },
    // {
    //   quote: "The best marketing agency we've ever worked with. Professional, creative, and most importantly - they get results.",
    //   author: "James Wilson",
    //   role: "Director, MediaGroup",
    //   rating: 5,
    // },
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

// Animation variants for Framer Motion
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2, // Stagger each card
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', bounce: 0.2, duration: 0.8 } 
  },
};

const Testimonials = () => (
  <section className="testimonial-section">
    <div className="testimonial-header">
      <span className="testimonial-sub">Testimonials</span>
      <h2 className="testimonial-title">
        What Our Clients <span className="gradient-text">Say</span>
      </h2>
      {/* <p className="testimonial-desc">
        Don't just take our word for it - hear from the businesses we've helped transform.
      </p> */}
    </div>

    <motion.div 
      className="testimonial-grid max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }} // triggers when 20% in view
    >
      {testimonials.map((t, i) => (
        <motion.div
          className="testimonial-card text-justify"
          key={i}
          variants={cardVariants}
        >
          <div className="testimonial-icon text-justify">
            <QuoteIcon />
          </div>
          <div className="testimonial-rating text-justify">
            {Array.from({ length: t.rating }).map((_, idx) => (
              <span key={idx} className="testimonial-star">★</span>
            ))}
          </div>
          <blockquote className="testimonial-quote">"{t.quote}"</blockquote>
          <div className="testimonial-author">
            <span className="testimonial-name">{t.author}</span>
            <span className="testimonial-role">{t.role}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  </section>
);

export default Testimonials;
