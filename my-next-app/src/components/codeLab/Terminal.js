import { useState } from "react";

export default function Terminal() {
  const [code, setCode] = useState("// Write your code here...");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");

  const runCode = () => {
    setOutput("Running code...\n(Feature: Backend execution pending)");
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg h-[400px] flex flex-col">
      {/* Language Selector & Buttons */}
      <div className="flex justify-between mb-2">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-700 p-2 rounded-md"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>
        <div>
          <button onClick={runCode} className="bg-green-600 px-3 py-1 rounded-md mr-2">▶ Run</button>
          <button className="bg-blue-500 px-3 py-1 rounded-md">✅ Test Cases</button>
        </div>
      </div>

      {/* Code Input */}
      <textarea
        className="flex-grow bg-gray-800 text-white p-2 rounded-md"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      {/* Output Display */}
      <div className="bg-black p-2 mt-2 h-[100px] rounded-md">
        <pre className="text-green-400">{output}</pre>
      </div>
    </div>
  );
}
