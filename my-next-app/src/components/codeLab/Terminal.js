import { useState } from "react";
import axios from "axios";

export default function Terminal() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    setLoading(true);
    setOutput("Running...");

    try {
      const response = await axios.post("/api/run", {
        language,
        code,
      });
      setOutput(response.data.output);
    } catch (error) {
      setOutput("Error: " + (error.response?.data?.output || "Could not execute code."));
    }

    setLoading(false);
  };

  return (
    <div className="flex-1 bg-black text-white p-4 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">🖥️ Code Terminal</h2>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-800 text-white p-1 rounded-md"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
      </div>

      {/* Code Input */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-40 bg-gray-900 text-white p-3 rounded-lg text-sm font-mono"
        placeholder="Write your code here..."
      ></textarea>

      {/* Run Button */}
      <button
        onClick={runCode}
        className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
        disabled={loading}
      >
        {loading ? "Running..." : "🚀 Run Code"}
      </button>

      {/* Output */}
      <pre className="mt-4 bg-gray-800 p-3 rounded-lg text-sm overflow-x-auto">{output}</pre>
    </div>
  );
}
