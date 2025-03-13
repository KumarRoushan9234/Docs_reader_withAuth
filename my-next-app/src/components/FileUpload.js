"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { FaUpload, FaFileAlt, FaTrashAlt, FaSpinner } from "react-icons/fa";
import useUserStore from "@/store/userStore"; // Import Zustand store
import axios from "axios";

export default function FileUpload() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Zustand Store
  const { UpdateDocs, summary, keyPoints, extractedDocs } = useUserStore();

  const fileInputRef = useRef(null);

  // Handle pasting files
  useEffect(() => {
    const handlePaste = (event) => {
      if (event.clipboardData.files.length > 0) {
        const pastedFiles = Array.from(event.clipboardData.files);
        setFiles((prevFiles) => [...prevFiles, ...pastedFiles]);
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  // Handle file selection
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  // Handle drag and drop
  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleDragOver = (event) => event.preventDefault();

  // Remove selected file
  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // Handle file upload and text extraction
  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please upload at least one file.");
      return;
    }
  
    setLoading(true);
    toast.loading("Processing files...");
    console.log("🚀 Uploading files:", files);
  
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));
  
    try {
      // Step 1: Upload files to API and extract text
      console.log("📤 Sending files to API for extraction...");
      const extractResponse = await axios.post("/api/extract-text", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      console.log("✅ Extracted response:", extractResponse.data.data);
      const extractedData = extractResponse.data.data;
  
      if (!extractedData || Object.keys(extractedData).length === 0) {
        throw new Error("No extracted text found.");
      }
  
      toast.dismiss();
      toast.success("Text extracted successfully!");
  
      // Step 2: Send extracted text to FastAPI `/extract` endpoint
      console.log("🔄 Sending extracted text to /extract API...");
      const UpdateDocsResponse = await UpdateDocs(extractedData);
  
      if (UpdateDocsResponse) {
        console.log("🎯 Extraction complete. Summary & Key Points updated in store.");
        toast.success("Summary & key points generated!");
      }
  
    } catch (error) {
      console.error("❌ Error during extraction:", error);
      toast.error("Failed to process files. Try again!");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="p-6 mx-auto max-w-2xl bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
        <FaUpload className="text-blue-500" /> Upload Files
      </h2>

      {/* Drag and Drop or Click to Upload */}
      <div
        onClick={() => fileInputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-lg hover:border-blue-500 transition-all"
      >
        <FaUpload className="text-gray-500 text-4xl" />
        <span className="text-gray-500 mt-2 text-center">
          Drag & Drop files here, <strong>Click</strong> to select, or <strong>Paste (Ctrl+V)</strong>
        </span>
        <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      </div>

      {/* Display Selected Files */}
      {files.length > 0 && (
        <div className="mt-4 p-3 bg-gray-100 rounded shadow">
          <h3 className="text-lg font-medium mb-2">Files to Upload:</h3>
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap p-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-2 bg-white px-3 py-2 rounded shadow border">
                <FaFileAlt className="text-green-500" />
                <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                <button onClick={() => handleRemoveFile(index)} className="text-red-500 hover:text-red-700">
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={files.length === 0 || loading}
        className={`w-full px-4 py-2 rounded text-white mt-4 flex items-center justify-center gap-2 ${
          files.length === 0 || loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? <><FaSpinner className="animate-spin" /> Processing...</> : <><FaUpload /> Upload & Extract</>}
      </button>

      {/* Display Summary & Key Points */}
      {summary && keyPoints && (
        <div className="mt-6 p-4 bg-gray-100 border rounded shadow">
          <h3 className="text-lg font-medium mb-2">Summary:</h3>
          <p className="text-gray-700">{summary}</p>

          <h3 className="text-lg font-medium mt-4 mb-2">Key Points:</h3>
          <ul className="list-disc list-inside text-gray-700">
            {keyPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Debugging Logs */}
      <div className="mt-4 p-3 text-xs text-gray-600 bg-gray-200 rounded">
        <strong>Debug Logs:</strong>
        <pre className="overflow-x-auto text-gray-800">
          {JSON.stringify({ extractedDocs, summary, keyPoints }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
