export default function StudyPlanner() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Study Planner</h1>
      <p className="text-gray-700 leading-relaxed">
        Organize your study schedule efficiently with AI-powered planning, task tracking, and smart reminders.
      </p>

      {/* Features Section */}
      <div className="mt-6 space-y-4">
        <Feature title="📅 Smart Scheduling" description="Plan your study sessions and get reminders for upcoming tasks." />
        <Feature title="✅ Task Tracker" description="Keep track of completed and pending tasks with progress visualization." />
        <Feature title="🎯 Focus Mode" description="Use the Pomodoro technique to stay productive while studying." />
        <Feature title="📊 Performance Insights" description="Analyze your study patterns and get personalized study recommendations." />
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
