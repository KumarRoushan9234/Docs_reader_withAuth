import { create } from "zustand";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Change to your FastAPI backend URL

const useApiStore = create((set, get) => ({
  // Available Models
  availableModels: [],
  selectedModel: null,

  // Extracted Docs
  extractedDocs: {},
  summary: "",
  keyPoints: [],

  // Chat History
  chatHistory: [],

  // Quiz Data
  quizData: null,

  // ------------ API Actions ------------ //

  // Get Available Models
  fetchModels: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/models`);
      set({
        availableModels: response.data.available_models,
        selectedModel: response.data.selected_model,
      });
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  },

  // Change LLM Model
  changeModel: async (user_id, model_id) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/change-model`, {
        user_id,
        model_id,
      });

      set({ selectedModel: response.data.user_details.model_id });
      return response.data;
    } catch (error) {
      console.error("Error changing model:", error);
      throw error;
    }
  },

  // Delete Model
  deleteModel: async (user_id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete-model`, {
        data: { user_id },
      });

      set({ selectedModel: null });
      return response.data;
    } catch (error) {
      console.error("Error deleting model:", error);
      throw error;
    }
  },

  // Extract Text from Documents
  extractText: async (user_id, docs) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/extract`, { user_id, docs });

      set({
        extractedDocs: docs,
        summary: response.data.summary,
        keyPoints: response.data.key_points,
      });

      return response.data;
    } catch (error) {
      console.error("Error extracting text:", error);
      throw error;
    }
  },

  // Chat with Documents
  chatWithDocuments: async (user_id, query) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, { user_id, query });

      const chatEntry = { question: query, answer: response.data.response };
      set((state) => ({
        chatHistory: [...state.chatHistory, chatEntry],
      }));

      return response.data.response;
    } catch (error) {
      console.error("Error chatting with documents:", error);
      throw error;
    }
  },

  // Generate Quiz
  generateQuiz: async (user_id, num_questions = 10) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/quiz`, {
        user_id,
        num_questions,
      });

      set({ quizData: JSON.parse(response.data.quiz) });
      return response.data.quiz;
    } catch (error) {
      console.error("Error generating quiz:", error);
      throw error;
    }
  },
}));

export default useApiStore;
