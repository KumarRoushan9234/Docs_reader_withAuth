import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/SideBar";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar (Takes Full Height) */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100">
        <Toaster position="top-right" />
          <Component {...pageProps} />
        </main>
      </div>
    </div>
  );
}
