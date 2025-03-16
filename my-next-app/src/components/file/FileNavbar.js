"use client";

import { useState } from "react";
import { FaLayerGroup, FaGraduationCap, FaFileAlt, FaStickyNote, FaUpload, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import useUserStore from "@/store/userStore";
import FileUpload from "@/components/file/FileUpload";

export default function FileNavbar({ isLeftHidden, setIsLeftHidden }) {
  const [activeTab, setActiveTab] = useState("summary");
  const { extractedDocs, summary, keyPoints, flashcards, study_guide } = useUserStore();

  return (
    <div className="p-3 bg-white text-black rounded-lg shadow-lg h-full flex flex-col">
      {/* Tab Navigation with Toggle Button */}
      <div className="flex items-center bg-gray-200 rounded-lg p-1">
        {/* Toggle Button */}
        <button
          className="mr-2 bg-gray-300 hover:bg-gray-500 text-white p-2 rounded-full shadow-md transition-all"
          onClick={() => setIsLeftHidden(!isLeftHidden)}
        >
          {isLeftHidden ? <FaChevronRight size={20} /> : <FaChevronLeft size={20} />}
        </button>

        {/* Tabs */}
        <div className="flex overflow-x-auto">
          {[
            { key: "fileupload", label: "Upload", icon: <FaUpload /> },
            { key: "flashcards", label: "Flashcards", icon: <FaLayerGroup /> },
            { key: "studyguide", label: "Study Guide", icon: <FaGraduationCap /> },
            { key: "summary", label: "Summary", icon: <FaFileAlt /> },
            { key: "notes", label: "Notes", icon: <FaStickyNote /> },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all 
                ${activeTab === key ? "bg-black text-white" : "text-gray-600 hover:bg-gray-300"}
              `}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Content Sections (Fixed Height) */}
      <div className="mt-3 flex-1 overflow-y-auto p-4 border rounded-md bg-gray-100 h-[calc(100%-3rem)]">
        {activeTab === "fileupload" && <FileUpload />}
        {activeTab === "flashcards" && <Flashcards flashcards={flashcards} />}
        {activeTab === "studyguide" && <StudyGuide study_guide={study_guide} />}
        {activeTab === "summary" && <Summary extractedDocs={extractedDocs} summary={summary} keyPoints={keyPoints} />}
        {activeTab === "notes" && <Notes />}
      </div>
    </div>
  );
}

/* Individual Sections */
function Flashcards({ flashcards }) {
  return (
    <div className="p-4 bg-white rounded-lg h-full overflow-y-auto">
      <h2 className="text-lg font-bold mb-2">📚 Flashcards</h2>
      <p className="text-gray-700">{flashcards || "No flashcards available."}</p>
    </div>
  );
}

function StudyGuide({ study_guide }) {
  return (
    <div className="p-4 bg-white rounded-lg h-full overflow-y-auto">
      <h2 className="text-lg font-bold mb-2">🎓 Study Guide</h2>
      <p className="text-gray-700">{study_guide || "No study guide available."}</p>
    </div>
  );
}

function Summary({ extractedDocs, summary, keyPoints }) {
  return (
    <div className="p-4 bg-white rounded-lg h-full overflow-y-auto">
      <h2 className="text-lg font-bold mb-2">📖 Summary</h2>
      <p className="text-gray-700">{summary || "No summary available."}</p>
      <h3 className="mt-4 text-md font-semibold">Key Points:</h3>
      <ul className="list-disc pl-5 text-gray-600">
        {keyPoints.length
          ? keyPoints.map((point, idx) => <li key={idx}>{point}</li>)
          : "No key points available."}
      </ul>
    </div>
  );
}

function Notes() {
  return (
    <div className="p-4 bg-white rounded-lg h-full overflow-y-auto">
      <h2 className="text-lg font-bold mb-2">📝 Notes</h2>
      <p className="text-gray-500">No notes available.</p>
    </div>
  );
}
