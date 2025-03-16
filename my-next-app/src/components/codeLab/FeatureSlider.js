import { useRef } from "react";

const features = [
  { title: "💻 Interactive Coding", description: "Write and test code in multiple programming languages directly within the platform." },
  { title: "🐞 AI Debugging", description: "Get real-time error detection and AI-powered debugging suggestions." },
  { title: "📚 Algorithm Practice", description: "Solve algorithmic challenges and get step-by-step solutions." },
  { title: "🔍 Code Review Assistant", description: "Receive AI-generated feedback on code quality and optimization." }
];

export default function FeatureSlider() {
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="relative mt-6">
      <button onClick={scrollLeft} className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-300 rounded-full shadow-md">
        ◀
      </button>
      
      <div ref={sliderRef} className="flex space-x-4 overflow-x-scroll hide-scrollbar p-4">
        {features.map((feature, index) => (
          <div key={index} className="min-w-[280px] p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800">{feature.title}</h2>
            <p className="text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>

      <button onClick={scrollRight} className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-300 rounded-full shadow-md">
        ▶
      </button>
    </div>
  );
}
