import FeatureSlider from "@/components/codeLab/FeatureSlider";
import Terminal from "@/components/codeLab/Terminal";

export default function CodeLab() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">CodeLab</h1>
      <p className="text-gray-700 leading-relaxed">
        CodeLab is your interactive coding environment, providing tools for debugging, practicing algorithms, and improving coding efficiency.
      </p>

      {/* Feature Slider */}
      <FeatureSlider />

      {/* Main Section: Questions (Left) & Terminal (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Question Input */}
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800">📝 Enter Your Question</h2>
          <label className="block mt-2 text-gray-700">Topic:</label>
          <input type="text" className="w-full p-2 border rounded-md" placeholder="e.g. Dynamic Programming" />

          <label className="block mt-2 text-gray-700">Question:</label>
          <textarea className="w-full p-2 border rounded-md" placeholder="Describe your question or problem"></textarea>

          <button className="mt-3 bg-blue-600 text-white px-3 py-1 rounded-md">Submit</button>
        </div>

        {/* Terminal Component */}
        <Terminal />
      </div>
    </div>
  );
}
