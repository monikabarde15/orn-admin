import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  PlayCircle,
  X,
  Check,
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";
import { useParams } from "react-router-dom";
import Navbar from "../../pages/Components/Navbar";
import Footer from "../../pages/Components/Footer";

console.log(import.meta.env.VITE_API_URL);
const VIT=import.meta.env.VITE_API_URL;
/* ================= AXIOS INSTANCE ================= */

const api = axios.create({
  baseURL: `${VIT}`,
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("jwt-auth") ||
    "";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ================= HELPERS ================= */

const resolveUrl = (url?: string | null) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
};

/* ================= TYPES ================= */

interface Chapter {
  id: number;
  title: string;
  description?: string;
  video?: string | null;
  file?: string | null;
}

interface Module {
  id: number;
  title: string;
  chapters: Chapter[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  instructor: string;
  price: string;
  learningOutcomes: string;
  prerequisites: string;
  isPublished: boolean;
  updated_at: string;
}

/* ================= COMPONENT ================= */

const CourseEnrollment: React.FC = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [thumbnail, setThumbnail] = useState("");
  const [expanded, setExpanded] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const [addingToCart, setAddingToCart] = useState(false);
  const [inCart, setInCart] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
const { id } = useParams<{ id: string }>();

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get(`/course/courses/${id}/`);

        // const res = await api.get("/course/courses/1/");
        setCourse(res.data);
        setModules(res.data?.modules || []);
        setThumbnail(res.data?.thumbnail?.image_url || "");
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  /* ================= HELPERS ================= */

  const toggleModule = (id: number) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAddToCart = async () => {
    if (!course) return;
    try {
      setAddingToCart(true);
      await api.post("/cart/add/", { course: course.id });
      setInCart(true);
      alert("Course added to cart");
    } catch (err) {
      console.error(err);
      alert("Failed to add course to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const learningPoints =
    course?.learningOutcomes?.length > 0
      ? course.learningOutcomes.split(",")
      : [];

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading course...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Course not found
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">

        {/* ================= LEFT ================= */}
        <div className="lg:col-span-2 space-y-6">

          {/* THUMBNAIL */}
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={
                resolveUrl(thumbnail) ||
                "https://cfvod.kaltura.com/p/1727411/sp/172741100/thumbnail/entry_id/1_dsoakh0b/version/100000/width/412/height/248"
              }
              className="w-full aspect-video object-cover"
              alt="Course thumbnail"
            />
          </div>

          {/* COURSE INFO */}
          <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
            <h1 className="text-4xl font-bold text-white mb-4">
              {course.title}
            </h1>

            <p className="text-xl text-gray-300 mb-6">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-3 mb-4">
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full">
                {course.difficulty}
              </span>
              <span className="bg-slate-700 text-white px-3 py-1 rounded-full">
                {course.category}
              </span>
              <span className="text-gray-300 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {course.duration}
              </span>
            </div>

            <p className="text-gray-400">
              Last updated:{" "}
              <span className="text-purple-400">
                {new Date(course.updated_at).toLocaleDateString()}
              </span>
            </p>
          </div>

          {/* WHAT YOU'LL LEARN */}
          <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-6">
              What you'll learn
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {learningPoints.map((p, i) => (
                <div key={i} className="flex gap-2 text-gray-300">
                  <Check className="text-purple-400" />
                  {p.trim()}
                </div>
              ))}
            </div>
          </div>

          {/* COURSE CONTENT */}
          <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-6">
              Course content
            </h2>

            {modules.length ? (
              modules.map((mod) => (
                <div key={mod.id} className="border border-slate-700 rounded-xl mb-4">
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className="w-full flex justify-between items-center p-4 text-white"
                  >
                    {mod.title}
                    {expanded.includes(mod.id) ? <ChevronUp /> : <ChevronDown />}
                  </button>

                  {expanded.includes(mod.id) && (
                    <div className="px-6 pb-4 space-y-3">
                      {mod.chapters.map((ch) => (
                        <div
                          key={ch.id}
                          className="flex justify-between items-center border-b border-slate-700 py-2 text-gray-300"
                        >
                          <span>{ch.title}</span>

                          <div className="flex gap-4">
                            {ch.video && (
                              <button
                                onClick={() => {
                                  setActiveVideo(resolveUrl(ch.video));
                                  setShowVideoPopup(true);
                                }}
                                className="text-purple-400 flex gap-1"
                              >
                                <PlayCircle size={18} />
                                Play
                              </button>
                            )}

                            {ch.file && (
                              <a
                                href={resolveUrl(ch.file)}
                                target="_blank"
                                rel="noreferrer"
                                className="text-green-400 flex gap-1"
                              >
                                <Download size={18} />
                                Download
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400">No modules available</p>
            )}
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4">
            <button
              disabled
              className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold cursor-default"
            >
              Watch
            </button>
            <a href="/your-instances">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || inCart}
              className={`w-full py-4 rounded-lg font-semibold border transition
                ${
                  inCart
                    ? "border-green-500 text-green-400 cursor-not-allowed"
                    : "border-slate-700 text-white hover:bg-slate-800"
                }`}
            >
              {inCart
                ? "Already in Cart"
                : addingToCart
                ? "Lunching..."
                : "Lunch Lab"}
            </button>
            </a>

            <p className="text-xs text-gray-400 text-center">
              Lifetime access • Certificate included
            </p>
          </div>
        </div>
      </div>

      {/* VIDEO POPUP */}
      {showVideoPopup && activeVideo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <button
            onClick={() => setShowVideoPopup(false)}
            className="absolute top-6 right-6 text-white"
          >
            <X size={32} />
          </button>

          <video
            ref={videoRef}
            src={activeVideo}
            className="w-full max-w-5xl rounded-xl"
            controls
            autoPlay
          />
        </div>
      )}
    </div>
    <Footer />
    </>
    
  );
};

export default CourseEnrollment;
