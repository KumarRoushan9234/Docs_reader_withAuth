import { useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";

export default function Terminal() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(""); // For user input

  const runCode = async () => {
    if (loading) return; // Prevent double submission
    setLoading(true);
    setOutput("Running...");

    try {
      const response = await axios.post("/api/terminal/run", { language, code, input: inputValue });
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

      {/* User Input Section */}
      <div className="mt-4">
        <label htmlFor="userInput" className="text-sm">Enter Input:</label>
        <input
          type="text"
          id="userInput"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="mt-2 p-2 w-full bg-gray-800 text-white rounded-md border border-gray-600"
          placeholder="Enter input for the program (e.g., 5)"
        />
      </div>

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
        className="mt-4 p-4 bg-gray-800 rounded-lg min-h-[80px] max-h-[300px] overflow-auto text-sm"
        style={{
          color: typeof output === "string" && output.includes("Error") ? "red" : "lightgreen",
          border: "2px solid", 
          borderColor: typeof output === "string" && output.includes("Error") ? "red" : "lightgreen",
          borderRadius: "10px",
        }}
      >
        <pre>{output || "Output will appear here..."}</pre>
      </div>
    </div>
  );
}
