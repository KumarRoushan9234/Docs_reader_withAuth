export default function CodeLab() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">CodeLab</h1>
      <p className="text-gray-700 leading-relaxed">
        CodeLab is your interactive coding environment, providing tools for debugging, practicing algorithms, and improving coding efficiency.
      </p>

      {/* Features Section */}
      <div className="mt-6 space-y-4">
        <Feature title="💻 Interactive Coding" description="Write and test code in multiple programming languages directly within the platform." />
        <Feature title="🐞 AI Debugging" description="Get real-time error detection and AI-powered debugging suggestions." />
        <Feature title="📚 Algorithm Practice" description="Solve algorithmic challenges and get step-by-step solutions." />
        <Feature title="🔍 Code Review Assistant" description="Receive AI-generated feedback on code quality and optimization." />
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
