import { create } from "zustand";
import axios from "axios";

// Base URL for FastAPI backend
const BASE_URL = "http://127.0.0.1:8000";

const useAppStore = create((set, get) => ({
  selectedModel: "llama3-8b-8192",
  availableModels: [],
  documents: {},
  summary: "",
  keyPoints: [],
  chatHistory: [],
  quiz: [],
  loading: false,
  error: null,

  // Fetch Available Models
  fetchModels: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/models`);
      set({ availableModels: response.data.available_models, selectedModel: response.data.selected_model });
    } catch (error) {
      console.error("Error fetching models:", error);
      set({ error: "Failed to load models." });
    }
  },

  // Change Selected Model
  changeModel: async (modelId) => {
    try {
      await axios.post(`${BASE_URL}/change-model`, { model_id: modelId });
      set({ selectedModel: modelId });
    } catch (error) {
      console.error("Error changing model:", error);
      set({ error: "Failed to change model." });
    }
  },

  // Extract and Store Documents
  extractDocuments: async (documents) => {
    set({ loading: true });
    try {
      const response = await axios.post(`${BASE_URL}/extract`, { documents });
      set({
        documents,
        summary: response.data.summary,
        keyPoints: response.data.key_points,
        loading: false,
      });
    } catch (error) {
      console.error("Error extracting documents:", error);
      set({ error: "Failed to extract documents.", loading: false });
    }
  },

  // Chat with Extracted Documents
  chatWithDocs: async (query) => {
    set({ loading: true });
    try {
      const response = await axios.post(`${BASE_URL}/chat`, { query });
      const chatMessage = { query, response: response.data.response };
      set((state) => ({
        chatHistory: [...state.chatHistory, chatMessage],
        loading: false,
      }));
    } catch (error) {
      console.error("Error chatting with documents:", error);
      set({ error: "Failed to get a response.", loading: false });
    }
  },

  // Generate Quiz
  generateQuiz: async (numQuestions = 5) => {
    set({ loading: true });
    try {
      const response = await axios.post(`${BASE_URL}/quiz`, { num_questions: numQuestions });
      set({ quiz: JSON.parse(response.data.quiz), loading: false });
    } catch (error) {
      console.error("Error generating quiz:", error);
      set({ error: "Failed to generate quiz.", loading: false });
    }
  },

  // Reset Error
  resetError: () => set({ error: null }),
}));

export default useAppStore;
