// import Navbar from "../components/Layouts/WebLayout/Navbar";
// import Hero from "../components/Layouts/WebLayout/Hero";
// import Services from "../../components/Layouts/WebLayout/Services";
// import Portfolio from "../../components/Layouts/WebLayout/Portfolio";
// import Process from "../../components/Layouts/WebLayout/Process";
// import Testimonials from "../../components/Layouts/WebLayout/Testimonials";
// import Contact from "../../components/Layouts/WebLayout/Contact";
// import Footer from "../../components/Layouts/WebLayout/Footer";
import { ArrowRight } from "lucide-react";
import { Button } from "../components/Layouts/WebLayout/ui/button";
import { Card } from "../components/Layouts/WebLayout/ui/card";
import heroTeam from "@/assets/hero-team.jpg";
const Home = () => {
  const stats = [
    { value: "93%", label: "Client Retention" },
    { value: "250+", label: "Projects Completed" },
    { value: "40M+", label: "Audience Reached" },
  ];

  return (
    <>
    <section id="home" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-float opacity-20" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-float opacity-20" style={{ animationDelay: "2s" }} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
                Premium Marketing Agency
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              We Craft{" "}
              <span className="text-transparent bg-clip-text bg-gradient-purple-cyan">
                Digital
              </span>
              <br />
              Success Stories
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-xl">
              Transform your brand with our full-service marketing expertise. From social media to comprehensive campaigns, we deliver measurable results that outperform the competition.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="group">
                Start Your Campaign
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline">
                View Our Work
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-purple-cyan">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Image Cards */}
          <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative">
              <img
                src={heroTeam}
                alt="Creative marketing team collaborating"
                className="rounded-2xl shadow-2xl shadow-primary/20 w-full"
              />
              
              {/* Floating Stats Cards */}
              <Card className="absolute top-8 -left-4 p-4 bg-card/90 backdrop-blur-lg border-primary/20 shadow-xl animate-float">
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-purple-cyan">
                  5x ROI
                </div>
                <div className="text-sm text-muted-foreground">Average Client Return</div>
              </Card>
              
              <Card className="absolute bottom-8 -right-4 p-4 bg-card/90 backdrop-blur-lg border-secondary/20 shadow-xl animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-secondary text-lg">★</span>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">Industry Recognition</div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
       {/* <Navbar /> */}
      {/* <Hero /> */}
      {/*<Services />
      <Portfolio />
      <Process />
      <Testimonials />
      <Contact />
      <Footer /> */}
    </>
  );
};

export default Home;
