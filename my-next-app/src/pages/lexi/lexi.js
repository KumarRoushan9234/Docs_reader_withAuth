"use client";

import { useState } from "react";
import FileNavbar from "@/components/lexi/FileNavbar";
import ChatBox from "@/components/lexi/ChatBox";

export default function Lexi() {
  const [isLeftHidden, setIsLeftHidden] = useState(false);

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden hide-scrollbar">
      {/* Left Panel (Chat Section) */}
      <div
        className={` hide-scrollbar transition-all duration-300 ${
          isLeftHidden ? "w-0 hidden" : "w-2/5"
        }`}
      >
        {!isLeftHidden && (
          <div className="h-full flex flex-col bg-white shadow-md">
            <div className="flex-1 overflow-auto">
              <ChatBox />
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      {!isLeftHidden && <div className="w-[2px] bg-gray-300 h-full"></div>}

      {/* Right Panel (Main Content) */}
      <div className="flex-1 h-full flex flex-col bg-white overflow-hidden">
        <FileNavbar isLeftHidden={isLeftHidden} setIsLeftHidden={setIsLeftHidden} />
      </div>
    </div>
  );
}
