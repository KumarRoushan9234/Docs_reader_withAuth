import Navbar from "./Navbar";
import Sidebar from "./SideBar";

export default function Layout({ children }) {
  return (
    <div className="h-screen w-screen flex flex-col">
      {/*Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="flex flex-1 pt-[4.7rem]">
        {/* Sidebar */}
        <div className="w-[20px] z-40  fixed  top-[4.4rem] bg-white shadow-md">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-grow h-[calc(100vh-4.4rem)] ml-20 bg-gray-100 overflow-auto hide-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
