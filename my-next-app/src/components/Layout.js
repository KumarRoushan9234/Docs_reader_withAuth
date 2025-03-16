import Navbar from "./Navbar";
import Sidebar from "./SideBar";

export default function Layout({ children }) {
  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="flex flex-1 pt-[4.4rem]">
        {/* Sidebar (Fixed & Full Height) */}
        <div className="w-[64px] z-50 h-[calc(100vh-4.3rem)] fixed left-0 top-[4.4rem] bg-white shadow-md">
          <Sidebar />
        </div>

        {/* Main Content (No White Space & Proper Alignment) */}
        <main className="flex-grow h-[calc(100vh-4.4rem)] ml-20 bg-gray-100 overflow-auto hide-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
