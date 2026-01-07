import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { debounce } from "lodash";
import { motion } from "framer-motion";
import Footer from "../pages/Components/Footer";
import Navbar from "../pages/Components/Navbar";
import { BlogsMetatags } from "../pages/Pages/BlogsMetatags";

export default function BlogList() {
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE = "https://dev.backend.onrequestlab.com/api/v1";
  const getToken = () => localStorage.getItem("token") || "";

  const api = axios.create({
    baseURL: API_BASE,
    headers: { Accept: "application/json" },
  });

  api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  /* ================= Image Helper ================= */
  const getFullImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/800x400';
    if (path.startsWith("http")) return path;
    return `https://dev.backend.onrequestlab.com${path}`;
  };

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const initialPage = parseInt(params.get("page") || "1", 10);
  const initialQuery = params.get("q") || "";

  const [blogs, setBlogs] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageSize] = useState(6);
  const [q, setQ] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateURL = (newPage, newQuery) => {
    const s = new URLSearchParams();
    if (newQuery) s.set("q", newQuery);
    if (newPage && newPage !== 1) s.set("page", newPage);
    navigate({ pathname: "/blogs", search: s.toString() }, { replace: false });
  };

  const debouncedFetch = useMemo(
    () =>
      debounce((nextQ, nextPage) => {
        fetchData(nextPage, nextQ);
      }, 500),
    []
  );

  useEffect(() => {
    fetchData(page, q);
    return () => debouncedFetch.cancel();
  }, []); // eslint-disable-line

  useEffect(() => {
    updateURL(page, q);
    setLoading(true);
    setError("");
    debouncedFetch(q, page);
  }, [q, page]); // eslint-disable-line

  async function fetchData(pageToFetch = 1, query = "") {
    try {
      setLoading(true);
      setError("");

      const countResp = await api.get("/blog/count/");
      const totalCount = countResp?.data?.count ?? countResp?.data ?? 0;
      setCount(Number(totalCount));

      const resp = await api.get("/blog/", {
        params: {
          page: pageToFetch,
          page_size: pageSize,
          search: query,
          q: query,
        },
      });

      const data = resp?.data?.results ?? resp?.data ?? [];
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetch blogs error:", err);
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  const gotoPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (e) => {
    setPage(1);
    setQ(e.target.value);
  };

  return (
    <>
    <BlogsMetatags />
      <Navbar />

      <div className="min-h-screen bg-[#0f0b16] text-gray-100 py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-col md:flex-row gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                <span className="block">
                  RedHat Cluster Labs for Beginners –
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7b4dff] to-[#3cb3ff]">
                    Latest Blogs and Tutorials
                  </span>
                </span>
              </h1>
              {/* <p className="text-gray-400 mt-2">
                Latest tutorials, labs and tips from our experts.
              </p> */}
            </div>

            <div className="w-full md:w-1/3">
              <input
                value={q}
                onChange={handleSearchChange}
                placeholder="Search blogs..."
                className="w-full rounded-xl px-4 py-2 bg-[#120917] border border-[#2b2136] focus:ring-2 focus:ring-[#7b4dff]"
              />
            </div>
          </div>

          {/* Loading / Error */}
          {loading && (
            <div className="py-8 text-center text-gray-300">Loading...</div>
          )}
          {error && (
            <div className="py-4 text-center text-red-400">{error}</div>
          )}

          {/* Blog Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((b) => (
              <motion.article
                key={b.blogId || b.id}
                whileHover={{ scale: 1.04, y: -5 }}
                transition={{ type: "spring", stiffness: 250 }}
                className="bg-[#110717] rounded-2xl p-5 border border-[#2b2136] shadow-lg"
              >
                {/* Image */}
                <div className="h-44 rounded-lg overflow-hidden mb-4 relative group">
                  <img
                    src={getFullImageUrl(
                      b.thumbnail || b.image || b.imageUrl || b.image_path
                    )}
                    alt={b.title || "Blog image"}
                    loading="lazy"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/800x400';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0b16]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <h3 className="text-xl font-semibold mb-1">
                  {b.title}
                </h3>

                <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                  {b.excerpt ??
                    b.short_description ??
                    (b.description
                      ? b.description
                          .replace(/(<([^>]+)>)/gi, "")
                          .slice(0, 120) + "..."
                      : "")}
                </p>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    {new Date(
                      b.published_at ?? b.created_at ?? Date.now()
                    ).toLocaleDateString()}
                  </div>

                  <Link
                    to={`/blog-detail/${b.blogId}`}
                    className="bg-gradient-to-r from-[#8f5bff] to-[#5ec2ff] text-black px-4 py-2 rounded-full text-sm font-medium"
                  >
                    Read →
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              onClick={() => gotoPage(page - 1)}
              disabled={page <= 1}
              className="px-4 py-2 rounded bg-[#1b1522] disabled:opacity-40"
            >
              Prev
            </button>

            <span className="text-gray-400">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => gotoPage(page + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded bg-[#1b1522] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
