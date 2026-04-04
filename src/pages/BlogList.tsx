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

  // ================= BLOG API =================
  

  // ================= COURSE API =================
  const fetchCourses = async () => {
    const res = await axios.get(`${VIT}/course/courses/`);
    return res.data.results || [];
  };

  
  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
    staleTime: Infinity,
  });

  // ================= PAGINATION =================

  // ================= IMAGE =================
  const getImage = (img) => {
    if (!img) return "https://via.placeholder.com/800x400";
    if (typeof img === "object") return `https://${img.image}`;
    if (img.startsWith("http")) return img;
    return `${VIT}${img}`;
  };

  return (
    <>
      <BlogsMetatags />
      <Navbar />

      <div className="min-h-screen bg-[#0f0b16] text-white py-12 px-6">

        <div className="max-w-6xl mx-auto">

          {/* ================= BLOG TITLE ================= */}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-10">
            Latest 
            <span className="block bg-gradient-to-r from-[#7b4dff] to-[#3cb3ff] bg-clip-text text-transparent">
              Courses
            </span>
          </h1>

        
          {/* ================= COURSE SECTION ================= */}
         
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {courses.map((c) => (
              <div
                key={c.id}
                className="bg-[#110717] p-5 rounded-2xl border border-[#2b2136]"
              >

                <img
                  src={getImage(c.thumbnail)}
                  className="h-40 w-full object-cover rounded mb-3"
                />

                <h3 className="font-semibold text-lg">
                  {c.title}
                </h3>

                <p className="text-sm text-gray-400">
                  {c.category} • {c.difficulty}
                </p>

                <p className="text-xs text-gray-500 mt-2">
                  Duration: {c.duration}
                </p>

                <Link
                  to={`/course-preview-details/${c.id}`}
                  className="inline-block mt-4 px-4 py-2 bg-gradient-to-r from-[#7b4dff] to-[#3cb3ff] text-black rounded-full"
                >
                  View Course →
                </Link>
              </div>
            ))}

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}