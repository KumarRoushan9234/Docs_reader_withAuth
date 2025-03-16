import "@/styles/globals.css";
import Layout from "@/components/Layout";
import { Toaster } from "react-hot-toast";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const NO_LAYOUT = ["/login", "/signup"];

function AuthGuard({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure hooks run on client-side only
  }, []);

  if (!isClient) return null; // Prevents hydration mismatch

  if (status === "loading") return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (!session) {
    router.replace("/login");
    return <div className="h-screen flex items-center justify-center">Redirecting...</div>;
  }

  return children;
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const useLayout = !NO_LAYOUT.includes(router.pathname);
  const requiresAuth = Component.auth; // If a component has `.auth = true`, it needs authentication

  return (
    <SessionProvider session={pageProps.session}>
      <Toaster position="top-right" />
      {useLayout ? (
        <Layout>
          {requiresAuth ? (
            <AuthGuard>
              <Component {...pageProps} />
            </AuthGuard>
          ) : (
            <Component {...pageProps} />
          )}
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}
