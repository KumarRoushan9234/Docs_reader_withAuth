"use client";

import { useState, useEffect, useRef } from "react";
import useUserStore from "@/store/userStore";
import { FaPaperPlane, FaTimes, FaTrash } from "react-icons/fa";
import { MdOutlineSmartToy } from "react-icons/md";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const chatEndRef = useRef(null);

  const { chatHistory, chatWithDocuments, fetchChatHistory, clearChatHistory } = useUserStore();

  useEffect(() => {
    fetchChatHistory();
  }, []);

  // Smooth scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, streamingMessage]);

  // Streaming effect for AI response
  const streamResponse = async (text) => {
    setStreamingMessage("");
    for (let char of text) {
      await new Promise((resolve) => setTimeout(resolve, 20));
      setStreamingMessage((prev) => prev + char);
    }
  };

  // Handle sending message
  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setStreamingMessage("");

    try {
      const response = await chatWithDocuments(input);
      if (response?.answer) {
        streamResponse(response.answer);
      }
    } catch (error) {
      console.error("Chat API Error:", error);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-2xl mx-auto border bg-white shadow-lg">

      {/* 🔹 Fixed Header */}
      <div className="flex justify-between items-center p-4 border-b bg-gray-100 sticky top-0 z-10 flex-shrink-0">
        <div className="w-[80%] bg-blue-100 text-blue-800 font-semibold p-3 text-sm rounded-md">
          Ask me Anything! ... Welcome Kumar Roushan
        </div>
        <button
          onClick={clearChatHistory}
          className="p-2 text-gray-500 hover:text-red-500 transition-all"
          title="Clear Chat"
        >
          <FaTrash />
        </button>
      </div>

      {/* 🔹 Scrollable Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-white">
        {/* Starter Messages */}
        {chatHistory.length === 0 && !loading && (
          <div className="text-gray-500 text-sm space-y-3">
            <div className="p-3 bg-gray-200 text-gray-800 max-w-[75%] rounded-md">
              Welcome to the chat! Ask me anything. I may not always be right, but your feedback will help me improve!
            </div>
            <div className="p-3 bg-gray-200 text-gray-800 max-w-[75%] rounded-md">
              This is a platform where you can ask questions and receive clear, structured answers on various topics, including <b>Big Data, Apache Hive</b>, and more.
            </div>
          </div>
        )}

        {/* Display Chat History */}
        {chatHistory.map((msg, index) => (
          <div key={index} className="flex flex-col space-y-2">
            {/* User Message */}
            {msg.question && (
              <div className="flex justify-end">
                <div className="p-3 shadow-md max-w-[75%] bg-blue-500 text-white text-sm rounded-md">
                  {msg.question}
                  <div className="text-xs text-gray-200 mt-1 text-right">You</div>
                </div>
              </div>
            )}

            {/* AI Response */}
            {msg.answer && (
              <div className="flex items-start space-x-2">
                <MdOutlineSmartToy className="text-gray-500 text-xl" />
                <div className="p-3 shadow-md max-w-[75%] bg-gray-200 text-gray-800 text-sm rounded-md">
                  {msg.answer}
                  <div className="text-xs text-gray-500 mt-1">AI</div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Streaming Response Animation */}
        {streamingMessage && (
          <div className="flex items-start space-x-2">
            <MdOutlineSmartToy className="text-gray-500 text-xl" />
            <div className="p-3 bg-gray-200 text-gray-800 text-sm rounded-md animate-pulse">
              {streamingMessage}
              <span className="text-gray-500 font-bold">|</span>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && !streamingMessage && (
          <div className="flex items-start space-x-2">
            <MdOutlineSmartToy className="text-gray-500 text-xl" />
            <div className="p-3 bg-gray-200 text-gray-500 italic animate-pulse rounded-md">
              Typing...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* 🔹 Fixed Input Box */}
      <div className="w-full bg-gray-100 border-t p-2 flex items-center flex-shrink-0">
        <input
          type="text"
          className="flex-grow p-3 border border-gray-400 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm rounded-md"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
          disabled={loading}
        />
        {input && (
          <button
            className="ml-2 p-2 text-gray-500 hover:text-gray-400 transition-all"
            onClick={() => setInput("")}
          >
            <FaTimes />
          </button>
        )}
        <button
          className={`ml-2 px-4 py-2 text-white text-sm transition-all rounded-md ${
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
