import { Button } from "@/components/ui/button";
import { Clock, BookOpen, User } from "lucide-react";
import { Container, Code2, Database, Rocket } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { Check } from "lucide-react";
import Navbar from "../../pages/Components/Navbar";
import Footer from "../Components/Footer";
import { useState, useEffect } from "react";

const modules = [
  {
    icon: Container,
    tag: "Module 1",
    title: "Docker",
    sessions: "8–10 Sessions",
    goal: "Build production-like environments locally",
    topics: [
      "Containers vs VMs",
      "Dockerfiles & images",
      "Volumes & networking",
      "Docker Compose",
      "Mini project: Python + DB app",
    ],
    color: "oklch(0.66 0.20 250)",
  },
  {
    icon: Code2,
    tag: "Module 2",
    title: "Python + FastAPI",
    sessions: "Backend + Frontend Basics",
    goal: "Build a working web service",
    topics: [
      "Virtual environments",
      "REST APIs with FastAPI",
      "Authentication basics",
      "Logging & validation",
      "Mini project: Task management API",
    ],
    color: "oklch(0.72 0.18 145)",
  },
  {
    icon: Database,
    tag: "Module 3",
    title: "PostgreSQL",
    sessions: "Database",
    goal: "Design and integrate a real database",
    topics: [
      "RDBMS fundamentals",
      "SQL & joins",
      "Schema design & indexing",
      "ORM with SQLAlchemy",
      "Mini project: integrate DB with API",
    ],
    color: "oklch(0.70 0.18 60)",
  },
  {
    icon: Rocket,
    tag: "Module 4",
    title: "Terraform + CI/CD",
    sessions: "DevOps & Deployment",
    goal: "Deploy like real-world production systems",
    topics: [
      "DevOps fundamentals",
      "Terraform providers & state",
      "GitHub Actions pipelines",
      "Docker build + push",
      "End-to-end deployment",
    ],
    color: "oklch(0.66 0.22 290)",
  },
];
const outcomes = [
  "Build a Python web app from scratch",
  "Connect it to PostgreSQL with proper schema design",
  "Run everything in Docker containers",
  "Deploy using GitHub Actions CI/CD pipelines",
  "Manage cloud infrastructure with Terraform",
  "Walk away with a live, deployed portfolio project",
];

const audience = [
  { title: "Students & beginners", desc: "Start with Python basics, finish with a deployed app." },
  { title: "Developers moving into DevOps", desc: "Get production workflows and tooling under your belt." },
  { title: "Anyone wanting real project experience", desc: "Skip theory-only courses. Build, ship, repeat." },
];
/* ================= CURRENCY ================= */

const currencySymbols: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const rates: any = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
};

const getCurrencySymbol = (currency?: string | null) => {
  const raw = (currency || "INR").toUpperCase();
  return currencySymbols[raw] || raw || "₹";
};

