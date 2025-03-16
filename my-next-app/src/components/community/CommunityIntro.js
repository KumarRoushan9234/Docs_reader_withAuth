import { FaUsers } from "react-icons/fa";

export default function CommunityIntro() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
        <FaUsers className="text-blue-500" /> Join the Community
      </h1>
      <p className="mt-2 text-gray-600">
        Connect with like-minded individuals, explore forums, and grow together!
      </p>
      <button className="mt-4 px-5 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white">
        Count me in →
      </button>
    </div>
  );
}
