import Navbar from "./Navbar";
import Sidebar from "./SideBar";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar at the Top */}
      <Navbar className="w-full fixed top-0 left-0 z-50" />

      <div className="flex flex-1 mt-[7.5rem]"> {/* Adjust top padding to prevent content overlap */}
        {/* Sidebar below Navbar */}
        <Sidebar className="w-[250px] fixed left-0 top-[4rem] h-[calc(100vh-4rem)] z-40" />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-100 ml-0 mt-[4rem]">
          {children}
        </main>
      </div>
    </div>
  );
}
