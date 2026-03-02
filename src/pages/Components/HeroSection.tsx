import heroImg from "/assets/onerequest/1.png";
import Group from "/assets/onerequest/Group 37335.png";



export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#1b1533]">
      
      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* ================= IMAGE ================= */}
          <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative w-full max-w-[340px] sm:max-w-[420px]">

              {/* MAIN IMAGE */}
              <img
                src={heroImg}
                alt="Hero"
                className="w-full h-auto rounded-2xl lg:rounded-[28px] shadow-2xl"
                style={{
                  clipPath:
                    "polygon(0 0, 80% 0, 100% 18%, 100% 100%, 20% 100%, 0 82%)",
                }}
              />

              {/* FLOATING ELEMENTS (DESKTOP ONLY) */}
              <div className="hidden lg:block pointer-events-none">

                <div className="absolute -top-6 left-16">
                  <img
                src={Group}
                alt="Hero"
                className="w-full h-auto rounded-2xl lg:rounded-[28px] shadow-2xl"
                style={{
                  clipPath:
                    "polygon(0 0, 80% 0, 100% 18%, 100% 100%, 20% 100%, 0 82%)",
                }}
              />
                  {/* <span className="px-4 py-2 bg-[#8b5cf6] text-white rounded-full text-sm shadow-lg">
                    ✨ Easy for Beginners
                  </span> */}
                </div>

                <div className="absolute -left-24 top-1/2 -translate-y-1/2">
                  <div className="bg-white text-black px-4 py-3 rounded-xl shadow-xl text-sm w-[230px]">
                    📘 Practice-Based Online Learning System
                  </div>
                </div>

                <div className="absolute -right-14 bottom-10">
                  <div className="bg-white text-black px-4 py-3 rounded-xl shadow-xl text-sm">
                    💻 Free Hands-on Learning
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ================= TEXT ================= */}
          <div className="order-1 lg:order-2 text-white text-center lg:text-left">
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Hands-on Free Redhat Cluster Labs and
              {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8358ff] to-[#39c6fa]">
                DevOps Learning Platform
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[#bfc0c4] max-w-xl mx-auto lg:mx-0">
              Stimulating your learning experience with self-practice labs,
              low-cost modules, and technical blogs by industry experts.
            </p>

            <div className="mt-8 flex justify-center lg:justify-start">
              <a href="/register">
              <button className="px-8 py-3 bg-[#8b5cf6] rounded-xl font-semibold hover:bg-[#7c3aed] transition-all duration-300">
                Book Your Lab Now →
              </button>
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
