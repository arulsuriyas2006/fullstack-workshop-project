import React, { useState, useEffect } from "react";
import PasswordGenerator from "./PasswordGenrator";
import "../styles/PasswordManager.css";

const PasswordManager = () => {
  const [credentials, setCredentials] = useState([]);
  const [formData, setFormData] = useState({
    website: "",
    username: "",
    password: "",
  });

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Fetch saved passwords from backend
  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/passwords/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setCredentials(data);
        } else {
          alert(data.error || "Failed to load passwords");
        }
      } catch (error) {
        console.error("Error fetching passwords:", error);
        alert("Server error fetching passwords.");
      }
    };

    if (userId && token) fetchPasswords();
  }, [userId, token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGeneratePassword = (newPassword) => {
    setFormData((prev) => ({ ...prev, password: newPassword }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      userId,
    };

    try {
      const res = await fetch("http://localhost:5000/api/passwords/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setCredentials((prev) => [...prev, data]); // add new entry
        setFormData({ website: "", username: "", password: "" });
      } else {
        alert(data.error || "Failed to save password");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Server error saving password.");
    }
  };

  const deleteEntry = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/passwords/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setCredentials((prev) => prev.filter((entry) => entry._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Server error deleting password.");
    }
  };

  return (
    <div className="password-box">
      <h2>Password Manager</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="website"
          placeholder="Website"
          value={formData.website}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username or Email"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <PasswordGenerator onGenerate={handleGeneratePassword} />
        <button type="submit">Save</button>
      </form>

      <div className="credentials-list">
        {credentials.length === 0 ? (
          <p>No passwords saved.</p>
        ) : (
          credentials.map((entry) => (
            <div key={entry._id} className="credential">
              <strong>{entry.website}</strong>
              <p>Username: {entry.username}</p>
              <p>Password: {entry.password}</p>
              <button onClick={() => deleteEntry(entry._id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PasswordManager;
