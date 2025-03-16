import { FaThumbsUp, FaCommentDots } from "react-icons/fa";

const stats = [
  { icon: <FaCommentDots />, label: "Total Posts", value: "150 / 250", color: "text-purple-500" },
  { icon: <FaThumbsUp />, label: "Liked Posts", value: "120 / 250", color: "text-green-500" },
];

export default function UserStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex items-center p-6 bg-white rounded-xl shadow-lg border border-gray-200 transition transform hover:scale-105"
        >
          <div className={`text-4xl ${stat.color} mr-4`}>{stat.icon}</div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{stat.label}</p>
            <p className="text-gray-600 text-sm">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
