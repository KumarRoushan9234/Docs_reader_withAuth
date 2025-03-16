"use client";

import Link from "next/link";
import { FiSettings } from "react-icons/fi";
import { SiChatbot } from "react-icons/si";
import { MdOutlineSubject, MdQuiz, MdHistory, MdCode } from "react-icons/md";
import { FaTasks, FaBrain, FaInfoCircle } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="h-screen w-20 bg-white/40 backdrop-blur-md shadow-lg p-4 flex flex-col border-r border-gray-300">
      {/* Sidebar Links */}
      <nav className="space-y-4 flex-grow">
        <SidebarItem icon={<SiChatbot />} text="SmartDocs" link="/" />
        <SidebarItem icon={<MdOutlineSubject />} text="CourseHub" link="/coursehub" />
        <SidebarItem icon={<MdQuiz />} text="QuizMaster" link="/quizmaster" />
        <SidebarItem icon={<FaTasks />} text="StudyPlanner" link="/studyplanner" />
        <SidebarItem icon={<MdCode />} text="CodeLab" link="/codelab" />
        <SidebarItem icon={<MdHistory />} text="Activity Log" link="/activity" />
        <SidebarItem icon={<FaBrain />} text="AI Tutor" link="/aitutor" />
      </nav>

      {/* Divider Line */}
      <hr className="border-gray-300 my-4" />

      {/* Settings & About Section */}
      <div className="space-y-4">
        <SidebarItem icon={<FiSettings />} text="Settings" link="/settings" />
        <SidebarItem icon={<FaInfoCircle />} text="About" link="/about" />
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, link }) => (
  <Link href={link} className="relative flex items-center text-gray-700 hover:bg-gray-300/40 p-3 rounded-lg transition-all duration-200 group">
    <span className="text-2xl">{icon}</span>

    {/* Tooltip - Shows Text on Hover */}
    <span className="absolute left-full ml-3 px-3 py-1 text-sm bg-gray-900 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg whitespace-nowrap">
      {text}
    </span>
  </Link>
);

export default Sidebar;
