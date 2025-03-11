"use client"; // Required for Next.js App Router (src/app)

import { useState } from "react";
import { FaRegUserCircle, FaSearch } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { useRouter } from "next/navigation"; // ✅ Next.js router
import Image from "next/image";
import LearnMateLogo from "../../public/logo1.webp";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const router = useRouter(); // ✅ Next.js navigation

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white/10 backdrop-blur-md shadow-md border-b border-white/20">
      {/* Left - Logo & Name */}
      <div className="flex items-center gap-3">
        <Image src={LearnMateLogo} alt="Learn Mate" width={40} height={40} className="animate-spin-slow" />
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          Learn Mate
        </h3>
      </div>

      {/* Middle - Search Bar with Modern Border */}
      <div className="flex-1 mx-10 max-w-lg relative">
        <div className="flex items-center bg-white/20 border border-blue-500 rounded-lg shadow-md overflow-hidden">
          <FaSearch className="ml-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 pl-3 pr-4 bg-transparent outline-none text-black placeholder-gray-600"
          />
        </div>
      </div>

      {/* Right - Profile/Login */}
      <div className="flex items-center gap-4">
        <FaRegUserCircle className="text-2xl cursor-pointer text-gray-700 hover:text-gray-900" />
        <button
          onClick={() => router.push("/login")} // ✅ Fixed routing for Next.js
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all"
        >
          <FiLogIn className="text-lg" />
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
