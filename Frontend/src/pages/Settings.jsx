import React, { useEffect, useState } from "react";
import settingsService from "../services/settingsService";

const Settings = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);


  const handleSave = async () => {
    try {
      setLoading(true);

      await settingsService.updateProfile({
        name: user.name,
        email: user.email,
      });

      alert("Profile updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmed) return;

    try {
      await settingsService.deleteAccount();

      localStorage.removeItem("token");

      window.location.href = "/login";
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Failed to delete account");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">
          Profile Settings
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name
            </label>

            <input
              type="text"
              value={user.name}
              onChange={(e) =>
                setUser({
                  ...user,
                  name: e.target.value,
                })
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={user.email}
              onChange={(e) =>
                setUser({
                  ...user,
                  email: e.target.value,
                })
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-3">
          Danger Zone
        </h2>

        <p className="text-gray-600 mb-6">
          Permanently delete your account and all associated projects
          and tasks. This action cannot be undone.
        </p>

        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;