import React from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../pages/Components/Navbar";
import Footer from "../pages/Components/Footer";

const VIT = import.meta.env.VITE_API_URL;

export default function BlogDetail() {

  const { id } = useParams();

  const fetchBlog = async () => {
    const res = await axios.get(`${VIT}/api/v1/blog/${id}/`);
    return res.data;
  };

  const { data: blog, isLoading, isFetching } = useQuery({
    queryKey: ["blog", id],
    queryFn: fetchBlog
  });

  if (isLoading || isFetching) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-[#0b0718] text-white py-20 px-5 md:px-20">

          <div className="flex justify-center items-center h-[300px]">

            {/* SAME BLOG LIST LOADER */}
            <div className="w-14 h-14 border-4 border-[#7b4dff] border-t-transparent rounded-full animate-spin"></div>

          </div>

        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#0b0718] text-white py-20 px-5 md:px-20">

        <motion.div
          initial={{opacity:0}}
          animate={{opacity:1}}
          className="max-w-5xl mx-auto"
        >

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#7c4dff] to-[#3f95ff]">
            {blog.title}
          </h1>

          <div
            className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed"
            dangerouslySetInnerHTML={{__html: blog.description}}
          />

          <div className="mt-10">
            <Link
              to="/blogs"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#7c4dff] to-[#3f95ff] text-black"
            >
              Back to Blogs
            </Link>
          </div>

        </motion.div>

      </div>

      <Footer />
    </>
  );
}