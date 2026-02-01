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

/* ================= TYPES ================= */
interface QuizOption {
  id: number;
  text: string;
  is_correct: boolean;
}

interface Quiz {
  id: number;
  question: string;
  options: QuizOption[];
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  video?: string | null;
  quizzes?: Quiz[];
}

interface Section {
  id: string;
  title: string;
  duration: string;
  completedCount: number;
  totalCount: number;
  lessons: Lesson[];
}

/* ================= COMPONENT ================= */
const VideoPlayer: React.FC = () => {
  const [course, setCourse] = useState<any>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [currentMedia, setCurrentMedia] = useState<{
    type: "video" | "image";
    src: string;
  } | null>(null);

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  /* ================= API ================= */
  useEffect(() => {
    fetch("https://dev.backend.onrequestlab.com/course/courses/26/")
      .then((res) => res.json())
      .then((data) => {
        setCourse(data);

        const apiSections: Section[] =
          data.modules?.map((module: any) => ({
            id: module.id.toString(),
            title: module.title,
            duration: `${module.chapters.length} lessons`,
            completedCount: 0,
            totalCount: module.chapters.length,
            lessons: module.chapters.map((ch: any) => ({
              id: ch.id.toString(),
              title: ch.title,
              duration: "—",
              completed: false,
              video: ch.video,
              quizzes: ch.quizzes || [],
            })),
          })) || [];

        setSections(apiSections);
        setExpandedSections(apiSections.map((s) => s.id));

        const firstLesson = apiSections?.[0]?.lessons?.[0];
        if (firstLesson) {
          handleLessonSelect(firstLesson, data);
        }
      })
      .catch(console.error);
  }, []);

  /* ================= VIDEO EVENTS ================= */
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
  }, [currentMedia]);

  /* ================= HANDLERS ================= */
  const handleLessonSelect = (lesson: Lesson, courseData = course) => {
    setActiveLesson(lesson);

    if (lesson.video) {
      setCurrentMedia({
        type: "video",
        src: "https://" + lesson.video,
      });
    } else if (courseData?.thumbnail?.image) {
      setCurrentMedia({
        type: "image",
        src: "https://" + courseData.thumbnail.image,
      });
    }
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    isPlaying ? videoRef.current.pause() : videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const v = parseFloat(e.target.value);
    videoRef.current.volume = v;
    setVolume(v);
    setIsMuted(v === 0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    videoRef.current.currentTime =
      ((e.clientX - rect.left) / rect.width) * duration;
  };

  const formatTime = (t: number) =>
    `${Math.floor(t / 60)}:${Math.floor(t % 60)
      .toString()
      .padStart(2, "0")}`;

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex h-screen">
        {/* ================= MAIN ================= */}
        <div className="flex-1 flex flex-col">
          {/* VIDEO / IMAGE */}
          <div
            ref={videoContainerRef}
            className="relative bg-black aspect-video"
          >
            {currentMedia?.type === "video" ? (
              <video
                ref={videoRef}
                src={currentMedia.src}
                className="w-full h-full"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            ) : (
              <img
                src={currentMedia?.src}
                className="w-full h-full object-cover"
              />
            )}

            {/* CONTROLS */}
            {currentMedia?.type === "video" && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/80 text-white">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlayPause}>
                    {isPlaying ? <Pause /> : <Play />}
                  </button>
                  <span className="text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                  <div
                    className="flex-1 h-1 bg-gray-600 cursor-pointer"
                    onClick={handleProgressClick}
                  >
                    <div
                      className="h-full bg-purple-500"
                      style={{
                        width: `${(currentTime / duration) * 100 || 0}%`,
                      }}
                    />
                  </div>
                  <button onClick={toggleMute}>
                    {isMuted ? <VolumeX /> : <Volume2 />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                  />
                  <button onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize /> : <Maximize />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* COURSE INFO */}
          <div className="bg-white p-6">
            <h1 className="text-2xl font-bold">{course?.title}</h1>
            <p className="text-gray-600 mt-2">{course?.description}</p>
          </div>

          {/* ================= QUIZ ================= */}
          {activeLesson?.quizzes && activeLesson.quizzes.length > 0 && (
            <div className="bg-white p-6 border-t">
              <h2 className="text-xl font-bold mb-4">Quiz</h2>

              {activeLesson.quizzes.map((quiz, qIndex) => (
                <div key={quiz.id} className="mb-6">
                  <p className="font-semibold mb-3">
                    Q{qIndex + 1}. {quiz.question}
                  </p>

                  <div className="space-y-2">
                    {quiz.options.map((opt) => (
                      <label
                        key={opt.id}
                        className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-purple-50"
                      >
                        <input type="radio" name={`quiz-${quiz.id}`} />
                        <span>{opt.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= SIDEBAR ================= */}
        {sidebarOpen && (
          <div className="w-[380px] bg-white border-l">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold">Course content</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X />
              </button>
            </div>

            <div className="overflow-y-auto">
              {sections.map((section) => (
                <div key={section.id} className="border-b">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-4 flex justify-between"
                  >
                    <div>
                      <h3 className="font-semibold">{section.title}</h3>
                      <p className="text-sm text-gray-500">
                        {section.totalCount} lessons
                      </p>
                    </div>
                    {expandedSections.includes(section.id) ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </button>

                  {expandedSections.includes(section.id) &&
                    section.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonSelect(lesson)}
                        className="w-full pl-8 p-3 flex items-center gap-2 hover:bg-purple-100"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span className="text-sm">{lesson.title}</span>

                        {lesson.quizzes && lesson.quizzes.length > 0 && (
                          <span className="ml-auto text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                            Quiz
                          </span>
                        )}
                      </button>
                    ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 right-4 bg-purple-600 text-white p-3 rounded"
          >
            <Menu />
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
