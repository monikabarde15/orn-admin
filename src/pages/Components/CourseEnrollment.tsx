import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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
import Navbar from "../../pages/Components/Navbar";
import Footer from "../../pages/Components/Footer";

/* ================= CONFIG ================= */

const VIT = import.meta.env.VITE_API_URL;
const API_V1 = `${VIT}/api/v1`;

const getCookie = (name: string) => {
  const v = `; ${document.cookie}`;
  const parts = v.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
  return "";
};

const token =
  getCookie("access") ||
  localStorage.getItem("jwt-auth") ||
  localStorage.getItem("token") ||
  "";

const userId = getCookie("user_id");

const headers = {
  Authorization: `Bearer ${token}`,
};

/* ================= HELPERS ================= */

const resolveUrl = (url?: string | null) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
};

const getAction = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("docker")) return "docker";
  if (n.includes("kubernetes") || n.includes("k8s")) return "kubernetes";
  if (n.includes("linux")) return "linux";
  if (n.includes("redhat") || n.includes("rhel")) return "redhat";
  if (n.includes("terraform")) return "terraform";
  if (n.includes("iscsi")) return "iscsi";
  if (n.includes("python")) return "python";
  if (n.includes("jenkins")) return "jenkins";
  return null;
};

/* 🔥 FIXED: timestamp based latest instance */
const getLatestInstance = (list: any[]) => {
  if (!list || !list.length) return null;

  return [...list].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() -
      new Date(a.timestamp).getTime()
  )[0];
};

/* ================= TYPES ================= */

interface Chapter {
  id: number;
  title: string;
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
  learningOutcomes: string;
}

interface Subscription {
  subscription_id: number;
  course_id: number;
  name: string;
  price: number;
}

/* ================= COMPONENT ================= */

