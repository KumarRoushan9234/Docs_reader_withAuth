import { useState } from "react";
import FileNavbar from "@/components/file/FileNavabr";
import ChatBox from "@/components/ChatBox";

export default function TalkPage() {
  const [leftWidth, setLeftWidth] = useState(50); // Default 50% width

  const handleDrag = (event) => {
    event.preventDefault();
    document.body.style.cursor = "ew-resize";

    const startX = event.clientX;
    const startWidth = leftWidth;

    const onMouseMove = (moveEvent) => {
      const delta = ((moveEvent.clientX - startX) / window.innerWidth) * 100;
      const newWidth = Math.min(75, Math.max(25, startWidth + delta)); // Limit between 25% - 75%
      setLeftWidth(newWidth);
    };

    const onMouseUp = () => {
      document.body.style.cursor = "default";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Left - File Upload */}
      <div
        className="p-4 bg-white shadow-lg rounded-lg overflow-hidden"
        style={{ width: `${leftWidth}%` }}
      >
        <FileNavbar />
      </div>

      {/* Resizable Divider */}
      <div
        className="w-2 bg-gray-400 cursor-ew-resize hover:bg-gray-500 transition-all"
        onMouseDown={handleDrag}
      ></div>

      {/* Right - Chat */}
      <div
        className="p-4 bg-white shadow-lg rounded-lg flex flex-col"
        style={{ width: `${100 - leftWidth}%` }}
      >
        <div className="flex-1 overflow-auto bg-gray-100 p-4 border rounded-md">
          <ChatBox />
        </div>
      </div>
    </div>
  );
}
