"use client";

import { useState } from "react";
import Link from "next/link";
import { FiUsers, FiActivity, FiSettings } from "react-icons/fi";
import { MdOutlineQrCodeScanner, MdOutlineBusiness } from "react-icons/md";
import { BsLayoutSidebarInsetReverse, BsLayoutSidebarInset } from "react-icons/bs";
import { IoLogOut } from "react-icons/io5";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`h-full ${
        isOpen ? "w-64" : "w-20"
      } bg-white/40 backdrop-blur-md shadow-lg p-4 transition-all duration-300 flex flex-col justify-between relative border-r border-gray-300`}
    >
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-4 bg-gray-300 text-gray-700 p-2 rounded-full shadow-md"
      >
        {isOpen ? <BsLayoutSidebarInset /> : <BsLayoutSidebarInsetReverse />}
      </button>

      {/* Sidebar Links */}
      <nav className="space-y-2">
        <SidebarItem isOpen={isOpen} icon={<MdOutlineBusiness />} text="My Business" link="/" />
        <SidebarItem isOpen={isOpen} icon={<MdOutlineQrCodeScanner />} text="Generate QR" link="/generate-qr" />
        <SidebarItem isOpen={isOpen} icon={<FiUsers />} text="Check-In Requests" link="/request" />
        <SidebarItem isOpen={isOpen} icon={<FiActivity />} text="Activity Log" link="/activity" />  {/* ✅ Added Activity Page */}
        <SidebarItem isOpen={isOpen} icon={<FiSettings />} text="Settings" link="/settings" />

        {/* Divider */}
        <div className="border-t border-gray-300 my-3"></div>

        {/* Logout */}
        <button
          onClick={() => console.log("Logout")}
          className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded-lg w-full"
        >
          <IoLogOut className="text-xl" />
          {isOpen && <span className="ml-3">Logout</span>}
        </button>
      </nav>
    </div>
  );
};

const SidebarItem = ({ isOpen, icon, text, link }) => (
  <Link
    href={link}
    className="flex items-center text-gray-700 hover:bg-gray-300/40 p-3 rounded-lg transition-all duration-200"
  >
    <span className="text-xl">{icon}</span>
    {isOpen && <span className="ml-3 text-gray-900">{text}</span>}
  </Link>
);

export default Sidebar;
