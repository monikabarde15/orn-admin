import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../pages/Components/Navbar";
import Footer from "../pages/Components/Footer";
import { BlogsMetatags } from "../pages/Pages/BlogsMetatags";

const VIT = import.meta.env.VITE_API_URL;
const PAGE_SIZE = 6;

export default function BlogListNew() {
  const [page, setPage] = useState(1);

  const fetchBlogs = async () => {
    const res = await axios.get(`${VIT}/api/v1/blog/`);
    // return Array.isArray(res.data) ? res.data : res.data.results || [];
    return res.data?.data || [];
  };

  const { data: allBlogs = [], isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
  });

  // 🔥 Latest blog as featured
  const featuredBlog = allBlogs[0];

  const blogsToShow = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return allBlogs.slice(start + 1, start + 1 + PAGE_SIZE); // skip featured
  }, [allBlogs, page]);

  const totalPages = Math.ceil((allBlogs.length - 1) / PAGE_SIZE);

  const getImage = (img) => {
    if (!img) return "https://via.placeholder.com/800x400";
    if (img.startsWith("http")) return img;
    return `${VIT}${img}`;
  };

  return (
    <>
      <BlogsMetatags />
      <Navbar />

      <div className="bg-[#0b0713] text-white">

        {/* 🔥 HERO */}
        <div className="text-center py-16 px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Blogs</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Latest trends & insights in technology and innovation
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4">

          {/* 🔥 FEATURED BLOG */}
          {featuredBlog && (
            <div className="grid md:grid-cols-2 gap-6 mb-16 bg-[#110717] rounded-2xl overflow-hidden border border-[#2b2136]">

              {/* LEFT IMAGE */}
              <div className="relative">
                <img
                  src={getImage(
                    featuredBlog.thumbnail ||
                      featuredBlog.image ||
                      featuredBlog.image_path
                  )}
                  className="w-full h-full object-cover"
                />

                <div className="absolute bottom-6 left-6 right-6">
                  <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm">
                    Featured
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold mt-3">
                    {featuredBlog.title}
                  </h2>
                </div>
              </div>

              {/* RIGHT CONTENT */}
              <div className="p-6 flex flex-col justify-center">
                <p className="text-gray-400 text-sm mb-3">
                  Published: {featuredBlog.created_at?.slice(0, 10)}
                </p>

                <p className="text-gray-300 mb-6">
                  {featuredBlog.excerpt ||
                    featuredBlog.short_description ||
                    featuredBlog.description
                      ?.replace(/<[^>]+>/g, "")
                      .slice(0, 150)}
                </p>

                <Link
                  to={`/blog-detail/${featuredBlog.slug}`}
                  className="inline-block bg-gradient-to-r from-[#7b4dff] to-[#3cb3ff] px-6 py-3 rounded-full text-black font-semibold w-fit"
                >
                  Read More →
                </Link>
              </div>
            </div>
          )}

          {/* 🔥 LOADER */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#7b4dff] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* 🔥 BLOG GRID */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

                {blogsToShow.map((b) => (
                  <Link key={b.slug} to={`/blog-detail/${b.slug}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-[#110717] rounded-2xl overflow-hidden border border-[#2b2136]"
                    >
                      <img
                        src={getImage(
                          b.thumbnail || b.image || b.image_path
                        )}
                        className="h-48 w-full object-cover"
                      />

                      <div className="p-5">
                        <h3 className="text-lg font-semibold mb-2">
                          {b.title}
                        </h3>

                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                          {b.excerpt ||
                            b.short_description ||
                            b.description
                              ?.replace(/<[^>]+>/g, "")
                              .slice(0, 120)}
                        </p>

                        <span className="text-sm text-[#7b4dff]">
                          Read →
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                ))}

              </div>

              {/* 🔥 PAGINATION */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 mt-12 pb-16">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-[#1b1522] rounded disabled:opacity-50"
                  >
                    Prev
                  </button>

                  <span className="text-gray-400">
                    {page} / {totalPages}
                  </span>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-[#1b1522] rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}