import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

// ChatBox component that can be reused for all forums
export default function ChatBox({ forumName, messages }) {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Append new message to chat (temporary, needs backend for persistence)
    messages.push({ user: "You", text: newMessage, time: "Just now" });
    setNewMessage("");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-semibold mb-3 text-gray-800">{forumName} Forum Chat</h2>
      <div className="h-64 overflow-y-auto bg-gray-100 p-3 rounded-lg space-y-3">
        {messages.map((msg, index) => (
          <div key={index} className="p-3 bg-gray-200 rounded-lg">
            <p className="font-semibold text-gray-900">{msg.user}</p>
            <p className="text-gray-700">{msg.text}</p>
            <p className="text-xs text-gray-500">{msg.time}</p>
          </div>
        ))}
      </div>

      {/* Message Input Box */}
      <div className="flex mt-4 bg-gray-100 p-2 rounded-lg">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 rounded-lg bg-white border border-gray-300 outline-none"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}
