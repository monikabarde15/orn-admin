import React from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

const API = "https://dev.backend.onrequestlab.com";

export default function BlogDetailPage() {

  const { slug: paramSlug } = useParams();

  // 🔥 fallback slug (kabhi undefined ho to bhi chale)
  const slug =
    paramSlug ||
    window.location.pathname.split("/")[2];

  // ================= BLOG DETAIL =================
  const { data: blog } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const res = await axios.get(`${API}/api/v1/blog/${slug}/`);
      return res.data.data;
    },
    enabled: !!slug,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,

    // ⚡ instant UI
    placeholderData: {
      title: "Loading...",
      description: "<p>Loading content...</p>",
      image: null,
      createdAt: "",
    },
  });

  // ================= BLOG LIST =================
  const { data: blogs = [] } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await axios.get(`${API}/api/v1/blog/`);
      return res.data.data || res.data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    placeholderData: [],
  });

  // 🔥 latest blogs (exclude current)
  const latestBlogs = blogs
    .filter((b) => b.slug !== slug)
    .slice(0, 5);

  // 🔥 image fix
  const getImage = (img) => {
    if (!img) return "https://via.placeholder.com/800x400";
    if (img.startsWith("http")) return img;
    return `${API}${img}`;
  };

  return (
    <>
      <Navbar />

      <div className="bg-[#0b0718] text-white min-h-screen">

        {/* ================= HERO ================= */}
        <div className="relative h-[300px] md:h-[400px]">

          {blog?.image ? (
            <img
              src={getImage(blog.image)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#1a1225] animate-pulse" />
          )}

          <div className="absolute inset-0 bg-black/60 flex flex-col justify-center px-6 md:px-20">

            <h1 className="text-2xl md:text-5xl font-bold max-w-3xl">
               {blog?.title || "Loading..."}
            </h1>

            <p className="text-gray-400 mt-2 text-sm">
              {blog?.createdAt?.slice(0, 10) || ""}
            </p>

          </div>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-10">

          {/* ================= LEFT SIDE ================= */}
          <div className="md:col-span-2">

            <div className="bg-[#110717] p-6 rounded-2xl border border-[#2b2136]">

              <div
                className="prose prose-invert max-w-none text-gray-300"
                dangerouslySetInnerHTML={{
                  __html: blog?.description || "<p>Loading...</p>",
                }}
              />

            </div>

            {/* BACK */}
            <div className="mt-8">
              <Link
                to="/blogs"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#7c4dff] to-[#3f95ff] text-black"
              >
                ← Back to Blogs
              </Link>
            </div>

          </div>

          {/* ================= RIGHT SIDEBAR ================= */}
          <div className="sticky top-24 h-fit">

            <div className="bg-[#110717] p-5 rounded-2xl border border-[#2b2136]">

              <h3 className="text-xl font-semibold mb-5 border-b border-[#2b2136] pb-2">
                Latest Blogs
              </h3>

              <div className="flex flex-col gap-5">

                {latestBlogs.length === 0 ? (
                  <p className="text-gray-400">Loading...</p>
                ) : (
                  latestBlogs.map((b) => (
                    <Link
                      key={b.blogId}
                      to={`/blog-detail/${b.slug}`}
                      className="flex gap-4 group"
                    >
                      <img
                        src={getImage(b.image)}
                        className="w-20 h-20 rounded-lg object-cover"
                      />

                      <div>
                        <p className="text-sm font-medium group-hover:text-[#7c4dff]">
                          {b.title}
                        </p>

                        <span className="text-xs text-gray-400">
                          {b.createdAt?.slice(0, 10)}
                        </span>
                      </div>
                    </Link>
                  ))
                )}

              </div>
            </div>

            {/* VIEW ALL */}
            <Link
              to="/blogs"
              className="block mt-6 text-center py-3 rounded-xl bg-gradient-to-r from-[#7c4dff] to-[#3f95ff] text-black font-semibold"
            >
              View All Blogs →
            </Link>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}