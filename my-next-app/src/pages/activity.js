"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ActivityPage() {
  const [models, setModels] = useState([]); // List of available models
  const [selectedModel, setSelectedModel] = useState(""); // Model selected by user
  const [currentModel, setCurrentModel] = useState(""); // Current model from backend
  const [loading, setLoading] = useState(false); // Track loading state

  // Fetch models from backend
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("http://localhost:8000/models");
        const data = await response.json();
        console.log("API Response:", data);

        if (data.available_models?.length > 0) {
          setModels(data.available_models);
          setCurrentModel(data.selected_model || "Not Set");
        } else {
          console.warn("No models found in API response");
        }
      } catch (error) {
        console.error("Error fetching models:", error);
        toast.error("Failed to load models.");
      }
    };

    fetchModels();
  }, []);

  // Handle model change
  const handleModelChange = async () => {
    if (!selectedModel) {
      toast.error("Please select a model first!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/change-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model_id: selectedModel }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to update model");

      setCurrentModel(selectedModel);
      toast.success(`Model changed to: ${selectedModel}`);
    } catch (error) {
      console.error("Error changing model:", error);
      toast.error("Failed to change model.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-5 text-gray-800">Change Model</h2>

        {/* Current Model Display */}
        <div className="bg-gray-200 p-3 rounded-md text-center mb-5 shadow-sm">
          <p className="text-gray-600 text-sm">Current Model:</p>
          <h3 className="text-lg font-medium text-gray-900">{currentModel}</h3>
        </div>

        {/* Model Selection */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm mb-2">Select a new model:</p>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {models.length === 0 ? (
              <p className="text-gray-500 text-sm">Loading models...</p>
            ) : (
              models.map((model, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedModel(model)}
                  className={`w-full p-2 text-sm rounded-lg transition-all duration-200 flex items-center justify-between ${
                    selectedModel === model
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {model}
                  {selectedModel === model && <span className="text-xs">✔</span>}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Change Model Button */}
        <button
          onClick={handleModelChange}
          className={`w-full p-3 rounded-lg text-white font-medium transition-all duration-200 ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
          }`}
          disabled={loading}
        >
          {loading ? "Changing..." : "Change Model"}
        </button>
      </div>
    </div>
  );
}
