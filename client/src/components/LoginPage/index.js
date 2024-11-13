import React, { useState } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setIsError(false);
    setErrorMsg("");
  };

  const onSubmitSuccess = (jwtToken) => {
    Cookies.set("jwt_token", jwtToken, {
      expires: 365,
      path: "/",
    });
    navigate("/");
  };

  const onSubmitFailure = (msg) => {
    setErrorMsg(msg);
    setIsError(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = formData;
    const apiUrl = "https://apis.ccbp.in/login"; // Replace with your API endpoint

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    };

    try {
      const response = await fetch(apiUrl, options);
      const data = await response.json();

      if (response.ok) {
        onSubmitSuccess(data.jwt_token);
      } else {
        onSubmitFailure(data.error_msg || "Invalid login credentials.");
      }
    } catch (error) {
      onSubmitFailure("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="login-bg-container">
      <h1>Todo Login Page</h1>
      <div className="form-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-heading">Login</h2>

          <div className="username-container">
            <label htmlFor="email" className="username-label">
              EMAIL
            </label>
            <br />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="user-name"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="username-container">
            <label htmlFor="password" className="username-label">
              PASSWORD
            </label>
            <br />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="user-name"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {isError && <p className="error-msg">{errorMsg}</p>}

          <button type="submit" className="login-btn">
            Login
          </button>

          <Link to="/register">
            <button style={{ backgroundColor: "lightblue" }}>Register</button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
