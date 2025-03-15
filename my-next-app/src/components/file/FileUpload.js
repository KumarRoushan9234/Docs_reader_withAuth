"use client";

import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { FaUpload, FaFileAlt, FaTrashAlt, FaSpinner } from "react-icons/fa";
import axios from "axios";
import useUserStore from "@/store/userStore";
import FileNavbar from "./FileNavbar";

export default function FileUpload() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { UpdateDocs } = useUserStore(); // Get UpdateDocs from the store

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleDragOver = (event) => event.preventDefault();

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please upload at least one file.");
      return;
    }

    setLoading(true);
    toast.loading("Processing files...");

    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    try {
      const response = await axios.post("/api/extract-text", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const extractedData = response.data.data;
      if (!extractedData || Object.keys(extractedData).length === 0) {
        throw new Error("No extracted text found.");
      }

      // ✅ Call UpdateDocs from useUserStore
      await UpdateDocs(extractedData);

      toast.dismiss();
      toast.success("Text extracted successfully!");
      setFiles([]);
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

      <div
        onClick={() => fileInputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-lg hover:border-blue-500 transition-all"
      >
        <FaUpload className="text-gray-500 text-4xl" />
        <span className="text-gray-500 mt-2 text-center">
          Drag & Drop files here, <strong>Click</strong> to select
        </span>
        <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      </div>

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

      <button
        onClick={handleUpload}
        disabled={files.length === 0 || loading}
        className={`w-full px-4 py-2 rounded text-white mt-4 flex items-center justify-center gap-2 ${
          files.length === 0 || loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? <><FaSpinner className="animate-spin" /> Processing...</> : <><FaUpload /> Upload & Extract</>}
      </button>
    </div>
  );
}
