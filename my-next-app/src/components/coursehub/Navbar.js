import { FaSearch, FaStar, } from "react-icons/fa";
import { FaGoogleScholar } from "react-icons/fa6";

export default function Navbar() {
  return (
    <div className="mt-4 px-6">
      <div className="flex flex-col gap-3">
        {/* Title */}
        <div className="flex items-center gap-2">
          <FaGoogleScholar className="text-blue-600 text-2xl" />
          <h1 className="text-3xl font-bold">Top Courses</h1>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <FaSearch className="absolute left-4 top-3 text-white" />
          <input
            type="text"
            placeholder="Search for a course..."
            className="w-full pl-10 pr-4 py-2 rounded-full shadow-md border-none bg-gray-800 text-white placeholder-white focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>
    </div>
  );
}
