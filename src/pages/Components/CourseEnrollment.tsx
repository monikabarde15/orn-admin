import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
// import axios from "axios";
import {
  PlayCircle,
  X,
  Check,
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
  MessageCircle,
  Heart,
  ThumbsUp,
  Sparkles,
} from "lucide-react";
import api from "../../services/api";

import Navbar from "../../pages/Components/Navbar";
import Footer from "../../pages/Components/Footer";
import { validateWalletAddAmount } from "../../utils/walletAmount";

/* ================= CONFIG ================= */


//   const token = localStorage.getItem("access_token");
  const userId = localStorage.getItem("userId");

// const headers = {
//   Authorization: `Bearer ${token}`,
// };

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

  return [...list]
    .filter((i) => i.isDeleted !== true) // 🔥 important fix
    .sort(
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

interface CommentUser {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  profile_image?: string | null;
}

interface CourseComment {
  id: number;
  content: string;
  is_edited: boolean;
  created_at: string;
  user: CommentUser;
}

interface EngagementData {
  enrolled_count: number;
  enrolled_students: CommentUser[];
  reaction_counts: {
    like: number;
    love: number;
    clap: number;
  };
  my_reaction: "like" | "love" | "clap" | null;
}

/* ================= COMPONENT ================= */

const CourseEnrollment: React.FC = () => {
  const navigate = useNavigate();

const { id, slug } = useParams();
  console.log(slug);

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [thumbnail, setThumbnail] = useState("");

  const [comments, setComments] = useState<CourseComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  const [engagement, setEngagement] = useState<EngagementData | null>(null);
  const [engagementLoading, setEngagementLoading] = useState(false);
  const [reactionLoading, setReactionLoading] = useState(false);

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [wallet, setWallet] = useState(0);

  const [expanded, setExpanded] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [launching, setLaunching] = useState(false);

  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  /* ================= FETCH Comments and FETCH Engagement ================= */
  
  const fetchComments = async () => {
    if (!id) return;
    setCommentsLoading(true);
    try {
      const res = await api.get(`/course/courses/${id}/comments/?page=1&page_size=20`);
      setComments(res.data?.results || []);
    } catch (e) {
      console.error("Comments fetch failed", e);
    } finally {
      setCommentsLoading(false);
    }
  };
  
  const fetchEngagement = async () => {
    if (!id) return;
    setEngagementLoading(true);
    try {
      const res = await api.get(`/course/courses/${id}/engagement/`);
      setEngagement(res.data);
    } catch (e) {
      console.error("Engagement fetch failed", e);
    } finally {
      setEngagementLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchComments();
    fetchEngagement();
  }, [id]);

  /* ================= FETCH COURSE ================= */

  useEffect(() => {
  const fetchCourse = async () => {
    try {
      // const res = await api.get(`/course/courses/${id}/`, { headers });
      const res = await api.get(`/course/courses/${id}/`);

      setCourse(res.data);
      setModules(res.data?.modules || []);
      setThumbnail(res.data?.thumbnail?.image || "");

    } catch (e) {
      console.error("Course fetch failed", e);

      // ✅ handle error
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  if (id) fetchCourse(); // ✅ important

}, [id]);
  /* ================= FETCH SUBSCRIPTION + WALLET ================= */

  useEffect(() => {
    if (!course) return;

    const fetchAll = async () => {
      try {
        const [subsRes, walletRes] = await Promise.all([
          // api.get(`api/v1/users/subscriptions/`, { headers }),
          api.get(`/api/v1/users/subscriptions/`),
          // api.get(`api/v1/users/wallet/balance/`, { headers }),
          api.get(`/api/v1/users/wallet/balance/`),
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

  /* ================= COMMENT CREATE HANDLER ================= */

  const submitComment = async () => {
    if (!id) return;
    const value = commentText.trim();
    if (!value) return;
    setPostingComment(true);
    try {
      await api.post(`/course/courses/${id}/comments/`, { content: value });
      setCommentText("");
      await Promise.all([fetchComments(), fetchEngagement()]);
    } catch (e) {
      console.error("Comment post failed", e);
      alert("Please login to comment.");
    } finally {
      setPostingComment(false);
    }
  };

  /* ================= REACTION HANDLER ================= */
  const reactToCourse = async (reaction: "like" | "love" | "clap") => {
    if (!id) return;
    setReactionLoading(true);
    try {
      await api.post(`/course/courses/${id}/reaction/`, { reaction });
      await fetchEngagement();
    } catch (e) {
      console.error("Reaction failed", e);
      alert("Please login to react.");
    } finally {
      setReactionLoading(false);
    }
  };
  
  /* ================= VIDEO PROGRESS HANDLER ================= */
  const saveVideoProgress = async (videoUrl: string, chapterId?: number) => {
    if (!id || !videoRef.current) return;
    try {
      await api.post(`/course/courses/${id}/video-progress/`, {
        chapter: chapterId || null,
        video_url: videoUrl,
        current_seconds: Math.floor(videoRef.current.currentTime || 0),
        watched_seconds: Math.floor(videoRef.current.currentTime || 0),
      });
    } catch (e) {
      // silent fail for anonymous users
    }
  };

  /* ================= RAZORPAY ================= */

  // const loadRazorpay = () =>
  //   new Promise<boolean>((resolve) => {
  //     if ((window as any).Razorpay) return resolve(true);
  //     const s = document.createElement("script");
  //     s.src = "https://checkout.razorpay.com/v1/checkout.js";
  //     s.onload = () => resolve(true);
  //     s.onerror = () => resolve(false);
  //     document.body.appendChild(s);
  //   });

  // const openRazorpay = async (amount: number) => {
  //   const loaded = await loadRazorpay();
  //   if (!loaded) throw new Error("Razorpay load failed");

  //   const orderRes = await api.post(`/api/v1/users/create-order/`, { amount });
    // api.post(
    //   `api/v1/users/create-order/`,
    //   { amount },
    //   { headers }
    // );
    

    // const order = orderRes.data;

  //   return new Promise<void>((resolve, reject) => {
  //     new (window as any).Razorpay({
  //       key: order.key_id,
  //       // amount: order.amount * 100,
  //       amount: order.amount,
  //       currency: "INR",
  //       order_id: order.order_id,

  //       handler: async (res: any) => {
  //         try {
  //           await api.post(`/api/v1/users/verify-payment/`,
  //             {
  //               razorpay_payment_id: res.razorpay_payment_id,
  //               razorpay_order_id: res.razorpay_order_id,
  //               razorpay_signature: res.razorpay_signature,
  //             },
  //           );
  //           resolve();
  //         } catch {
  //           reject("Verification failed");
  //         }
  //       },

  //       modal: {
  //         ondismiss: () => reject("Payment cancelled"),
  //       },
  //     }).open();
  //   });
  // };

  /* ================= INSTANCE LIST + POLLING ================= */

const fetchInstances = async () => {
  const res = await api.get(`/api/v1/lab/userinst/${userId}/`);

  const raw = res.data;

  // 🔥 handle all cases
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;

  console.log("❌ Unexpected response 👉", raw);
  return [];
};
  const waitForLatestInstanceReady = () =>
  new Promise<void>((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const list = await fetchInstances();

        if (!Array.isArray(list)) return;

        const latest = list
          .filter((i) => i.status === "Launched" && i.isDeleted !== true)
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() -
              new Date(a.timestamp).getTime()
          )[0];

        console.log("CHECK 👉", latest);

        if (!latest) return;

        console.log("✅ Instance mil gaya:", latest);

        clearInterval(interval);
        resolve();

      } catch (e) {
        console.error("Instance polling failed", e);
      }
    }, 3000);
  });

  /* ================= LAUNCH LAB ================= */

  const launchLab = async () => {
    console.log('subscription=',subscription);
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

     

      // 🚀 Deploy
      await api.post(`/api/v1/lab/deploy/${action}/${slug || ''}/`,
        {
          user_id: userId,
          payment_id: subscription.subscription_id,
        });

      // ⏳ Wait for LATEST launched instance
      await waitForLatestInstanceReady();

      // ✅ Redirect ONLY when launched
      navigate(`/lab?user`);
      // window.location.href = `/lab?user`;
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
    <div className="min-h-screen flex flex-col items-center justify-center text-center text-white bg-slate-950">
      <div className="text-5xl mb-4">❌</div>
      <h1 className="text-2xl font-bold ">Course Not Found</h1>
      <p className="text-gray-400 mt-2">
        Invalid course ID or API error
      </p>
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
                                const videoUrl = resolveUrl(ch.video);
                                setActiveVideo(videoUrl);
                                setShowVideoPopup(true);
                                setTimeout(() => {
                                  saveVideoProgress(videoUrl, ch.id);
                                }, 0);
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

            <div className="bg-slate-900 p-8 rounded-2xl space-y-6">
  <div className="flex items-center justify-between">
    <h2 className="text-2xl font-bold text-white">Course Engagement</h2>
    {engagementLoading ? (
      <span className="text-gray-400 text-sm">Loading...</span>
    ) : (
      <span className="text-gray-300 text-sm">
        Enrolled Students: <strong>{engagement?.enrolled_count || 0}</strong>
      </span>
    )}
  </div>

  <div className="flex items-center gap-3 flex-wrap">
    {(engagement?.enrolled_students || []).map((u) => (
      <div key={u.id} className="w-9 h-9 rounded-full overflow-hidden bg-slate-700">
        {u.profile_image ? (
          <img src={u.profile_image} alt={u.username} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-white">
            {(u.first_name?.[0] || u.username?.[0] || "U").toUpperCase()}
          </div>
        )}
      </div>
    ))}
  </div>

  <div className="flex gap-3 flex-wrap">
    <button
      disabled={reactionLoading}
      onClick={() => reactToCourse("like")}
      className={`px-4 py-2 rounded-lg border ${engagement?.my_reaction === "like" ? "border-blue-400 text-blue-300" : "border-slate-700 text-gray-300"}`}
    >
      <ThumbsUp size={16} className="inline mr-2" />
      Like ({engagement?.reaction_counts?.like || 0})
    </button>
    <button
      disabled={reactionLoading}
      onClick={() => reactToCourse("love")}
      className={`px-4 py-2 rounded-lg border ${engagement?.my_reaction === "love" ? "border-pink-400 text-pink-300" : "border-slate-700 text-gray-300"}`}
    >
      <Heart size={16} className="inline mr-2" />
      Love ({engagement?.reaction_counts?.love || 0})
    </button>
    <button
      disabled={reactionLoading}
      onClick={() => reactToCourse("clap")}
      className={`px-4 py-2 rounded-lg border ${engagement?.my_reaction === "clap" ? "border-purple-400 text-purple-300" : "border-slate-700 text-gray-300"}`}
    >
      <Sparkles size={16} className="inline mr-2" />
      Clap ({engagement?.reaction_counts?.clap || 0})
    </button>
  </div>
</div>

<div className="bg-slate-900 p-8 rounded-2xl space-y-4">
  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
    <MessageCircle size={20} />
    Comments
  </h2>

  <div className="space-y-3">
    <textarea
      value={commentText}
      onChange={(e) => setCommentText(e.target.value)}
      placeholder="Write your comment..."
      className="w-full rounded-lg bg-slate-800 border border-slate-700 text-white p-3"
      rows={3}
      maxLength={1000}
    />
    <button
      disabled={postingComment}
      onClick={submitComment}
      className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50"
    >
      {postingComment ? "Posting..." : "Post Comment"}
    </button>
  </div>

  <div className="space-y-4">
    {commentsLoading ? (
      <p className="text-gray-400">Loading comments...</p>
    ) : comments.length === 0 ? (
      <p className="text-gray-400">No comments yet.</p>
    ) : (
      comments.map((c) => (
        <div key={c.id} className="border border-slate-800 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">
            {c.user?.first_name || c.user?.username} • {new Date(c.created_at).toLocaleString()}
          </div>
          <p className="text-gray-200">{c.content}</p>
        </div>
      ))
    )}
  </div>
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
    {/* <p className="text-xs text-gray-400 text-center">
      Wallet balance: ₹{wallet}
    </p> */}
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

            {/* <video
              ref={videoRef}
              src={activeVideo}
              className="w-full max-w-5xl rounded-xl"
              controls
              autoPlay
            /> */}
            <video
              ref={videoRef}
              src={activeVideo}
              className="w-full max-w-5xl rounded-xl"
              controls
              autoPlay
              onTimeUpdate={() => {
                if (activeVideo && Math.floor(videoRef.current?.currentTime || 0) % 10 === 0) {
                  saveVideoProgress(activeVideo);
                }
              }}
            />
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default CourseEnrollment;
