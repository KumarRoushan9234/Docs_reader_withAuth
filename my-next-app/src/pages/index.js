import FileUpload from "@/components/FileUpload";
import ChatBox from "@/components/ChatBox";

function Home() {
  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 p-6">
      {/* Left - File Upload */}
      <div className="lg:w-1/2 w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
        <FileUpload />
      </div>

      {/* Divider */}
      <div className="hidden lg:block w-px bg-gray-300"></div>

      {/* Right - Chat */}
      <div className="lg:w-1/2 w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Chatbot</h2>
        <ChatBox />
      </div>
    </div>
  );
}

Home.auth = true; // ✅ Require authentication

export default Home;
