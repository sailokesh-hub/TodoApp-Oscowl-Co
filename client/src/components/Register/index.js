import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";
import Cookies  from 'js-cookie';

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;

    const response = await fetch("http://localhost:3001/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json(); // Parse JSON response
    console.log(data)
    if (response.ok) {
        Cookies.set('jwt_token', data.jwtToken, {
            expires: 1, // Cookie expires in 1 day
            secure: process.env.NODE_ENV === 'production', // Set to true if in production to use HTTPS
            sameSite: 'Strict', // Helps prevent CSRF
          });
      setSuccessMessage("User registered successfully!");
      setErrorMessage("");
      setFormData({ name: "", email: "", password: "" });
      navigate("/todoApp"); // Redirect to home
    } else {
      setErrorMessage(data.error || data.message || "Something went wrong!");
      setSuccessMessage("");
    }
  };

  return (
    <div className="register">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit">Register</button>
        <Link to="/login">
          <span>Login</span>
        </Link>
      </form>
    </div>
  );
};

export default Register;
