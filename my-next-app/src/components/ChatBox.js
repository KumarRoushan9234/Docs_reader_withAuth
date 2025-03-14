"use client";

import { useState, useEffect, useRef } from "react";
import useUserStore from "@/store/userStore";
import { FaPaperPlane, FaTrashAlt } from "react-icons/fa";
import { MdOutlineSmartToy } from "react-icons/md";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const chatEndRef = useRef(null);

  const { chatHistory, chatWithDocuments, fetchChatHistory, clearChatHistory } = useUserStore();

  // Load chat history on mount
  useEffect(() => {
    fetchChatHistory();
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, streamingMessage, loading]);

  // Simulate streaming effect for AI messages
  const simulateStreamingEffect = async (text) => {
    setStreamingMessage("");
    for (let i = 0; i < text.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 30)); // Simulate typing delay
      setStreamingMessage((prev) => prev + text[i]);
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setStreamingMessage("");

    try {
      const response = await chatWithDocuments(input);
      if (response?.answer) {
        simulateStreamingEffect(response.answer);
      }
    } catch (error) {
      console.error("Chat API Error:", error);
    }

    setInput("");
    setLoading(false);
  };

  // Handle "Enter" key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) sendMessage();
  };

  // Clear Chat History
  const handleClearChat = async () => {
    await clearChatHistory();
  };

  return (
    <div className="flex flex-col h-[85vh] max-h-[650px] w-full max-w-2xl mx-auto border rounded-xl bg-white shadow-lg overflow-hidden">
      
      {/* Chat Header */}
      <div className="flex items-center justify-between bg-blue-600 text-white p-3 font-semibold text-sm">
        <div>💬 AI Chat Assistant</div>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md flex items-center gap-1 text-xs"
          onClick={handleClearChat}
        >
          <FaTrashAlt className="text-sm" /> Clear Chat
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
        {chatHistory.length === 0 ? (
          <div className="text-gray-500 text-center mt-20 text-sm animate-pulse">
            Start a conversation...
          </div>
        ) : (
          chatHistory.map((msg, index) => (
            <div key={index} className="flex flex-col space-y-1">
              
              {/* User Message */}
              {msg.question && (
                <div className="flex justify-end">
                  <div className="p-2 rounded-xl shadow-md max-w-[75%] bg-blue-500 text-white self-end text-sm">
                    {msg.question}
                    <div className="text-xs text-gray-300 mt-1 text-right">You</div>
                  </div>
                </div>
              )}

              {/* AI Response */}
              {msg.answer && (
                <div className="flex items-start space-x-2">
                  <MdOutlineSmartToy className="text-gray-500 text-xl" />
                  <div className="p-2 rounded-xl shadow-md max-w-[75%] bg-gray-200 text-gray-800 text-sm">
                    {msg.answer}
                    <div className="text-xs text-gray-500 mt-1">AI</div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* AI Streaming Response */}
        {streamingMessage && (
          <div className="flex items-start space-x-2">
            <MdOutlineSmartToy className="text-gray-500 text-xl" />
            <div className="p-2 rounded-xl bg-gray-200 text-gray-800 text-sm animate-pulse">
              {streamingMessage}
              <span className="text-gray-500 font-bold">|</span>
            </div>
          </div>
        )}

        {/* AI is Typing Indicator */}
        {loading && !streamingMessage && (
          <div className="flex items-start space-x-2">
            <MdOutlineSmartToy className="text-gray-500 text-xl" />
            <div className="p-2 rounded-xl bg-gray-200 text-gray-600 italic animate-pulse">
              Typing...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <div className="flex items-center border-t bg-white p-2">
        <input
          type="text"
          className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className={`ml-2 px-4 py-2 rounded-lg text-white text-sm transition-all ${
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
