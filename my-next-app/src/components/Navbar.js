"use client";
import { useEffect, useState } from "react";
import { FaRegUserCircle, FaSearch } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LearnMateLogo from "../../public/logo1.webp";
import useUserStore from "@/store/userStore";

const Navbar = () => {
  const { user, saveUser, logout } = useUserStore(); // Zustand Store
  // console.log("summary : ",summary);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  console.log("user data : ",user);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        saveUser(session?.user || null);
      } catch (error) {
        console.error("Failed to fetch user session:", error);
      }
    };

    fetchUser();
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout(); // Calls Zustand logout and clears API session
  
      // Force session reload after logout
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      
      saveUser(session?.user || null); // Update Zustand immediately
  
      // Force a full page reload to clear stale session data
      router.refresh(); 
      router.push("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!isMounted) return null;

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white/10 backdrop-blur-md shadow-md border-b border-white/20">
      {/* Left - Logo & Name */}
      <div className="flex items-center gap-3">
        <Image
          src={LearnMateLogo}
          alt="Learn Mate"
          width={40}
          height={40}
          className="animate-spin-slow hover:animate-spin-fast transition-all duration-500"
        />
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          Learn Mate
        </h3>
      </div>

      {/* Middle - Search Bar */}
      <div className="flex-1 mx-10 max-w-lg relative">
        <div className="flex items-center bg-white/20 border border-blue-500 rounded-lg shadow-md overflow-hidden">
          <FaSearch className="ml-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 pl-3 pr-4 bg-transparent outline-none text-black placeholder-gray-600"
          />
        </div>
      </div>

      {/* Right - User Info & Logout */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            <p className="text-gray-700 font-medium">{user.name}</p>
            <FaRegUserCircle className="text-2xl text-gray-700 cursor-pointer hover:text-gray-900" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all"
            >
              <FiLogOut />
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
