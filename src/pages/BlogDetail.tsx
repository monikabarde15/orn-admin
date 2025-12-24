import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../pages/Components/Footer";
import Navbar from "../pages/Components/Navbar";

const API_BASE = "https://backend.onrequestlab.com/api/v1";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`${API_BASE}/blog/${id}/`);
      if (res.status === 200) {
        setBlog(res.data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError(true);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#0b0718]">
        <p className="text-lg mb-3">⚠️ Blog not found or server error.</p>
        <Link
          to="/blogs"
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#7c4dff] to-[#3f95ff]"
        >
          ← Back to Blogs
        </Link>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0b0718]">
        Loading...
      </div>
    );
  }

  return (
  <>
   <Navbar />
    <div className="min-h-screen bg-[#0b0718] text-white py-20 px-5 md:px-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        {/* Image with hover effect */}
        <div className="relative overflow-hidden rounded-2xl mb-8 group shadow-lg shadow-[#7c4dff25]">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
            src={
              blog.image
                ? `https://backend.onrequestlab.com${blog.image}`
                : "https://via.placeholder.com/800x400"
            }
            alt={blog.title}
            className="rounded-2xl w-full object-cover max-h-[500px] transition-transform duration-700 group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0718]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#7c4dff] to-[#3f95ff]"
          >
            {blog.title}
          </motion.h1>

          {/* ✅ Description (EDITOR HTML RENDERED HERE) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div
              className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.description }}
            />
          </motion.div>

          {/* Back Button */}
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/blogs"
              className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#7c4dff] to-[#3f95ff] text-black font-medium"
            >
              ← Back to Blogs
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </>
  );
}
