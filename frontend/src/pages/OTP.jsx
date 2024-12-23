import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const OTP = () => {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpToken = localStorage.getItem("otpToken");

    if (!otpToken) {
      toast.error("OTP token is missing. Please try again.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/password-reset/verify-otp",
        {
          otp,
          otpToken,
          password,
        }
      );

      toast.success(response.data.message);
      localStorage.removeItem("otpToken");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify OTP.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4 rounded"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h4 className="text-center mb-3 text-primary">Verify OTP</h4>
        <p className="text-center text-secondary">
          Enter your OTP and set a new password to continue.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="otp" className="form-label">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              className="form-control"
              placeholder="Enter OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              New Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter New Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 text-uppercase"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTP;
