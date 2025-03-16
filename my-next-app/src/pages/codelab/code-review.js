import FeatureSlider from "@/components/codeLab/FeatureSlider";

export default function CodeReview() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">🔍 Code Review Assistant</h1>
      <p className="text-gray-700">
        Receive AI-generated feedback on code quality and optimization.
      </p>

      {/* Feature Slider - Always Present */}
      <FeatureSlider />
    </div>
  );
}
