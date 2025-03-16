import FeatureSlider from "@/components/codeLab/FeatureSlider";

export default function Debugging() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">🐞 AI Debugging</h1>
      <p className="text-gray-700">
        Get real-time error detection and AI-powered debugging suggestions.
      </p>

      {/* Feature Slider - Always Present */}
      <FeatureSlider />
    </div>
  );
}
