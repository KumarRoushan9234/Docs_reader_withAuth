import { useState, useEffect } from "react";
import { FaGripLinesVertical, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import FileNavbar from "@/components/file/FileNavbar";
import ChatBox from "@/components/ChatBox";

export default function TalkPage() {
  const [leftSize, setLeftSize] = useState(400);
  const [isMobile, setIsMobile] = useState(false);
  const [isLeftHidden, setIsLeftHidden] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setIsMobile(screenWidth < 768);
      if (screenWidth < 768) setLeftSize(Math.max(500, screenWidth * 0.5)); // Ensure min width
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDrag = (event) => {
    if (isLeftHidden) return;
    event.preventDefault();
    document.body.style.cursor = isMobile ? "ns-resize" : "ew-resize";

    const startPoint = isMobile ? event.clientY : event.clientX;
    const startSize = leftSize;

    const onMouseMove = (moveEvent) => {
      const delta = isMobile
        ? moveEvent.clientY - startPoint
        : moveEvent.clientX - startPoint;
      const newSize = Math.min(600, Math.max(250, startSize + delta)); // Min 250px, Max 600px
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
      {/* Left Panel (Chat) */}
      {!isLeftHidden && (
        <div
          className="p-4 bg-white shadow-lg flex flex-col transition-all duration-300 overflow-hidden min-w-[250px] max-w-[600px] relative" // Min & Max Width Fixed
          style={{ width: `${leftSize}px` }}
        >
          {/* Toggle Button inside Left Panel (Right Edge) */}
          <button
            className="absolute -right-5 top-1/2 transform -translate-y-1/2 bg-gray-300 hover:bg-gray-500 text-white p-2 rounded-full shadow-md transition-all"
            onClick={() => setIsLeftHidden(true)}
          >
            <FaChevronLeft size={20} />
          </button>

          <div className="flex-1 bg-gray-100 p-4 border rounded-md overflow-y-auto scroll-smooth">
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

      {/* Right Panel */}
      <div className="bg-white shadow-lg flex flex-col flex-1 min-w-[350px] overflow-auto relative"> {/* Min width fixed */}
        {/* Toggle Button when Left Panel is Hidden */}
        {isLeftHidden && (
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-300 hover:bg-gray-500 text-white p-2 rounded-full shadow-md transition-all z-10"
            onClick={() => setIsLeftHidden(false)}
          >
            <FaChevronRight size={20} />
          </button>
        )}

        <div className="p-3">
          <FileNavbar />
        </div>
      </div>
    </div>
  );
}




{/* <SidebarItem icon={<MdLibraryBooks />} text="ResourceHub" link="/resourcehub" /> */}

{/* <SidebarItem icon={<FaChartBar />} text="PerformanceTracker" link="/performancetracker" /> */}
