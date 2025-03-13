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
  FaDownload,
  FaExpand,
  FaCompress,
  FaBookmark,
  FaPrint,
  FaRegLightbulb,
} from "react-icons/fa";
import useUserStore from "@/store/userStore";
import axios from "axios";

export default function FileUpload() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);

  const { UpdateDocs } = useUserStore();
  const fileInputRef = useRef(null);
  const viewerRef = useRef(null);

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

  useEffect(() => {
    if (searchTerm.trim() && docs[currentPage]) {
      const text = docs[currentPage].toLowerCase();
      const term = searchTerm.toLowerCase();
      
      const results = [];
      let index = 0;
      
      while (index !== -1) {
        index = text.indexOf(term, index);
        if (index !== -1) {
          results.push(index);
          index += term.length;
        }
      }
      
      setSearchResults(results);
      setCurrentSearchIndex(0);
      
      if (results.length > 0) {
        highlightSearchResults();
      }
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, currentPage, docs]);

  const highlightSearchResults = () => {
    if (viewerRef.current && searchResults.length > 0) {
      const textContent = docs[currentPage];
      const term = searchTerm;
      
      // Reset highlighted content
      let highlightedContent = textContent;
      
      // Prepare highlighted content
      const parts = textContent.split(new RegExp(`(${term})`, 'gi'));
      highlightedContent = parts.map((part, i) => 
        part.toLowerCase() === term.toLowerCase() 
          ? `<mark class="bg-yellow-300 ${i === currentSearchIndex * 2 + 1 ? 'bg-yellow-500' : ''}">${part}</mark>` 
          : part
      ).join('');
      
      // Update the content
      if (viewerRef.current) {
        viewerRef.current.innerHTML = highlightedContent;
      }
    }
  };

  useEffect(() => {
    if (searchResults.length > 0) {
      highlightSearchResults();
    }
  }, [currentSearchIndex, searchResults]);

  const handleNextSearchResult = () => {
    if (searchResults.length > 0) {
      setCurrentSearchIndex((prev) => (prev + 1) % searchResults.length);
    }
  };

  const handlePrevSearchResult = () => {
    if (searchResults.length > 0) {
      setCurrentSearchIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    }
  };

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
    setFiles(files.filter((_, i) => i !== index));
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleBookmark = () => {
    if (bookmarks.includes(currentPage)) {
      setBookmarks(bookmarks.filter(page => page !== currentPage));
      toast.success("Bookmark removed");
    } else {
      setBookmarks([...bookmarks, currentPage]);
      toast.success("Bookmark added");
    }
  };

  const handlePrint = () => {
    const printContent = docs[currentPage];
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Document</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .content { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <h1>Page ${currentPage}</h1>
          <div class="content">${printContent}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    const content = docs[currentPage];
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document-page-${currentPage}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      const UpdateDocsResponse = await UpdateDocs(extractedData);

      if (UpdateDocsResponse) {
        toast.success("Documents processed successfully!");
      }

      setDocs(extractedData);
      setCurrentPage(1);
    } catch (error) {
      console.error("❌ Error during extraction:", error);
      toast.error("Failed to process files. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Object.keys(docs).length;
  const currentPageText = docs[currentPage];

  return (
    <div className="p-6 mx-auto max-w-5xl bg-white rounded-lg shadow-lg">
      {/* Document Viewer */}
      {totalPages > 0 && (
        <div className={`${fullscreen ? "fixed inset-0 z-50 p-4" : "mb-6 p-4"} ${darkMode ? "bg-gray-900" : "bg-gray-100"} border rounded shadow transition-all duration-300`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
              Document Viewer
            </h3>
            
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded ${darkMode ? "bg-gray-700 text-yellow-400" : "bg-gray-200 text-gray-700"}`}
                title={darkMode ? "Light Mode" : "Dark Mode"}
              >
                <FaRegLightbulb />
              </button>
              
              <button
                onClick={toggleFullscreen}
                className={`p-2 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700"}`}
                title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {fullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in document..."
              className={`flex-1 p-2 rounded border ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-800 border-gray-300"}`}
            />
            
            {searchResults.length > 0 && (
              <div className="flex items-center gap-2">
                <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {currentSearchIndex + 1}/{searchResults.length}
                </span>
                <button
                  onClick={handlePrevSearchResult}
                  className={`p-2 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                  <FaArrowLeft className="text-xs" />
                </button>
                <button
                  onClick={handleNextSearchResult}
                  className={`p-2 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                  <FaArrowRight className="text-xs" />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                Page {currentPage} / {totalPages}
              </span>
              {bookmarks.includes(currentPage) && (
                <span className="text-yellow-500">
                  <FaBookmark />
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded ${darkMode ? "bg-gray-700" : "bg-gray-200"} ${bookmarks.includes(currentPage) ? "text-yellow-500" : darkMode ? "text-white" : "text-gray-700"}`}
                title={bookmarks.includes(currentPage) ? "Remove Bookmark" : "Add Bookmark"}
              >
                <FaBookmark />
              </button>
              
              <button
                onClick={handleDownload}
                className={`p-2 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700"}`}
                title="Download Page"
              >
                <FaDownload />
              </button>
              
              <button
                onClick={handlePrint}
                className={`p-2 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700"}`}
                title="Print Page"
              >
                <FaPrint />
              </button>
            </div>
          </div>

          <div
            className={`relative ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} p-6 border rounded shadow overflow-auto transition-all duration-300`}
            style={{ 
              height: fullscreen ? "calc(100vh - 200px)" : "500px", 
              transform: `scale(${zoomLevel})`,
              transformOrigin: "top left"
            }}
          >
            <div 
              ref={viewerRef}
              className="text-base whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: searchTerm ? '' : currentPageText }}
            >
              {searchTerm ? null : currentPageText}
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded flex items-center gap-2 ${
                currentPage === 1 ? "opacity-50" : ""
              } ${darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"}`}
            >
              <FaArrowLeft /> Previous
            </button>

            <div className="flex gap-2">
              {bookmarks.length > 0 && (
                <select 
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  value={bookmarks.includes(currentPage) ? currentPage : ""}
                  className={`px-3 py-2 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`}
                >
                  <option value="" disabled>Bookmarks</option>
                  {bookmarks.map(page => (
                    <option key={page} value={page}>Page {page}</option>
                  ))}
                </select>
              )}

              <button
                onClick={() => setZoomLevel((prev) => Math.min(prev + 0.1, 2))}
                className={`px-3 py-2 rounded flex items-center gap-2 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"}`}
              >
                <FaSearchPlus /> Zoom In
              </button>
              
              <button
                onClick={() => setZoomLevel(1)}
                className={`px-3 py-2 rounded flex items-center gap-2 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"}`}
              >
                100%
              </button>
              
              <button
                onClick={() => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))}
                className={`px-3 py-2 rounded flex items-center gap-2 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"}`}
              >
                <FaSearchMinus />