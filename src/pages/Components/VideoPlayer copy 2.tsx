import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ChevronDown,
  ChevronUp,
  X,
  Search,
  PlayCircle,
  CheckCircle,
  Menu,
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

interface Section {
  id: string;
  title: string;
  duration: string;
  completedCount: number;
  totalCount: number;
  lessons: Lesson[];
}

const VideoPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(["1"]);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const sections: Section[] = [
    {
      id: "1",
      title: "Section 1: Introduction",
      duration: "3min",
      completedCount: 0,
      totalCount: 2,
      lessons: [
        {
          id: "1-1",
          title: "ChatGPT Prompt Engineering ( Free Course )",
          duration: "2min",
          completed: false,
        },
        {
          id: "1-2",
          title: "What we will cover?",
          duration: "1min",
          completed: false,
        },
      ],
    },
    {
      id: "2",
      title: "Section 2: Prompt Engineering Terms",
      duration: "7min",
      completedCount: 0,
      totalCount: 4,
      lessons: [
        {
          id: "2-1",
          title: "Understanding Prompts",
          duration: "2min",
          completed: false,
        },
        {
          id: "2-2",
          title: "Key Terminology",
          duration: "2min",
          completed: false,
        },
        {
          id: "2-3",
          title: "Best Practices",
          duration: "2min",
          completed: false,
        },
        {
          id: "2-4",
          title: "Common Mistakes",
          duration: "1min",
          completed: false,
        },
      ],
    },
    {
      id: "3",
      title: "Section 3: Prompt Engineering Concepts",
      duration: "6min",
      completedCount: 0,
      totalCount: 3,
      lessons: [
        {
          id: "3-1",
          title: "Core Concepts",
          duration: "2min",
          completed: false,
        },
        {
          id: "3-2",
          title: "Advanced Techniques",
          duration: "2min",
          completed: false,
        },
        {
          id: "3-3",
          title: "Practical Application",
          duration: "2min",
          completed: false,
        },
      ],
    },
    {
      id: "4",
      title: "Section 4: Practical Examples Cases",
      duration: "18min",
      completedCount: 0,
      totalCount: 5,
      lessons: [
        {
          id: "4-1",
          title: "Case Study 1",
          duration: "4min",
          completed: false,
        },
        {
          id: "4-2",
          title: "Case Study 2",
          duration: "4min",
          completed: false,
        },
        {
          id: "4-3",
          title: "Case Study 3",
          duration: "3min",
          completed: false,
        },
        {
          id: "4-4",
          title: "Case Study 4",
          duration: "4min",
          completed: false,
        },
        {
          id: "4-5",
          title: "Case Study 5",
          duration: "3min",
          completed: false,
        },
      ],
    },
    {
      id: "5",
      title: "Section 5: Important Terms & Factors",
      duration: "22min",
      completedCount: 0,
      totalCount: 4,
      lessons: [
        {
          id: "5-1",
          title: "Key Terms Overview",
          duration: "6min",
          completed: false,
        },
        {
          id: "5-2",
          title: "Critical Factors",
          duration: "6min",
          completed: false,
        },
        {
          id: "5-3",
          title: "Success Metrics",
          duration: "5min",
          completed: false,
        },
        {
          id: "5-4",
          title: "Summary & Next Steps",
          duration: "5min",
          completed: false,
        },
      ],
    },
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video Player */}
          <div
            ref={videoContainerRef}
            className="relative bg-slate-900 aspect-video lg:h-[60vh]"
          >
            {/* Video Element */}
            <video
              ref={videoRef}
              className="w-full h-full"
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlayPause}
                  className="text-white hover:text-purple-400 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>

                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                <div
                  className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <div
                    className="h-full bg-purple-500 transition-all"
                    style={{
                      width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                    }}
                  ></div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-purple-400 transition-colors"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-6 h-6" />
                    ) : (
                      <Volume2 className="w-6 h-6" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${
                        volume * 100
                      }%, #374151 ${volume * 100}%, #374151 100%)`,
                    }}
                  />
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-purple-400 transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize className="w-6 h-6" />
                  ) : (
                    <Maximize className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Course Info & Tabs */}
          <div className="flex-1 overflow-y-auto bg-white p-6">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-gray-200 mb-6">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Search className="w-5 h-5" />
              </button>
              {["Overview", "Notes", "Announcements", "Reviews", "Learning tools"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`px-4 py-3 font-medium transition-colors relative ${
                      activeTab === tab.toLowerCase()
                        ? "text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                    {activeTab === tab.toLowerCase() && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                    )}
                  </button>
                )
              )}
            </div>

            {/* Course Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Craft Captivating AI prompts: Free Prompt Engineering Course with
              Real-Life examples!
            </h1>

            {/* Course Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-yellow-600 font-bold text-lg">4.1</span>
                <span className="text-yellow-500">★</span>
                <span className="text-gray-600">3,598 ratings</span>
              </div>
              <div className="text-gray-600">
                <span className="font-semibold">48,568</span> Students
              </div>
              <div className="text-gray-600">
                <span className="font-semibold">1 hour</span> Total
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Toggle Button (when closed) */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 right-4 z-50 bg-purple-500 text-white p-3 rounded-lg shadow-lg hover:bg-purple-600 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        {/* Sidebar - Course Content */}
        {sidebarOpen && (
          <div className="lg:w-[400px] bg-white border-l border-gray-200 flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Course content</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sections List */}
            <div className="flex-1 overflow-y-auto">
              {sections.map((section) => (
                <div key={section.id} className="border-b border-gray-200">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-left flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {section.completedCount} / {section.totalCount} |{" "}
                        {section.duration}
                      </p>
                    </div>
                    {expandedSections.includes(section.id) ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {/* Lessons List */}
                  {expandedSections.includes(section.id) && (
                    <div className="bg-gray-50">
                      {section.lessons.map((lesson, idx) => (
                        <button
                          key={lesson.id}
                          className={`w-full p-4 pl-8 flex items-center gap-3 hover:bg-purple-50 transition-colors border-l-2 ${
                            idx === 0 && section.id === "1"
                              ? "border-l-purple-500 bg-purple-50"
                              : "border-l-transparent"
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {lesson.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <div className="w-5 h-5 rounded border-2 border-gray-300"></div>
                            )}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-gray-900">
                              {idx + 1}. {lesson.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <PlayCircle className="w-4 h-4" />
                            <span className="text-xs">{lesson.duration}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;