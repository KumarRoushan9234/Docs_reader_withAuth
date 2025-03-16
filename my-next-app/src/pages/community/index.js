import CommunityIntro from "@/components/community/CommunityIntro";
import ForumTabs from "@/components/community/ForumTabs";
import UserStats from "@/components/community/UserStats";
import { TfiAnnouncement } from "react-icons/tfi";
import { IoIosStats } from "react-icons/io";

export default function CommunityPage() {
  return (
    <div className="w-full py-10 px-6 space-y-10 bg-gradient-to-b from-gray-100 to-gray-50 min-h-screen">
      {/* Community Intro */}
      <CommunityIntro />

      {/* Forums Section */}
      <div className="w-full bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TfiAnnouncement className="text-blue-500 text-3xl" /> Community Forums
        </h2>
        <ForumTabs />
      </div>

      {/* User Stats */}
      <div className="w-full bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <IoIosStats className="text-green-500 text-3xl" /> Your Stats
        </h2>
        <UserStats />
      </div>
    </div>
  );
}
