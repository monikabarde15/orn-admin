"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

/* TYPES */
interface FlowItem {
  type: "video" | "pdf" | "quiz";
  data: any;
  chapterId: string;
}

export default function CoursePlayer() {

  const { id } = useParams();
  const [modules, setModules] = useState<any[]>([]);
  const [flow, setFlow] = useState<FlowItem[]>([]);
  const [index, setIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  const videoRef = useRef<HTMLVideoElement>(null);
  const current = flow[index];

  /* BUILD FLOW */
  const buildFlow = (modules:any[]) => {
    let arr: FlowItem[] = [];

    modules.forEach(m => {
      m.chapters.forEach((c:any) => {
        if (c.video)
          arr.push({ type: "video", data: c.video, chapterId: c.id });
        if (c.file)
          arr.push({ type: "pdf", data: c.file, chapterId: c.id });
        c.quizzes?.forEach((q:any) =>
          arr.push({ type: "quiz", data: q, chapterId: c.id })
        );
      });
    });

    return arr;
  };

  useEffect(() => {
    api.get(`/course/courses/${id}/`).then(res => {
      setModules(res.data.modules);
      setFlow(buildFlow(res.data.modules));
    });
  }, []);

  const progress = flow.length
    ? Math.round((index / flow.length) * 100)
    : 0;

  return (
    <div className="h-screen flex flex-col bg-[#f7f9fa]">

      {/* HEADER */}
      <div className="bg-black text-white px-6 py-3 flex justify-between">
        <h2 className="font-semibold">Course Player</h2>

        <div className="flex items-center gap-3 w-1/3">
          <div className="w-full bg-gray-700 h-1 rounded">
            <div
              className="bg-purple-500 h-1 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm">{progress}%</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <div className="w-[320px] bg-white border-r overflow-y-auto">

          <div className="p-4 font-semibold border-b">
            Course Content
          </div>

          {modules.map(m => (
            <div key={m.id}>

              <div className="px-4 py-3 bg-gray-50 font-medium text-sm">
                {m.title}
              </div>

              {m.chapters.map((c:any) => (
                <div key={c.id}>

                  <div className="px-4 py-2 text-xs text-gray-500">
                    {c.title}
                  </div>

                  {flow.map((f, i) =>
                    f.chapterId === c.id ? (
                      <div
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`px-6 py-2 text-sm cursor-pointer
                        ${
                          i === index
                            ? "bg-purple-100 text-purple-700 font-medium"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {f.type === "video" && "🎥 Video"}
                        {f.type === "pdf" && "📄 Notes"}
                        {f.type === "quiz" && "❓ Quiz"}
                      </div>
                    ) : null
                  )}

                </div>
              ))}
            </div>
          ))}

        </div>

        {/* MAIN */}
        <div className="flex-1 flex flex-col">

          {/* VIDEO */}
          <div className="bg-black flex justify-center">
            <div className="w-full max-w-5xl">
              {current?.type === "video" && (
                <video
                  ref={videoRef}
                  src={current.data}
                  controls
                  className="w-full h-[520px]"
                />
              )}
            </div>
          </div>

          {/* TABS */}
          <div className="bg-white border-b px-6 flex gap-6">
            {["overview", "notes", "quiz"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 text-sm font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-500"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {/* CONTENT */}
          <div className="p-6 overflow-y-auto">

            {activeTab === "overview" && (
              <div>
                <h2 className="text-xl font-semibold">
                  Lecture Overview
                </h2>
              </div>
            )}

            {activeTab === "notes" && current?.type === "pdf" && (
              <iframe
                src={current.data}
                className="w-full h-[500px]"
              />
            )}

            {activeTab === "quiz" && current?.type === "quiz" && (
              <div className="max-w-2xl">
                <h2 className="mb-4 font-semibold">
                  {current.data.question}
                </h2>

                {current.data.options.map((o:any) => (
                  <div className="border p-3 mb-2 rounded hover:bg-gray-50 cursor-pointer">
                    {o.text}
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}