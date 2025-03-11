"use client";

import { useState, useRef, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const API_BASE_URL = "http://127.0.0.1:8000";

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Auto-scroll to latest message & save to localStorage
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Function to handle API calls
  const fetchChatResponse = async (query) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Chat API Error:", error);
      return "Error fetching response.";
    }
  };
  

  // Function to send a message
  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const newMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Fetch AI response
    const botReply = await fetchChatResponse(input);

    setMessages((prev) => [...prev, { text: `🤖 AI: ${botReply}`, sender: "bot" }]);
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
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center mt-20 text-lg animate-pulse">
            💬 Ask me anything...
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`p-3 rounded-lg shadow-md max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-white text-gray-800"
                }`}
              >
                {msg.text}
              </div>
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
