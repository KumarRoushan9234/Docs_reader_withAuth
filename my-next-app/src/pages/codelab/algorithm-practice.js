import FeatureSlider from "@/components/codeLab/FeatureSlider";

export default function AlgorithmPractice() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">📚 Algorithm Practice</h1>
      <p className="text-gray-700">
        Solve algorithmic challenges and get step-by-step solutions.
      </p>

      {/* Feature Slider - Always Present */}
      <FeatureSlider />
    </div>
  );
}
