import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <button
          onClick={() => signIn("google")} // Change this to your provider
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
