import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function Signup() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleSignup = async () => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success(data.message);
      router.push("/login");
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Sign Up</h2>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <button
          onClick={handleSignup}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
        >
          Sign Up
        </button>
        <p className="text-gray-600 text-sm text-center mt-4">
          Already have an account?{" "}
          <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => router.push("/login")}>
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
