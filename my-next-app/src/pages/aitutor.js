export default function AITutor() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">AI Tutor</h1>
      <p className="text-gray-700 leading-relaxed">
        Your personal AI-powered tutor, helping you understand complex topics, generate summaries, and practice questions.
      </p>

      {/* Features Section */}
      <div className="mt-6 space-y-4">
        <Feature title="📖 Concept Explanation" description="Get easy-to-understand explanations for any topic." />
        <Feature title="📝 Summary Generator" description="Summarize large text or documents into concise key points." />
        <Feature title="🎯 Adaptive Quizzes" description="Take personalized quizzes based on your weak areas." />
        <Feature title="💡 AI Study Companion" description="Chat with the AI to discuss doubts and gain clarity on tough concepts." />
      </div>
    </div>
  );
}

const Feature = ({ title, description }) => (
  <div className="p-4 bg-white shadow-md rounded-lg">
    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    <p className="text-gray-700">{description}</p>
  </div>
);
