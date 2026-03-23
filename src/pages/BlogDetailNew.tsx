import React from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

const VIT = import.meta.env.VITE_API_URL;

export default function BlogDetailNew() {

  const { id } = useParams();

  // 🔥 SINGLE BLOG
  const fetchBlog = async () => {
    const res = await axios.get(`${VIT}/api/v1/blog/${id}/`);
    return res.data;
  };

  // 🔥 ALL BLOGS (SIDEBAR)
  const fetchBlogs = async () => {
    const res = await axios.get(`${VIT}/api/v1/blog/`);
    return Array.isArray(res.data) ? res.data : res.data.results || [];
  };

  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", id],
    queryFn: fetchBlog
  });

  const { data: allBlogs = [] } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs
  });

  // 🔥 LATEST BLOGS (exclude current)
  const latestBlogs = allBlogs.slice(0, 5);

  const getImage = (img) => {
    if (!img) return "https://via.placeholder.com/800x400";
    if (img.startsWith("http")) return img;
    return `${VIT}${img}`;
  };
console.log(allBlogs.length,allBlogs,'latestBlogs=',latestBlogs);
  // 🔥 LOADER
  if (isLoading || !blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0b0718] flex justify-center items-center">
          <div className="w-14 h-14 border-4 border-[#7b4dff] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="bg-[#0b0718] text-white">

        {/* 🔥 HERO SECTION */}
        <div className="relative h-[300px] md:h-[400px]">
          <img
            src={getImage(blog.thumbnail || blog.image)}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/60 flex flex-col justify-center px-6 md:px-20">
            <p className="text-sm text-gray-300 mb-2">
              Home / Blogs
            </p>

            <h1 className="text-2xl md:text-5xl font-bold max-w-3xl">
              {blog.title}
            </h1>

            <p className="text-gray-400 mt-3 text-sm">
              {blog.created_at?.slice(0, 10)}
            </p>
          </div>
        </div>

        {/* 🔥 MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-10">

          {/* 🔥 LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2"
          >
            <div className="bg-[#110717] p-6 rounded-2xl border border-[#2b2136]">

              <div
                className="prose prose-invert max-w-none text-gray-300"
                dangerouslySetInnerHTML={{
                  __html: blog.description,
                }}
              />
            </div>

            {/* BACK BUTTON */}
            <div className="mt-8">
              <Link
                to="/posts"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#7c4dff] to-[#3f95ff] text-black"
              >
                ← Back to posts
              </Link>
            </div>
          </motion.div>

         {/* 🔥 RIGHT SIDEBAR */}
        <div className="sticky top-24 h-fit">

          <div className="bg-[#110717] p-5 rounded-2xl border border-[#2b2136]">

            <h3 className="text-xl font-semibold mb-6 border-b border-[#2b2136] pb-3">
              Latest posts
            </h3>

            <div className="flex flex-col gap-5">
              {(latestBlogs || []).length === 0 ? (
                <p className="text-gray-400">Loading blogs...</p>
              ) : latestBlogs.length === 0 ? (
                <p className="text-gray-400">No blogs available</p>
              ) : (
                latestBlogs.map((b) => (
                  <Link
                    key={b.id}
                    to={`/blog-detail-post/${b.slug}`}
                    className="flex gap-4 group"
                  >
                    <img
                      src={getImage(b.thumbnail || b.image)}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div>
                      <p className="text-sm font-medium line-clamp-2">
                        {b.title}
                      </p>
                      <span className="text-xs text-gray-400">
                        {b.created_at?.slice(0, 10)}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* 🔥 VIEW ALL BUTTON */}
          <Link
            to="/posts"
            className="block mt-6 text-center py-3 rounded-xl bg-gradient-to-r from-[#7c4dff] to-[#3f95ff] text-black font-semibold"
          >
            View All posts →
          </Link>

        </div>
        </div>
      </div>

      <Footer />
    </>
  );
}