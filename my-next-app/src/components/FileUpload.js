"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import {
  FaUpload,
  FaFileAlt,
  FaTrashAlt,
  FaSpinner,
  FaSearchPlus,
  FaSearchMinus,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";
import mammoth from "mammoth";

// Ensure PDF.js worker loads correctly
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function FileUpload() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [filePreviews, setFilePreviews] = useState({});

  const fileInputRef = useRef(null);

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

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    generateFilePreviews(newFiles);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    generateFilePreviews(droppedFiles);
  };

  const handleDragOver = (event) => event.preventDefault();

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    const updatedPreviews = { ...filePreviews };
    delete updatedPreviews[index];
    setFilePreviews(updatedPreviews);
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
      const extractResponse = await axios.post("/api/extract-text", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const extractedData = extractResponse.data.data;

      if (!extractedData || Object.keys(extractedData).length === 0) {
        throw new Error("No extracted text found.");
      }

      toast.dismiss();
      toast.success("Text extracted successfully!");

      setDocs(Object.entries(extractedData));
      setCurrentPage(1);
    } catch (error) {
      console.error("❌ Error during extraction:", error);
      toast.error("Failed to process files. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const generateFilePreviews = (fileList) => {
    fileList.forEach((file, index) => {
      if (file.type === "application/pdf") {
        const fileURL = URL.createObjectURL(file);
        setFilePreviews((prev) => ({ ...prev, [index]: { type: "pdf", url: fileURL } }));
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const text = await mammoth.extractRawText({ arrayBuffer: event.target.result });
          setFilePreviews((prev) => ({ ...prev, [index]: { type: "docx", text: text.value } }));
        };
        reader.readAsArrayBuffer(file);
      } else if (file.type.startsWith("text/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFilePreviews((prev) => ({ ...prev, [index]: { type: "text", text: event.target.result } }));
        };
        reader.readAsText(file);
      }
    });
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
          Drag & Drop files here, <strong>Click</strong> to select, or <strong>Paste (Ctrl+V)</strong>
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

      {/* {Object.values(filePreviews).map((preview, index) => (
        <div key={index} className="mt-6 p-4 bg-gray-100 border rounded">
          {preview.type === "pdf" && <Document file={preview.url}><Page pageNumber={1} /></Document>}
          {preview.type === "docx" && <p>{preview.text}</p>}
          {preview.type === "text" && <p>{preview.text}</p>}
        </div>
      ))} */}
    </div>
  );
}
