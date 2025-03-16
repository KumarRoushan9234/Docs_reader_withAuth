import FeatureSlider from "@/components/codeLab/FeatureSlider";
import Terminal from "@/components/codeLab/Terminal";

export default function CodeLab() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">💻 Interactive Coding</h1>
      <p className="text-gray-700 leading-relaxed">
        Write and test code in multiple programming languages directly within the platform.
      </p>

      {/* Feature Slider - Always Present */}
      <FeatureSlider />

      {/* Bottom Section: Questions Tab & Terminal */}
      <div className="mt-8 flex gap-6">
        {/* Left: Questions Input */}
        <div className="flex-1 bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800">Questions & Topics</h2>
          <input type="text" placeholder="Enter topic..." className="w-full p-2 mt-2 border border-gray-300 rounded-lg" />
          <input type="text" placeholder="Enter question..." className="w-full p-2 mt-2 border border-gray-300 rounded-lg" />
          <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg">Submit</button>
        </div>

        {/* Right: Terminal Component */}
        <Terminal />
      </div>
    </div>
  );
}
