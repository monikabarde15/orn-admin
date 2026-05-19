import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // FETCH ALL COURSES
  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/course/getAllCourses"
      );

      console.log(response.data);

      setCourses(response?.data?.data || []);
    } catch (error) {
      console.log("COURSE FETCH ERROR => ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // LOADING
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading Courses...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADING */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
        <p className="text-gray-500 mt-2">
          Explore all available courses
        </p>
      </div>

      {/* NO COURSES */}
      {courses.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No Courses Found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
            >
              {/* THUMBNAIL / VIDEO */}
              <div className="relative w-full h-56 bg-black">
                {course?.introVideo || course?.videoUrl ? (
                  <video
                    src={course?.introVideo || course?.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={course?.thumbnail}
                    alt={course?.courseName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* CONTENT */}
              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800 line-clamp-1">
                  {course?.courseName}
                </h2>

                <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                  {course?.courseDescription}
                </p>

                {/* INSTRUCTOR */}
                <div className="mt-3 text-sm text-gray-600">
                  Instructor :{" "}
                  <span className="font-medium">
                    {course?.instructor?.firstName}{" "}
                    {course?.instructor?.lastName}
                  </span>
                </div>

                {/* PRICE */}
                <div className="mt-4 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-blue-600">
                    ₹ {course?.price}
                  </h3>

                  <button
                    onClick={() =>
                      navigate(`/course/${course._id}`)
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;