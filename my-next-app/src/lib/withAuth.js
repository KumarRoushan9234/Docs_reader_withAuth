import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function withAuth(Component) {
  return function ProtectedRoute(props) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      async function checkAuth() {
        const session = await getSession();
        if (!session) {
          router.replace("/login");
        }
        setLoading(false);
      }
      checkAuth();
    }, []);

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;

    return <Component {...props} />;
  };
}
