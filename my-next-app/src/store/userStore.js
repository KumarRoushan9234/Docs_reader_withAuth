import { create } from "zustand";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const useUserStore = create((set, get) => ({
  user: null,
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

  saveUser: (userData) => set({ user: userData }),

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      set({
        user: null,
        selectedModel: null,
        extractedDocs: {},
        summary: "",
        keyPoints: [],
        chatHistory: [],
        quizData: null,
      });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  },

  fetchUserDetails: async () => {
    const user = get().user;
    if (!user) return console.error("No user found");

    try {
      const response = await axios.get(`${API_BASE_URL}/user/${user.id}`);
      set({ user: response.data.user_details });
      return response.data;
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  },

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

  changeModel: async (model_id) => {
    const user = get().user;
    if (!user) return console.error("No user found");

    try {
      const response = await axios.post(`${API_BASE_URL}/change-model`, {
        user_id: user.id,
        model_id,
      });

      set({
        selectedModel: response.data.user_details.model_id,
        user: response.data.user_details,
      });

      return response.data;
    } catch (error) {
      console.error("Error changing model:", error);
      throw error;
    }
  },

  deleteModel: async () => {
    const user = get().user;
    if (!user) return console.error("No user found");

    try {
      const response = await axios.delete(`${API_BASE_URL}/delete-model`, {
        data: { user_id: user.id },
      });

      set({ selectedModel: null });
      return response.data;
    } catch (error) {
      console.error("Error deleting model:", error);
      throw error;
    }
  },

  extractText: async (docs) => {
    const user = get().user;
    if (!user) return console.error("No user found");

    try {
      const response = await axios.post(`${API_BASE_URL}/extract`, { user_id: user.id, docs });

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

  chatWithDocuments: async (query) => {
    const user = get().user;
    if (!user) return console.error("No user found");

    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, { user_id: user.id, query });

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

  generateQuiz: async (num_questions = 10) => {
    const user = get().user;
    if (!user) return console.error("No user found");

    try {
      const response = await axios.post(`${API_BASE_URL}/quiz`, {
        user_id: user.id,
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

export default useUserStore;
