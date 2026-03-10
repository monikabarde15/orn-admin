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

export default function BlogList() {

  const [page, setPage] = useState(1);

  const fetchBlogs = async () => {
    const res = await axios.get(`${VIT}/api/v1/blog/`);
    return Array.isArray(res.data) ? res.data : res.data.results || [];
  };

  const { data: allBlogs = [], isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs
  });

  const blogsToShow = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return allBlogs.slice(start, start + PAGE_SIZE);
  }, [allBlogs, page]);

  const totalPages = Math.ceil(allBlogs.length / PAGE_SIZE);

  const getImage = (img) => {
    if (!img) return "https://via.placeholder.com/800x400";
    if (img.startsWith("http")) return img;
    return `${VIT}${img}`;
  };

  return (
    <>
      <BlogsMetatags />
      <Navbar />

      <div className="min-h-screen bg-[#0f0b16] text-white py-12 px-6">

        <div className="max-w-6xl mx-auto">

          <h1 className="text-4xl md:text-5xl font-extrabold mb-10">
            Latest Blogs &
            <span className="block bg-gradient-to-r from-[#7b4dff] to-[#3cb3ff] bg-clip-text text-transparent">
              Tutorials
            </span>
          </h1>

          {isLoading ? (

            <div className="grid grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i=>(
                <div key={i} className="h-[250px] bg-[#1a1224] rounded-xl animate-pulse"/>
              ))}
            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              {blogsToShow.map((b) => (

                <Link key={b.slug} to={`/blog-detail/${b.slug}`}>

                  <motion.article
                    whileHover={{ scale: 1.04 }}
                    className="bg-[#110717] rounded-2xl p-5 border border-[#2b2136]"
                  >

                    <div className="h-44 overflow-hidden rounded-lg mb-4">

                      <img
                        src={getImage(b.thumbnail || b.image || b.image_path)}
                        alt={b.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />

                    </div>

                    <h3 className="text-xl font-semibold mb-2">
                      {b.title}
                    </h3>

                    <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                      {b.excerpt ||
                        b.short_description ||
                        b.description?.replace(/<[^>]+>/g,"").slice(0,120)}
                    </p>

                    <span className="text-sm bg-gradient-to-r from-[#8f5bff] to-[#5ec2ff] text-black px-4 py-2 rounded-full">
                      Read →
                    </span>

                  </motion.article>

                </Link>

              ))}

            </div>

          )}

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-6">

              <button
                disabled={page===1}
                onClick={()=>setPage(page-1)}
                className="px-4 py-2 bg-[#1b1522] rounded"
              >
                Prev
              </button>

              <span className="text-gray-400">
                Page {page} / {totalPages}
              </span>

              <button
                disabled={page===totalPages}
                onClick={()=>setPage(page+1)}
                className="px-4 py-2 bg-[#1b1522] rounded"
              >
                Next
              </button>

            </div>
          )}

        </div>

      </div>

      <Footer />
    </>
  );
}