import { useState } from "react";

export default function Terminal() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const runCode = () => {
    setOutput("Running code... (Simulated output)");
  };

  return (
    <div className="flex-1 bg-black text-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg">Terminal</h2>
        <select className="bg-gray-800 text-white p-1 rounded-md">
          <option>Python</option>
          <option>JavaScript</option>
          <option>C++</option>
        </select>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-32 bg-gray-900 text-white p-2 rounded-lg"
        placeholder="Write your code here..."
      ></textarea>

      <button onClick={runCode} className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg">
        Run Code
      </button>

      <pre className="mt-4 bg-gray-800 p-2 rounded-lg">{output}</pre>
    </div>
  );
}
