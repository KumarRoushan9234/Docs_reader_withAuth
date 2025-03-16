import { FaThumbsUp, FaCommentDots, FaClipboardList, FaQuoteRight } from "react-icons/fa";

const stats = [
  { icon: <FaCommentDots />, label: "Total Posts", value: "150 / 250" },
  { icon: <FaThumbsUp />, label: "Liked Posts", value: "120 / 250" },
  { icon: <FaClipboardList />, label: "Total Threads", value: "90 / 250" },
  { icon: <FaQuoteRight />, label: "Quoted Posts", value: "75 / 250" },
];

export default function UserStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow-md">
          <div className="text-3xl text-blue-500 mr-4">{stat.icon}</div>
          <div>
            <p className="text-lg font-semibold text-gray-800">{stat.label}</p>
            <p className="text-gray-600">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
