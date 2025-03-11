import FileUpload from "@/components/FileUpload";
import ChatBox from "@/components/ChatBox";

export default function Home() {
  return (
    <div className="flex h-full">
      {/* Left - File Upload */}
      <div className="w-1/2 p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">Upload Documents</h2>
        <FileUpload />
      </div>

      {/* Divider */}
      <div className="w-1 bg-gray-300 mx-4"></div>

      {/* Right - Chat */}
      <div className="w-1/2 p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">Chatbot</h2>
        <ChatBox />
      </div>
    </div>
  );
}
