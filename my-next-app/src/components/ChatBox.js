"use client";

import { useState, useEffect, useRef } from "react";
import useUserStore from "@/store/userStore";
import { FaPaperPlane } from "react-icons/fa";
import { MdOutlineSmartToy } from "react-icons/md";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const { chatHistory, chatWithDocuments, fetchChatHistory } = useUserStore();

  // Load chat history on mount
  useEffect(() => {
    fetchChatHistory();
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Send a message
  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      await chatWithDocuments(input);
    } catch (error) {
      console.error("Chat API Error:", error);
    }

    setInput("");
    setLoading(false);
  };

  // Handle "Enter" key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col h-[85vh] max-h-[650px] w-full max-w-2xl mx-auto border rounded-xl bg-white shadow-lg overflow-hidden">
      
      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
        {chatHistory.length === 0 ? (
          <div className="text-gray-500 text-center mt-20 text-lg animate-pulse">
            💬 Start a conversation...
          </div>
        ) : (
          chatHistory.map((msg, index) => (
            <div key={index} className="flex flex-col space-y-1">
              
              {/* User Message */}
              {msg.question && (
                <div className="flex justify-end">
                  <div className="p-3 rounded-lg shadow-md max-w-[80%] bg-blue-500 text-white self-end">
                    {msg.question}
                  </div>
                </div>
              )}

              {/* AI Response */}
              {msg.answer && (
                <div className="flex items-start space-x-2">
                  <MdOutlineSmartToy className="text-gray-500 text-2xl" />
                  <div className="p-3 rounded-lg shadow-md max-w-[80%] bg-gray-200 text-gray-800">
                    {msg.answer}
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* AI is Typing Indicator */}
        {loading && (
          <div className="flex items-start space-x-2">
            <MdOutlineSmartToy className="text-gray-500 text-2xl" />
            <div className="p-3 rounded-lg bg-gray-200 text-gray-600 italic animate-pulse">
              Typing...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <div className="flex items-center border-t bg-white p-3">
        <input
          type="text"
          className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className={`ml-2 px-5 py-3 rounded-lg text-white text-lg ${
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
