import React, { useState, useEffect } from "react";
import PasswordGenerator from "./PasswordGenrator";
import "../styles/PasswordManager.css"; // Assuming you have some styles in PasswordManager.css
const PasswordManager = () => {
  const [credentials, setCredentials] = useState(() => {
    const saved = localStorage.getItem("passwords");
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    website: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGeneratePassword = (newPassword) => {
    setFormData((prev) => ({ ...prev, password: newPassword }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = { ...formData, id: Date.now() };
    const updated = [...credentials, newEntry];
    setCredentials(updated);
    localStorage.setItem("passwords", JSON.stringify(updated));
    setFormData({ website: "", username: "", password: "" });
  };

  const deleteEntry = (id) => {
    const updated = credentials.filter((entry) => entry.id !== id);
    setCredentials(updated);
    localStorage.setItem("passwords", JSON.stringify(updated));
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
            <div key={entry.id} className="credential">
              <strong>{entry.website}</strong>
              <p>Username: {entry.username}</p>
              <p>Password: {entry.password}</p>
              <button onClick={() => deleteEntry(entry.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PasswordManager;
