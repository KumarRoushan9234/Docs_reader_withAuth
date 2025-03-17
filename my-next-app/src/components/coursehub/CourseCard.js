import { useRouter } from "next/router";

export default function CourseCard({ course, index }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/working")}
      className="bg-white border border-gray-300 shadow-md rounded-lg min-w-[280px] max-w-[300px] snap-start transform transition hover:scale-105 relative cursor-pointer hover:shadow-lg"
    >
      {/* Number on Top Left */}
      <div className="absolute top-2 left-2 bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-semibold">
        {index}
      </div>

      {/* Course Image Section */}
      <div className="h-52 bg-gray-200 flex items-center justify-center relative">
        <img src={course.img} alt={course.name} className="h-36" />
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm font-semibold">
          {course.name}
        </div>
      </div>
    </div>
  );
}
