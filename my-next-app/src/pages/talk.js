import { useState, useEffect } from "react";
import { FaGripLinesVertical, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import FileNavbar from "@/components/file/FileNavabr";
import ChatBox from "@/components/ChatBox";

export default function TalkPage() {
  const [leftSize, setLeftSize] = useState(400); // Default width for desktop
  const [isMobile, setIsMobile] = useState(false);
  const [isLeftHidden, setIsLeftHidden] = useState(false); // Toggle state for left panel

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setIsMobile(screenWidth < 768); // Mobile layout for screens < 768px
      if (screenWidth < 768) setLeftSize(screenWidth * 0.5); // Adjust height for mobile
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDrag = (event) => {
    if (isLeftHidden) return; // Prevent resizing when hidden
    event.preventDefault();
    document.body.style.cursor = isMobile ? "ns-resize" : "ew-resize"; // Vertical for mobile, horizontal for desktop

    const startPoint = isMobile ? event.clientY : event.clientX;
    const startSize = leftSize;

    const onMouseMove = (moveEvent) => {
      const delta = isMobile
        ? moveEvent.clientY - startPoint // Vertical resize (Mobile)
        : moveEvent.clientX - startPoint; // Horizontal resize (Desktop)

      const newSize = Math.min(600, Math.max(250, startSize + delta)); // Limit between 250px - 600px
      setLeftSize(newSize);
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
    <div className={`flex ${isMobile ? "flex-col" : "flex-row"} h-screen bg-gray-100 relative`}>
      {/* Toggle Button for Left Panel */}
      <button
        className="absolute top-4 left-4 z-10 bg-gray-300 hover:bg-gray-500 text-white p-2 rounded-full shadow-md transition-all"
        onClick={() => setIsLeftHidden(!isLeftHidden)}
      >
        {isLeftHidden ? <FaChevronRight size={20} /> : <FaChevronLeft size={20} />}
      </button>

      {/* Left Panel (ChatBox) */}
      {!isLeftHidden && (
        <div
          className={`p-4 bg-white shadow-lg flex flex-col transition-all duration-300 ${
            isMobile ? "w-full" : "min-w-[250px] max-w-[600px]"
          }`}
          style={{ [isMobile ? "height" : "width"]: isMobile ? `${leftSize}px` : `${leftSize}px` }}
        >
          <div className={`flex-1 bg-gray-100 p-4 border rounded-md ${isMobile ? "" : "overflow-auto"}`}>
            <ChatBox />
          </div>
        </div>
      )}

      {/* Resizable Divider */}
      {!isLeftHidden && (
        <div
          className={`${
            isMobile ? "h-2 w-full cursor-ns-resize" : "w-1.5 h-full cursor-ew-resize"
          } bg-gray-300 hover:bg-gray-500 transition-all flex items-center justify-center`}
          onMouseDown={handleDrag}
        >
          <FaGripLinesVertical className="text-gray-600" />
        </div>
      )}

      {/* Right Panel (File Upload) */}
      <div
        className={`bg-white shadow-lg flex flex-col transition-all duration-300 ${
          isMobile ? "w-full" : "flex-1 min-w-[300px] max-w-[1000px]"
        }`}
      >
        <div className={`p-4 ${isMobile ? "" : "overflow-auto"}`}>
          <FileNavbar />
        </div>
      </div>
    </div>
  );
}
