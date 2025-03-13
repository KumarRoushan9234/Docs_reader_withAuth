import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      availableModels: {},
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
          localStorage.removeItem("user-storage"); // Clear persisted data
        } catch (error) {
          console.error("Error logging out:", error);
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

      UpdateDocs: async (docs) => {
        const user = get().user;
        if (!user) return console.error("🚨 No user found!");

        console.log("📤 Sending extracted text to /extract API...", {
          user_id: user.id,
          docs,
        });

        try {
          const response = await axios.post(`${API_BASE_URL}/extract`, {
            user_id: String(user.id), // Ensure it's a string
            docs: docs || {}, // Ensure docs is an object
          });

          console.log("✅ Extract API response:", response.data);

          set({
            extractedDocs: docs,
            summary: response.data.summary,
            keyPoints: response.data.key_points,
          });

          return response.data;
        } catch (error) {
          console.error("❌ Error extracting text:", error.response?.data || error);
          throw error;
        }
      },

      generateQuiz: async (numQuestions, userMessage) => {
        const user = get().user;
        if (!user) return console.error("No user found");

        try {
          const response = await axios.post(`${API_BASE_URL}/quiz`, {
            user_id: user.id,
            num_questions: numQuestions,
            user_message: userMessage,
          });

          set({ quizData: response.data.questions });
          return response.data;
        } catch (error) {
          console.error("Error generating quiz:", error);
          throw error;
        }
      },

      fetchChatHistory: async () => {
        const user = get().user;
        if (!user) return console.error("No user found");

        try {
          const response = await axios.get("/api/history");
          if (response.data.success) {
            set({ chatHistory: response.data.chatHistory });
          } else {
            console.error("Failed to fetch chat history:", response.data.message);
          }
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      },

      chatWithDocuments: async (query) => {
        const user = get().user;
        if (!user) return console.error("No user found");

        try {
          const response = await axios.post(`${API_BASE_URL}/chatdocs`, {
            user_id: user.id,
            query,
          });

          const chatEntry = { question: query, answer: response.data.response };

          set((state) => ({
            chatHistory: [...state.chatHistory, chatEntry],
          }));

          return response.data;
        } catch (error) {
          console.error("Error in chat:", error);
          throw error;
        }
      },
    }),
    {
      name: "user-storage", // Key in local storage
      getStorage: () => localStorage, // Use localStorage
    }
  )
);

export default useUserStore;
