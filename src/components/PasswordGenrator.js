import React from "react";
// import "../styles/PasswordGenerator.css"; // Assuming you have some styles in PasswordGenerator.css
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
  const handleClick = () => {
    const newPass = generateRandomPassword();
    onGenerate(newPass);
  };

  return (
    <button type="button" onClick={handleClick} className="generate-btn">
      Generate Strong Password
    </button>
  );
};

export default PasswordGenerator;
