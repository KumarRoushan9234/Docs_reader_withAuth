import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const features = [
  { title: "💻 Interactive Coding", description: "Write and test code in multiple programming languages.", link: "/codelab" },
  { title: "🐞 AI Debugging", description: "Get real-time error detection and AI-powered debugging suggestions.", link: "/codelab/debugging" },
  { title: "📚 Algorithm Practice", description: "Solve algorithmic challenges and get step-by-step solutions.", link: "/codelab/algorithm-practice" },
  { title: "🔍 Code Review Assistant", description: "Receive AI-generated feedback on code quality and optimization.", link: "/codelab/code-review" }
];

export default function FeatureSlider() {
  const sliderRef = useRef(null);
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const scrollToIndex = (idx) => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: idx * sliderRef.current.clientWidth,
        behavior: "smooth"
      });
    }
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % features.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  useEffect(() => {
    scrollToIndex(index);
  }, [index]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative w-full max-w-6xl mx-auto max-w-screen-lg mx-auto mt-6"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left Button */}
      <button
        onClick={prevSlide}
        className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 text-3xl z-10 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
      >
        <IoChevronBack />
      </button>

      {/* Slider Container */}
      <div ref={sliderRef} className="flex overflow-hidden w-full rounded-lg">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="min-w-full flex-shrink-0 p-8 bg-white shadow-lg rounded-lg cursor-pointer transition-all duration-500"
            onClick={() => router.push(feature.link)}
          >
            <h2 className="text-2xl font-semibold text-gray-800">{feature.title}</h2>
            <p className="text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Right Button */}
      <button
        onClick={nextSlide}
        className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700 text-3xl z-10 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
      >
        <IoChevronForward />
      </button>
    </div>
  );
}
