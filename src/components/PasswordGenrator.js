import React from "react";

const generateRandomPassword = (length = 12) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
};

const PasswordGenerator = ({ onGenerate }) => {
  const handleClick = async () => {
    const newPass = generateRandomPassword();
    onGenerate(newPass); // still send to parent component (for display)

    // Send to backend
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const response = await fetch("http://localhost:5000/api/passwords/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          password: newPass,
          userId,
          website: "Generated Password", // optional metadata
          username: "N/A"
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Password saved to backend successfully!");
      } else {
        alert(data.error || "Failed to save password.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the password.");
    }
  };

  return (
    <button type="button" onClick={handleClick} className="generate-btn">
      Generate Strong Password
    </button>
  );
};

export default PasswordGenerator;
