import React, { useState } from "react";
import "../styles/AuthForm.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("userName", data.user.name);
          alert("✅ Login successful!");
          window.location.href = "/"; // Navigate to dashboard or homepage
        } else {
          alert("✅ Signup successful! Please log in.");
          setIsLogin(true); // Switch to login form
        }
      } else {
        alert(data.msg || "❌ Something went wrong.");
      }
    } catch (err) {
      alert("❌ Server error. Please try again later.");
    }
  };

  return (
    <div className="form-container">
      <h2>{isLogin ? "Login" : "Signup"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{isLogin ? "Login" : "Signup"}</button>
      </form>
      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <span className="toggle" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Signup" : "Login"}
        </span>
      </p>
    </div>
  );
};

export default AuthForm;
