import { useRef } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/coursehub/Navbar";
import CourseCard from "@/components/coursehub/CourseCard";
import InfoSection from "@/components/coursehub/InfoSection";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

export default function Home() {
  const sliderRef = useRef(null);
  const router = useRouter();

  const courses = [
    { id: 1, name: "DSA", img: "/coursehub/dsa.png" },
    { id: 2, name: "DBMS", img: "/coursehub/dbms.png" },
    { id: 3, name: "Computer Network", img: "/coursehub/cn.png" },
    { id: 4, name: "OS", img: "/coursehub/os1.png" },
    { id: 5, name: "Python", img: "/coursehub/python.png" },
    { id: 6, name: "MLOps", img: "/coursehub/ml2.png" },
    { id: 7, name: "Big-Data", img: "/coursehub/bigdata.png" },
  ];

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        {/* Navbar */}
        <Navbar />

        {/* Scrollable Course Section */}
        <div className="relative mt-6 p-4 border border-gray-300 rounded-lg bg-white shadow-md">
          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-2">
            <button
              onClick={scrollLeft}
              className="bg-gray-800 text-white px-4 py-3 rounded-md hover:bg-gray-600 transition"
            >
              <FaArrowLeft className="text-2xl" />
            </button>
            <button
              onClick={scrollRight}
              className="bg-gray-800 text-white px-4 py-3 rounded-md hover:bg-gray-600 transition"
            >
              <FaArrowRight className="text-2xl" />
            </button>
          </div>

          {/* Course Cards */}
          <div
            ref={sliderRef}
            className="flex space-x-6 overflow-x-auto p-2 mt-10 snap-x scroll-smooth scrollbar-hide"
            style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {courses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index + 1} />
            ))}
          </div>
        </div>

        {/* Info Section */}
        <InfoSection />
      </div>
    </div>
  );
}
