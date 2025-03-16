import { useState } from "react";
import { FaComments } from "react-icons/fa";

// Forum categories
const categories = ["Public", "Official", "DSA", "CN", "OS"];

// Sample messages for each category
const forumMessages = {
  Public: [
    { user: "John", text: "Hey everyone! What's new?", time: "2 mins ago" },
    { user: "Sarah", text: "Looking for resources on React!", time: "10 mins ago" },
  ],
  Official: [
    { user: "Admin", text: "Welcome to the official community chat!", time: "5 mins ago" },
    { user: "User1", text: "When is the next meetup?", time: "15 mins ago" },
  ],
  DSA: [
    { user: "CoderX", text: "Best way to optimize Dijkstra's algorithm?", time: "3 mins ago" },
    { user: "Dev101", text: "Any practice platforms for DP?", time: "8 mins ago" },
  ],
  CN: [
    { user: "Alice", text: "What are the best resources for Computer Networks?", time: "10 mins ago" },
    { user: "Bob", text: "How to debug network issues?", time: "20 mins ago" },
  ],
  OS: [
    { user: "TechGeek", text: "Best OS for penetration testing?", time: "12 mins ago" },
    { user: "LinuxFan", text: "Which Linux distro is best for beginners?", time: "25 mins ago" },
  ],
};

export default function ForumTabs() {
  const [activeTab, setActiveTab] = useState("Public");

  return (
    <div className="w-full">
      {/* Scrollable Tabs */}
      <div className="overflow-x-auto flex space-x-4 p-4 bg-gray-100 rounded-lg">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === category ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Chatbox for Selected Forum */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
          <FaComments className="text-blue-500" /> {activeTab} Forum Chat
        </h2>
        <div className="mt-3 space-y-3">
          {forumMessages[activeTab].map((msg, index) => (
            <div key={index} className="bg-gray-100 p-3 rounded-lg shadow-sm">
              <p className="font-semibold text-gray-800">{msg.user}</p>
              <p className="text-gray-600">{msg.text}</p>
              <p className="text-xs text-gray-400">{msg.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
