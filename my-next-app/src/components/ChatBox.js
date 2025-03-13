"use client";

import useUserStore from "@/store/userStore";
import { useState, useRef, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const { chatHistory, chatWithDocuments } = useUserStore();

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Function to send a message
  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      await chatWithDocuments(input); // Calling Zustand function directly
    } catch (error) {
      console.error("Chat API Error:", error);
    }

    setInput("");
    setLoading(false);
  };

  // Handle "Enter" key to send message
  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col h-[85vh] max-h-[650px] w-full max-w-2xl mx-auto border rounded-lg bg-white shadow-lg overflow-hidden">
      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-100">
        {chatHistory.length === 0 ? (
          <div className="text-gray-500 text-center mt-20 text-lg animate-pulse">
            💬 Ask me anything...
          </div>
        ) : (
          chatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.question ? "justify-end" : "justify-start"}`}>
              {msg.question && (
                <div className="p-3 rounded-lg shadow-md max-w-[80%] bg-blue-500 text-white self-end">
                  {msg.question}
                </div>
              )}
              {msg.answer && (
                <div className="p-3 rounded-lg shadow-md max-w-[80%] bg-white text-gray-800">
                  🤖 AI: {msg.answer}
                </div>
              )}
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <div className="flex items-center border-t bg-white p-3">
        <input
          type="text"
          className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className={`ml-2 px-4 py-2 rounded-lg text-white ${
            input.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={sendMessage}
          disabled={!input.trim() || loading}
        >
          {loading ? "⏳" : <FaPaperPlane />}
        </button>
      </div>
    </div>
  );
}
