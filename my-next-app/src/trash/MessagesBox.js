import { FaRegCommentDots } from "react-icons/fa";

const messages = [
  { user: "John Doe", text: "How do I optimize Dijkstra's Algorithm?", time: "2 mins ago" },
  { user: "Jane Smith", text: "Best resources for learning OS?", time: "10 mins ago" },
  { user: "Alice", text: "What is the best way to prepare for CN?", time: "20 mins ago" },
];

export default function MessagesBox() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-gray-800">
        <FaRegCommentDots className="text-blue-500" /> Recent Messages
      </h2>
      <div className="space-y-3">
        {messages.map((msg, index) => (
          <div key={index} className="bg-gray-100 p-3 rounded-lg shadow-sm">
            <p className="font-semibold text-gray-800">{msg.user}</p>
            <p className="text-gray-600">{msg.text}</p>
            <p className="text-xs text-gray-400">{msg.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
