"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiSettings } from "react-icons/fi";
import { RiUserCommunityFill } from "react-icons/ri";
import { MdOutlineSubject, MdQuiz, MdHistory, MdCode } from "react-icons/md";
import { FaTasks, FaBrain, FaInfoCircle } from "react-icons/fa";

const Sidebar = () => {
  const pathname = usePathname(); // Get the current active path

  return (
    <div className="h-screen w-20 bg-white/40 backdrop-blur-md shadow-lg p-4 flex flex-col border-r border-gray-300">
      {/* Sidebar Links */}
      <nav className="space-y-2">
        <SidebarItem icon={<FaBrain />} text="Lexi" link="/" active={pathname === "/"} />
        <SidebarItem icon={<MdOutlineSubject />} text="CourseHub" link="/coursehub" active={pathname === "/coursehub"} />
        <SidebarItem icon={<MdQuiz />} text="QuizVault" link="/quiz" active={pathname === "/quiz"} />
        
        <SidebarItem icon={<MdCode />} text="CodeLab" link="/codelab" active={pathname === "/codelab"} />
        
        {/* <SidebarItem icon={<FaBrain />} text="AI Tutor" link="/lexi" active={pathname === "/aitutor"} /> */}

        <SidebarItem icon={<FaTasks />} text="StudyPlanner" link="/studyplanner" active={pathname === "/studyplanner"} />

        <SidebarItem icon={<RiUserCommunityFill />} text="Community" link="/community" active={pathname === "/community"} />

        {/* Divider Line */}
        <hr className="border-gray-300 my-3" />

        {/* Settings & About Section */}
        <SidebarItem icon={<FiSettings />} text="Settings" link="/activity" active={pathname === "/activity"} />
        <SidebarItem icon={<FaInfoCircle />} text="About" link="/about" active={pathname === "/about"} />
      </nav>
    </div>
  );
};

const SidebarItem = ({ icon, text, link, active }) => (
  <Link
    href={link}
    className={`relative flex items-center text-gray-700 p-2 rounded-lg transition-all duration-200 group
      ${active ? "bg-gray-500 text-white font-semibold" : "hover:bg-gray-300/40"}
    `}
  >
    {/* Icon */}
    <span className="text-xl">{icon}</span>

    {/* Tooltip - Now inside Link to make it clickable */}
    <span className="absolute left-full ml-3 px-3 py-1 text-sm bg-gray-700 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg whitespace-nowrap pointer-events-none">
      {text}
    </span>

    {/* Active Indicator */}
    {active && <span className="absolute left-0 h-full w-1 bg-gray-500 rounded-r-lg"></span>}
  </Link>
);


export default Sidebar;
