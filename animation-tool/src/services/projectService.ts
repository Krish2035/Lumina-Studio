import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/projects';

export const projectService = {
  // Saves the current project state to MongoDB
  saveProject: async (projectData: any) => {
    try {
      const response = await axios.post(`${API_BASE}/save`, projectData);
      return response.data;
    } catch (error) {
      console.error("Error saving project:", error);
      throw error;
    }
  },

  // Fetches a specific project by ID
  getProject: async (id: string) => {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  }
};