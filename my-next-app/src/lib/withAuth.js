import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function withAuth(Component) {
  return function ProtectedRoute(props) {
    const { data: session } = useSession();
    const router = useRouter();

    if (!session) {
      router.push("/login");
      return null;
    }

    return <Component {...props} />;
  };
}
