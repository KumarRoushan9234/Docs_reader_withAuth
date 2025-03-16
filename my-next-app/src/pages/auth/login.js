import { useState } from "react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import useUserStore from "@/store/userStore"; 

export default function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { saveUser } = useUserStore(); 

  const handleLogin = async () => {
    if (!user.email || !user.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: user.email,
      password: user.password,
    });

    setLoading(false);

    if (res?.error) {
      toast.error(res.error);
      return;
    }

    // ✅ Fetch user session after login
    const sessionRes = await fetch("/api/auth/session");
    const sessionData = await sessionRes.json();

    if (sessionData?.user) {
      console.log("User Data:", sessionData.user);
      saveUser(sessionData.user); // ✅ Update Zustand store
      toast.success("Login Successful");
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
        <p className="text-gray-600 text-sm text-center mt-4">
          Don't have an account?{" "}
          <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => router.push("/signup")}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
