import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/SideBar";
import { Toaster } from "react-hot-toast";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";

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
  return (
    <SessionProvider session={pageProps.session}>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 bg-gray-100">
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
