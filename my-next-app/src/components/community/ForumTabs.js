import { useState } from "react";
import PublicForum from "./forum/PublicForum";
import OfficialForum from "./forum/OfficialForum";
import DSAForum from "./forum/DSAForum";

const categories = ["Public", "Official", "DSA"];

export default function ForumTabs() {
  const [activeTab, setActiveTab] = useState("Public");

  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
      {/* Full-width Tabs */}
      <div className="flex w-full border-b border-gray-300 bg-gray-100">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`flex-1 py-4 text-lg text-center font-semibold transition-all duration-300 
              ${activeTab === category ? "bg-blue-500 text-white shadow-md" : "text-gray-700 hover:bg-gray-200"}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Full-width Chatbox */}
      <div className="p-6 bg-gray-50 w-full">
        {activeTab === "Public" && <PublicForum />}
        {activeTab === "Official" && <OfficialForum />}
        {activeTab === "DSA" && <DSAForum />}
      </div>
    </div>
  );
}