const convertPrice = (price: number, currency: string) => {
  return price * (rates[currency] || 1);
};
export default function LandingPage() {
  /* ================= CURRENCY ================= */

const [currency, setCurrency] = useState(
  () => localStorage.getItem("orl_currency") || "INR"
);

useEffect(() => {

  const handler = () => {

    const newCurrency =
      localStorage.getItem("orl_currency") || "INR";

    setCurrency(newCurrency);

  };

  window.addEventListener(
    "orlcurrencychange",
    handler
  );

  return () =>
    window.removeEventListener(
      "orlcurrencychange",
      handler
    );

}, []);

/* ================= PRICE ================= */

const basePrice = 2500;

const convertedPrice = convertPrice(
  basePrice,
  currency
);

const formattedPrice = new Intl.NumberFormat(
  "en-IN",
  {
    maximumFractionDigits: 0,
  }
).format(convertedPrice);
  return (
    <div className="min-h-screen text-white relative overflow-hidden">

      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0">

        {/* BASE */}
        <div className="absolute inset-0 bg-[#070b23]" />
        <div className="absolute inset-0 opacity-20 
          bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),
              linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px),
              radial-gradient(circle,rgba(255,255,255,0.12)_1px,transparent_1px)]
          bg-[size:60px_60px]
        "></div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        
      </div>

      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-20 grid md:grid-cols-2 gap-12 items-center" >
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none opacity-[0.08]
          rgba(255,255,255,0.08)
          48px spacing"
                    style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
            
          }}
        ></div>
        {/* LEFT CONTENT */}
        <div>
          <div className="inline-block bg-[#1b2145] text-sm px-4 py-2 rounded-full mb-6 text-gray-300">
            ⚡ 40-Hour Hands-on Bootcamp • 6-Month Lab Access
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Become a <span className="text-purple-400">DevOps +</span><br />
            <span className="text-blue-400">Full Stack</span> Developer <br />
            in Weeks
          </h1>

          <p className="mt-6 text-gray-400 max-w-lg">
            Tired of only learning theory? Join our hands-on bootcamp and ship real
            production-grade projects with Docker, Python (FastAPI), PostgreSQL,
            Terraform, and CI/CD.
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex gap-4">
            <a
            href="https://zoom.us/meeting/register/GxZk_6qDRNOxsj3TzjRfRQ"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl 
            bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 
            shadow-[0_0_25px_rgba(139,92,246,0.7)] 
            hover:scale-105 hover:shadow-[0_0_35px_rgba(139,92,246,0.9)] 
            transition-all duration-300"
          >
            Book Your Seat →
          </a>

                    <a
            href="#curriculum"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl 
            border border-purple-400/40 text-white 
            bg-white/5 backdrop-blur-md 
            hover:bg-white/10 hover:border-purple-400/40 
            transition-all duration-300"
          >
            View Curriculum
          </a>
          </div>

          {/* STATS WITH ICONS */}
          <div className="mt-10 flex gap-12">

            <div className="flex flex-col items-start gap-2">
              <Clock className="text-blue-400" size={20} />
              <p className="text-2xl font-bold">40</p>
              <p className="text-gray-400 text-sm">HOURS</p>
            </div>

            <div className="flex flex-col items-start gap-2">
              <BookOpen className="text-purple-400" size={20} />
              <p className="text-2xl font-bold">4</p>
              <p className="text-gray-400 text-sm">MODULES</p>
            </div>

            <div className="flex flex-col items-start gap-2">
              <User className="text-cyan-400" size={20} />
              <p className="text-2xl font-bold">6mo</p>
              <p className="text-gray-400 text-sm">LAB ACCESS</p>
            </div>

          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="relative flex justify-center">

          {/* OUTER GLOW */}
          <div className="absolute w-[650px] h-[650px] bg-purple-600/30 blur-[160px] rounded-full"></div>

          {/* CARD */}
          <div className="relative w-[500px] h-[380px] rounded-3xl bg-[#0b0f2a] p-4">

            {/* INNER BOX */}
            <div className="w-full h-full rounded-2xl bg-[#05081f] flex items-center justify-center">

              <img
                src="../../../assets/devops-hero.jpg"
                alt="DevOps"
                className="w-full max-w-[460px] object-contain drop-shadow-[0_0_90px_rgba(139,92,246,0.9)]"
              />
            </div>

            {/* PRICE */}
            <div className="absolute top-4 left-4 bg-[#1a1f4f] px-4 py-2 rounded-xl text-sm">
              <p className="text-gray-400 text-xs">Launch Offer</p>
              <p className="text-blue-400 font-semibold">
                {getCurrencySymbol(currency)}
                {formattedPrice} / student
              </p>
            </div>

            {/* FORMAT */}
            <div className="absolute bottom-4 right-4 bg-[#1a1f4f] px-4 py-2 rounded-xl text-sm">
              <p className="text-gray-400 text-xs">Format</p>
              <p className="text-white font-semibold">Live + Hands-on</p>
            </div>

          </div>
        </div>

      </section>
      
      <section id="curriculum" className="py-24 relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-[oklch(0.62_0.21_255.88)] uppercase tracking-widest">
          Curriculum
        </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            Full-stack, hands-on driven curriculum
          </h2>
          <p className="mt-4 text-muted-foreground text-[oklch(0.74_0.04_270.87)] ">
            Four focused modules. Real projects in every one. By the end you'll have a
            deployed, dockerized full-stack app with a CI/CD pipeline.
          </p>
        </div>


        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {modules.map((m) => {
            const Icon = m.icon;

            return (
              <div
                key={m.title}
                className="group relative overflow-hidden rounded-2xl p-7

                border border-white/10
                bg-gradient-to-br from-[#0f1435] to-[#1b224a]

                transition-all duration-300 ease-out
                hover:border-purple-400/40
                hover:-translate-y-1
                hover:shadow-[0_0_50px_rgba(139,92,246,0.25)]"
              >

                {/* 🔥 GLOBAL HOVER GLOW */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-blue-500/20 blur-xl"></div>
                </div>

                {/* 🔥 LOCAL COLOR GLOW (your m.color based) */}
                <div
                  className="absolute -top-20 -right-20 h-48 w-48 rounded-full opacity-20 blur-3xl group-hover:opacity-40 transition"
                  style={{ backgroundColor: m.color }}
                />

                {/* INNER BORDER SOFT */}
                <div className="absolute inset-0 rounded-2xl border border-white/5 group-hover:border-white/20 transition"></div>

                {/* CONTENT */}
                <div className="relative z-10">

                  {/* HEADER */}
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl
                      bg-white/5 group-hover:bg-purple-500/20 transition"
                      style={{ color: m.color }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {m.tag}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h3 className="mt-5 text-2xl font-bold group-hover:text-white transition">
                    {m.title}
                  </h3>

                  <p className="text-sm text-gray-400">{m.sessions}</p>

                  {/* GOAL */}
                  <p className="mt-4 text-sm">
                    <span className="font-semibold">Goal:</span>{" "}
                    <span className="text-gray-400">{m.goal}</span>
                  </p>

                  {/* LIST */}
                  <ul className="mt-5 space-y-2">
                    {m.topics.map((t) => (
                      <li
                        key={t}
                        className="flex items-start gap-2 text-sm text-gray-400 group-hover:text-gray-300 transition"
                      >
                        <span
                          className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: m.color }}
                        />
                        {t}
                      </li>
                    ))}
                  </ul>

                </div>
              </div>
            );
          })}
        </div>
      </div>
      </section>

      <section
        id="outcomes"
        className="py-24 relative overflow-hidden
        bg-[#0b0f2a] border-y border-white/5"
      >
        {/* 🔥 GRID BACKGROUND (same as hero) */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none
          bg-[linear-gradient(to_right,white_1px,transparent_1px),
              linear-gradient(to_bottom,white_1px,transparent_1px)]
          bg-[size:48px_48px]"
        />

        {/* 🔥 SOFT GLOW */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16">

          {/* ================= LEFT ================= */}
          <div>
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest">
              Outcomes
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              A real-world, job-ready workflow
            </h2>

            <p className="mt-4 text-gray-400">
              By the end of the bootcamp, you'll have done the work — not just watched it.
            </p>

            <ul className="mt-8 space-y-5">
              {outcomes.map((o) => (
                <li key={o} className="flex items-start gap-3 text-gray-300">

                  {/* ✅ CHECK ICON FIX */}
                  <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full 
                  border border-blue-400/40 text-blue-400 text-xs">
                   <CheckCircle2 />
                  </div>

                  {o}
                </li>
              ))}
            </ul>
          </div>

          {/* ================= RIGHT ================= */}
          <div>
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest">
              Who it's for
            </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight">
                Perfect for builders at any stage
              </h2>

            <div className="mt-8 space-y-5">
              {audience.map((a, i) => (
                <div className="group relative overflow-hidden rounded-2xl p-6
                  bg-gradient-to-br from-[#121735] to-[#1b224a]
                  transition-all duration-300
                  hover:border-purple-400/40
                  hover:-translate-y-1
                  hover:shadow-[0_0_40px_rgba(139,92,246,0.25)]">

                  {/* 🔥 HOVER GLOW */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-blue-500/20 blur-xl"></div>
                  </div>

                  {/* CONTENT */}
                  <div className="relative z-10 flex items-start gap-4">

                    {/* NUMBER BOX */}
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg 
                    bg-gradient-to-br from-purple-500 to-blue-500 
                    text-white font-bold text-sm">
                      {i + 1}
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">{a.title}</h3>
                      <p className="mt-1 text-sm text-gray-400">
                        {a.desc}
                      </p>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
      <section className="py-28 bg-[#050816] text-white relative">

      {/* HEADING */}
      <div className="text-center max-w-3xl mx-auto px-6">
        <p className="text-[oklch(0.62_0.21_255.88)] text-sm tracking-widest uppercase font-semibold">
          Launch Offer
        </p>

        <h2 className="mt-4 text-4xl font-bold text-white">
          One price. Everything included.
        </h2>

        <p className="mt-3 text-[oklch(0.7_0.03_260)]">
          Limited seats. Get full access at our launch price before it goes back up.
        </p>
      </div>

      {/* CARD */}
      <div className="mt-16 max-w-5xl mx-auto px-6">
        <div
          className="
          rounded-3xl p-10

          border border-[0_0_80px_rgba(99,102,241,0.15)]
          
          bg-[linear-gradient(135deg,#0b0f2a_0%,#151a45_100%)]

          shadow-[0_0_80px_rgba(99,102,241,0.15)]
        "
        >
          <div className="grid md:grid-cols-2 gap-10">

            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#141938] px-4 py-2 rounded-full text-sm text-gray-300 mb-6">
                ⚡ Limited Seats
              </div>

              <h3 className="text-2xl font-semibold text-white">
                DevOps + Full Stack Bootcamp
              </h3>

              <p className="text-[oklch(0.7_0.03_260)] mt-2">
                40-hour hands-on training · 6-month lab access
              </p>

              {/* PRICE */}
              <div className="mt-8">
               <span className="text-5xl font-bold text-[oklch(0.72_0.2_255)]">
                {getCurrencySymbol(currency)}
                {formattedPrice}
              </span>
                <span className="text-[oklch(0.7_0.03_260)] ml-2">
                  / student
                </span>

                <p className="text-sm text-gray-500 mt-1">
                  (Regular fee:
                  {" "}
                  {getCurrencySymbol(currency)}
                  {new Intl.NumberFormat("en-IN").format(
                    convertPrice(2500, currency)
                  )}
                  )
                </p>
              </div>

              {/* BUTTONS */}
             <div className="mt-8 flex gap-4">

              {/* ENROLL NOW (MAIL + ZOOM LINK) */}
              <a
                href={`https://zoom.us/meeting/register/GxZk_6qDRNOxsj3TzjRfRQ`}
                className="
                  px-6 py-3 rounded-md inline-flex items-center justify-center

                  bg-[linear-gradient(135deg,#7c3aed,#2563eb)]

                  hover:opacity-90
                  transition
                "
              >
                Enroll Now
              </a>

              {/* DM BUTTON */}
              <a
                href="mailto:enroll@onrequestlab.com"
                target="_blank"
                className="
                  px-6 py-3 rounded-md inline-flex items-center justify-center

                  border border-[oklch(0.35_0.05_260)]
                  text-[oklch(0.85_0.02_260)]

                  hover:bg-[oklch(0.2_0.05_260)]
                  transition
                "
              >
                DM to Enroll
              </a>

            </div>
            </div>

            {/* RIGHT */}
            <div>
              <p className="text-sm uppercase tracking-wider text-[oklch(0.7_0.03_260)] mb-6">
                What’s included
              </p>

              <ul className="space-y-4">
                {[
                  "40 hours of live training with trainer",
                  "6 months of lab access",
                  "All 4 modules: Docker, Python, PostgreSQL, Terraform/CI-CD",
                  "Hands-on mini projects every module",
                  "Final end-to-end deployed project",
                  "Community & doubt-clearing sessions",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[oklch(0.72_0.2_255)] mt-1" />
                    <span className="text-[oklch(0.85_0.02_260)]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
      <Footer />

    </section>
    </div>
  );
}