const CourseEnrollment: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [thumbnail, setThumbnail] = useState("");

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [wallet, setWallet] = useState(0);

  const [expanded, setExpanded] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [launching, setLaunching] = useState(false);

  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  /* ================= FETCH COURSE ================= */

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `${VIT}/course/courses/${id}/`,
          { headers }
        );
        setCourse(res.data);
        setModules(res.data?.modules || []);
        setThumbnail(res.data?.thumbnail?.image || "");
      } catch (e) {
        console.error("Course fetch failed", e);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  /* ================= FETCH SUBSCRIPTION + WALLET ================= */

  useEffect(() => {
    if (!course) return;

    const fetchAll = async () => {
      try {
        const [subsRes, walletRes] = await Promise.all([
          axios.get(`${API_V1}/users/subscriptions/`, { headers }),
          axios.get(`${API_V1}/users/wallet/balance/`, { headers }),
        ]);

        const sub = subsRes.data.find(
          (s: any) => s.course_id === course.id
        );

        setSubscription(sub || null);
        setWallet(walletRes.data?.balance || 0);
      } catch (e) {
        console.error("Subscription / Wallet fetch failed", e);
      }
    };

    fetchAll();
  }, [course]);

  /* ================= RAZORPAY ================= */

  const loadRazorpay = () =>
    new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const openRazorpay = async (amount: number) => {
    const loaded = await loadRazorpay();
    if (!loaded) throw new Error("Razorpay load failed");

    const orderRes = await axios.post(
      `${API_V1}/users/create-order/`,
      { amount },
      { headers }
    );

    const order = orderRes.data;

    return new Promise<void>((resolve, reject) => {
      new (window as any).Razorpay({
        key: order.key_id,
        amount: order.amount * 100,
        currency: "INR",
        order_id: order.order_id,

        handler: async (res: any) => {
          try {
            await axios.post(
              `${API_V1}/users/verify-payment/`,
              {
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_order_id: res.razorpay_order_id,
                razorpay_signature: res.razorpay_signature,
              },
              { headers }
            );
            resolve();
          } catch {
            reject("Verification failed");
          }
        },

        modal: {
          ondismiss: () => reject("Payment cancelled"),
        },
      }).open();
    });
  };

  /* ================= INSTANCE LIST + POLLING ================= */

  const fetchInstances = async () => {
    const res = await axios.get(
      `${API_V1}/lab/userinst/${userId}`,
      { headers }
    );
    return res.data || [];
  };

  const waitForLatestInstanceReady = () =>
    new Promise<void>((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const list = await fetchInstances();
          const latest = getLatestInstance(list);

          if (!latest) return;

          // ❌ ignore deleted instances
          if (latest.isDeleted) return;

          console.log(
            "LATEST INSTANCE:",
            latest.status,
            latest.timestamp
          );

          // ✅ SUCCESS
          if (latest.status === "Launched") {
            clearInterval(interval);
            resolve();
          }

          // ❌ FAILURE
          if (latest.status === "Failed") {
            clearInterval(interval);
            reject("Instance failed");
          }
        } catch (e) {
          console.error("Instance polling failed", e);
        }
      }, 5000);
    });

  /* ================= LAUNCH LAB ================= */

  const launchLab = async () => {
    if (!subscription) {
      alert("No active subscription");
      return;
    }

    const action = getAction(subscription.name);
    if (!action) {
      alert(`Unsupported lab: ${subscription.name}`);
      return;
    }

    try {
      setLaunching(true);

      const price = subscription.price || 0;

      // 💰 Wallet / Razorpay
      if (wallet < price) {
        await openRazorpay(price - wallet);
      }

      // 🚀 Deploy
      await axios.post(
        `${API_V1}/users/deploy/${action}/`,
        {
          user_id: userId,
          payment_id: subscription.subscription_id,
        },
        { headers }
      );

      // ⏳ Wait for LATEST launched instance
      await waitForLatestInstanceReady();

      // ✅ Redirect ONLY when launched
      window.location.href = `/lab`;
    } catch (err) {
      console.error("Launch failed", err);
      alert("Lab launch failed");
      setLaunching(false);
    }
  };

  /* ================= UI ================= */

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

  return (
    <>
      <Navbar />

      {launching && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="text-white text-xl text-center animate-pulse">
            🚀 Launching lab… <br />
            Waiting for instance to be Launched
          </div>
        </div>
      )}

      <div className="min-h-screen bg-slate-950 px-4 py-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <img
              src={resolveUrl(thumbnail)}
              className="w-full aspect-video rounded-2xl object-cover"
            />

            <div className="bg-slate-900 p-8 rounded-2xl">
              <h1 className="text-4xl font-bold text-white">
                {course.title}
              </h1>
              <p className="text-gray-300 mt-4">
                {course.description}
              </p>

              <div className="flex gap-4 mt-4 text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock size={16} /> {course.duration}
                </span>
                <span>{course.category}</span>
                <span>{course.difficulty}</span>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-white mb-4">
                What you'll learn
              </h2>

              {course.learningOutcomes.split(",").map((p, i) => (
                <div key={i} className="flex gap-2 text-gray-300">
                  <Check className="text-purple-400" />
                  {p.trim()}
                </div>
              ))}
            </div>

            <div className="bg-slate-900 p-8 rounded-2xl">
              {modules.map((mod) => (
                <div key={mod.id}>
                  <button
                    onClick={() =>
                      setExpanded((e) =>
                        e.includes(mod.id)
                          ? e.filter((x) => x !== mod.id)
                          : [...e, mod.id]
                      )
                    }
                    className="w-full flex justify-between p-4 text-white"
                  >
                    {mod.title}
                    {expanded.includes(mod.id) ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </button>

                  {expanded.includes(mod.id) &&
                    mod.chapters.map((ch) => (
                      <div
                        key={ch.id}
                        className="flex justify-between px-6 py-2 text-gray-300"
                      >
                        {ch.title}

                        <div className="flex gap-4">
                          {ch.video && (
                            <button
                              onClick={() => {
                                setActiveVideo(
                                  resolveUrl(ch.video)
                                );
                                setShowVideoPopup(true);
                              }}
                              className="text-purple-400"
                            >
                              <PlayCircle size={18} />
                            </button>
                          )}

                          {ch.file && (
                            <a
                              href={resolveUrl(ch.file)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-green-400"
                            >
                              <Download size={18} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
         {/* RIGHT */}
<div>
  <div className="sticky top-6 bg-slate-900 p-6 rounded-2xl space-y-4">

    {/* ✅ WATCH BUTTON */}
    <a href={`/course/${course.id}`}>
      <button
        className="w-full py-4 rounded-lg
          border border-slate-700
          bg-slate-800 text-white
          hover:bg-slate-700 transition"
      >
        Watch Course
      </button>
    </a>

    {/* 🚀 LAUNCH LAB BUTTON */}
    <button
      onClick={launchLab}
      disabled={!subscription || launching}
      className="w-full py-4 rounded-lg
        bg-purple-600 text-white
        hover:bg-purple-500
        disabled:opacity-50 transition"
    >
      {launching
        ? "Launching Lab..."
        : subscription
        ? "Launch Lab"
        : "No Active Subscription"}
    </button>

    {/* 💰 WALLET INFO */}
    <p className="text-xs text-gray-400 text-center">
      Wallet balance: ₹{wallet}
    </p>
  </div>
</div>

        </div>

        {/* VIDEO POPUP */}
        {showVideoPopup && activeVideo && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
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
