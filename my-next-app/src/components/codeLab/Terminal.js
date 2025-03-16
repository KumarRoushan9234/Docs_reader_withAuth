import { useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";

export default function Terminal() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    if (loading) return; // Prevent double submission
    setLoading(true);
    setOutput("Running...");

    try {
      const response = await axios.post("/api/terminal/run", { language, code });
      setOutput(response.data.output);
    } catch (error) {
      setOutput(
        <span style={{ color: "red" }}>
          Error: {error.response?.data?.output || "Could not execute code."}
        </span>
      );
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col bg-gray-900 text-white p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">🖥️ Code Terminal</h2>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-md border border-gray-600"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
      </div>

      {/* Code Editor */}
      <Editor
        height="300px"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={(value) => setCode(value)}
        options={{
          fontSize: 16,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
        }}
      />

      {/* Run Button */}
      <button
        onClick={runCode}
        className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
        disabled={loading}
      >
        {loading ? "Running..." : "🚀 Run Code"}
      </button>

      {/* Output Box */}
      <div
        className="mt-4 p-4 bg-gray-800 rounded-lg min-h-[80px] overflow-x-auto text-sm"
        style={{ color: typeof output === "string" && output.includes("Error") ? "red" : "lightgreen" }}
      >
        {output || "Output will appear here..."}
      </div>
    </div>
  );
}
