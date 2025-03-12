import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/SideBar";
import { Toaster } from "react-hot-toast";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const NO_NAVBAR_SIDEBAR = ["/login", "/signup"]; // Hide on these routes

function AuthGuard({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    router.replace("/login");
    return <p>Redirecting...</p>;
  }

  return children;
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const showLayout = !NO_NAVBAR_SIDEBAR.includes(router.pathname);

  return (
    <SessionProvider session={pageProps.session}>
      <div className="flex flex-col h-screen">
        {showLayout && <Navbar />}
        <div className="flex flex-1">
          {showLayout && <Sidebar />}
          <main className={`flex-1 ${showLayout ? "p-6 bg-gray-100" : ""}`}>
            <Toaster position="top-right" />
            {Component.auth ? (
              <AuthGuard>
                <Component {...pageProps} />
              </AuthGuard>
            ) : (
              <Component {...pageProps} />
            )}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
