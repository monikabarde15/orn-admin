import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "../pages/Components/Navbar";
import Footer from "../pages/Components/Footer";
import { BlogsMetatags } from "../pages/Pages/BlogsMetatags";

const VIT = import.meta.env.VITE_API_URL;
const PAGE_SIZE = 6;

export default function BlogList() {
  /* ================= STATE ================= */
  const [allBlogs, setAllBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= API INSTANCE ================= */
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: `${VIT}/api/v1`,
      headers: { Accept: "application/json" },
    });

    instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    return instance;
  }, []);

  /* ================= IMAGE HELPER ================= */
  const getFullImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/800x400";
    if (path.startsWith("http")) return path;
    return `${VIT}${path}`;
  };

  /* ================= SINGLE API CALL ================= */
  useEffect(() => {
    fetchAllBlogs();
  }, []);

  const fetchAllBlogs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/blog/"); // ✅ ONLY ONE CALL

      console.log("BLOG API RESPONSE 👉", res.data);

      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.results)
        ? res.data.results
        : [];

      setAllBlogs(data);
    } catch (err) {
      console.error(err);
      setError("Blogs load nahi ho pa rahe");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FRONTEND PAGINATION ================= */
  const totalPages = Math.ceil(allBlogs.length / PAGE_SIZE);

  const blogsToShow = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return allBlogs.slice(start, end);
  }, [allBlogs, page]);

  /* ================= UI ================= */
  return (
    <>
      <BlogsMetatags />
      <Navbar />

      <div className="min-h-screen bg-[#0f0b16] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-10">
            Latest Blogs &
            <span className="block bg-gradient-to-r from-[#7b4dff] to-[#3cb3ff] bg-clip-text text-transparent">
              Tutorials
            </span>
          </h1>

          {/* LOADING / ERROR */}
          {loading && <p className="text-center py-8">Loading...</p>}
          {error && <p className="text-center text-red-400">{error}</p>}

          {/* BLOG LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogsToShow.map((b) => (
              <motion.article
                key={b.blogId || b.id}
                whileHover={{ scale: 1.05 }}
                className="bg-[#110717] rounded-2xl p-5 border border-[#2b2136]"
              >
                <div className="h-44 overflow-hidden rounded-lg mb-4">
                  <img
                    src={getFullImageUrl(
                      b.thumbnail || b.image || b.image_path
                    )}
                    alt={b.title}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://via.placeholder.com/800x400")
                    }
                  />
                </div>

                <h3 className="text-xl font-semibold mb-2">
                  {b.title}
                </h3>

                <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                  {b.excerpt ||
                    b.short_description ||
                    b.description
                      ?.replace(/<[^>]+>/g, "")
                      .slice(0, 120)}
                </p>

                <Link
                  to={`/blog-detail/${b.slug}`}
                  className="inline-block text-sm bg-gradient-to-r from-[#8f5bff] to-[#5ec2ff] text-black px-4 py-2 rounded-full"
                >
                  Read →
                </Link>
              </motion.article>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-[#1b1522] rounded disabled:opacity-40"
              >
                Prev
              </button>

              <span className="text-gray-400">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-[#1b1522] rounded disabled:opacity-40"
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
