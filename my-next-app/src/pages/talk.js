import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import FileNavbar from "@/components/file/FileNavbar";
import ChatBox from "@/components/ChatBox";

export default function TalkPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLeftHidden, setIsLeftHidden] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`flex ${isMobile ? "flex-col" : "flex-row"} h-screen bg-gray-100 relative`}>
      {/* Left Panel (Chat) */}
      <div
        className={`p-4 bg-white shadow-lg flex flex-col transition-all duration-300 overflow-hidden relative ${
          isLeftHidden ? "w-0 overflow-hidden" : "flex-[2]"
        }`}
      >
        {!isLeftHidden && (
          <div className="flex-1 bg-gray-100 p-4 border rounded-md overflow-y-auto scroll-smooth">
            <ChatBox />
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="bg-white shadow-lg flex flex-col flex-[3] overflow-auto relative transition-all">
        <div className="p-3">
          <FileNavbar isLeftHidden={isLeftHidden} setIsLeftHidden={setIsLeftHidden} />
        </div>
      </div>
    </div>
  );
}
