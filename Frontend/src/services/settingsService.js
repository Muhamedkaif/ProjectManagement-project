import api from "./api";

const settingsService = {
  async getProfile() {
    const response = await api.get("/users/profile");
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put("/users/profile", data);
    return response.data;
  },

  async deleteAccount() {
    const response = await api.delete("/users/profile");
    return response.data;
  }
};

export default settingsService;