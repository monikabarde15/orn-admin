import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { debounce } from "lodash";
import { motion } from "framer-motion"; // 🪄 for smooth hover animations
import Footer from "../pages/Components/Footer";
import Navbar from "../pages/Components/Navbar";

export default function BlogList() {
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE = "https://backend.onrequestlab.com/api/v1";
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

  // ✅ Helper: Full image URL fix
  const getFullImageUrl = (path) => {
    if (!path) return "/assets/default-blog.jpg";
    if (path.startsWith("http")) return path;
    return `https://backend.onrequestlab.com${path}`;
  };

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
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
    navigate({ pathname: "/blog-all", search: s.toString() }, { replace: false });
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
    setError("");
    setLoading(true);
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
      <Navbar />
      <div className="min-h-screen bg-[#0f0b16] text-gray-100 py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-col md:flex-row gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                <span className="block">
                  Our{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7b4dff] to-[#3cb3ff]">
                    Blogs
                  </span>
                </span>
              </h1>
              <p className="text-gray-400 mt-2">
                Latest tutorials, labs and tips from our experts.
              </p>
            </div>

            <div className="w-full md:w-1/3">
              <input
                value={q}
                onChange={handleSearchChange}
                placeholder="Search blogs..."
                className="w-full rounded-xl px-4 py-2 bg-[#120917] border border-[#2b2136] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7b4dff] transition-all duration-200"
              />
            </div>
          </div>

          {/* Loading / Error */}
          {loading && <div className="py-8 text-center text-gray-300">Loading...</div>}
          {error && <div className="py-4 text-center text-red-400">{error}</div>}

          {/* Blog Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((b) => (
              <motion.article
                key={b.id}
                whileHover={{ scale: 1.04, y: -5 }}
                transition={{ type: "spring", stiffness: 250 }}
                className="bg-[#110717] rounded-2xl p-5 shadow-lg border border-[#2b2136] hover:shadow-[0_0_20px_#7b4dff30] transition-all duration-300"
              >
                <div className="h-44 rounded-lg overflow-hidden mb-4 relative group">
                  <img
                    src={getFullImageUrl(
                      b.thumbnail || b.image || b.imageUrl || b.image_path
                    )}
                    alt={b.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0b16]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <h3 className="text-xl font-semibold mb-1 group-hover:text-[#8f5bff] transition-colors">
                  {b.title}
                </h3>

                <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                  {b.excerpt ??
                    b.short_description ??
                    (b.content
                      ? b.content.replace(/(<([^>]+)>)/gi, "").slice(0, 120) + "..."
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
                    className="inline-block bg-gradient-to-r from-[#8f5bff] to-[#5ec2ff] text-black px-4 py-2 rounded-full text-sm font-medium hover:from-[#a070ff] hover:to-[#74d1ff] transition-all duration-300 shadow-md"
                  >
                    Read →
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-10 flex items-center justify-center space-x-3">
            <button
              onClick={() => gotoPage(page - 1)}
              disabled={page <= 1}
              className="px-4 py-2 rounded-lg bg-[#1b1522] disabled:opacity-40 border border-[#2b2136] hover:bg-[#2b2136] transition-all duration-200"
            >
              Prev
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pNum = i + 1;
                if (
                  pNum === 1 ||
                  pNum === totalPages ||
                  (pNum >= page - 1 && pNum <= page + 1)
                ) {
                  return (
                    <button
                      key={pNum}
                      onClick={() => gotoPage(pNum)}
                      className={`px-3 py-1 rounded-md transition-all duration-200 ${
                        pNum === page
                          ? "bg-gradient-to-r from-[#7b4dff] to-[#3cb3ff] text-black shadow-md"
                          : "bg-[#160d18] text-gray-300 border border-[#2b2136] hover:bg-[#231829]"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                }
                if (pNum === 2 && page > 4) return <span key={pNum}>…</span>;
                if (pNum === totalPages - 1 && page < totalPages - 3)
                  return <span key={pNum}>…</span>;
                return null;
              })}
            </div>

            <button
              onClick={() => gotoPage(page + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-lg bg-[#1b1522] disabled:opacity-40 border border-[#2b2136] hover:bg-[#2b2136] transition-all duration-200"
            >
              Next
            </button>
          </div>

          <div className="mt-6 text-center text-gray-500">
            Showing page {page} of {totalPages} — {count} posts
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
