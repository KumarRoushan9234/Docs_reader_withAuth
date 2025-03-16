import CommunityIntro from "@/components/community/CommunityIntro";
import ForumTabs from "@/components/community/ForumTabs";
import MessagesBox from "@/components/community/MessagesBox";
import UserStats from "@/components/community/UserStats";

export default function CommunityPage() {
  return (
    <div className="w-full py-10 px-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Community Intro Section */}
      <CommunityIntro />

      {/* Forums Section */}
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-800">📢 Community Forums</h2>
        <ForumTabs />
      </div>

      {/* Messages Section
      <MessagesBox /> */}

      {/* User Stats */}
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-800">📊 Your Stats</h2>
        <UserStats />
      </div>
    </div>
  );
}
