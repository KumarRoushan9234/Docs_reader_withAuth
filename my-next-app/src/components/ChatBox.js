"use client";

import { useState, useEffect, useRef } from "react";
import useUserStore from "@/store/userStore";
import { FaPaperPlane, FaTrashAlt, FaTimes } from "react-icons/fa";
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, streamingMessage, loading]);

  const streamResponse = async (text) => {
    setStreamingMessage("");
    for (let i = 0; i < text.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 20));
      setStreamingMessage((prev) => prev + text[i]);
    }
  };

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
    <div className="flex flex-col h-[85vh] max-h-[650px] w-full max-w-2xl mx-auto border rounded-xl bg-white shadow-lg overflow-hidden">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
        {chatHistory.length === 0 && !loading && (
          <div className="text-gray-500 text-center mt-20 text-sm animate-pulse">
            Start a conversation...
          </div>
        )}

        {chatHistory.map((msg, index) => (
          <div key={index} className="flex flex-col space-y-2">
            {msg.question && (
              <div className="flex justify-end">
                <div className="p-3 rounded-xl shadow-md max-w-[75%] bg-blue-500 text-white text-sm">
                  {msg.question}
                  <div className="text-xs text-gray-300 mt-1 text-right">You</div>
                </div>
              </div>
            )}

            {msg.answer && (
              <div className="flex items-start space-x-2">
                <MdOutlineSmartToy className="text-gray-500 text-xl" />
                <div className="p-3 rounded-xl shadow-md max-w-[75%] bg-gray-200 text-gray-800 text-sm">
                  {msg.answer}
                  <div className="text-xs text-gray-500 mt-1">AI</div>
                </div>
              </div>
            )}
          </div>
        ))}

        {streamingMessage && (
          <div className="flex items-start space-x-2">
            <MdOutlineSmartToy className="text-gray-500 text-xl" />
            <div className="p-3 rounded-xl bg-gray-200 text-gray-800 text-sm animate-pulse">
              {streamingMessage}
              <span className="text-gray-500 font-bold">|</span>
            </div>
          </div>
        )}

        {loading && !streamingMessage && (
          <div className="flex items-start space-x-2">
            <MdOutlineSmartToy className="text-gray-500 text-xl" />
            <div className="p-3 rounded-xl bg-gray-200 text-gray-600 italic animate-pulse">
              Typing...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="flex items-center border-t bg-white p-2">
        <input
          type="text"
          className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
          disabled={loading}
        />
        {input && (
          <button
            className="ml-2 p-2 rounded-lg text-gray-500 hover:text-gray-700 transition-all"
            onClick={() => setInput("")}
          >
            <FaTimes />
          </button>
        )}
        <button
          className={`ml-2 px-4 py-2 rounded-lg text-white text-sm transition-all ${
            input.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={sendMessage}
          disabled={!input.trim() || loading}
        >
          {loading ? "⏳" : <FaPaperPlane />}
        </button>
        <button
          className="ml-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm flex items-center gap-1"
          onClick={clearChatHistory}
        >
          <FaTrashAlt className="text-sm" />
        </button>
      </div>
    </div>
  );
}
