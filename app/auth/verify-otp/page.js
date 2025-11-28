"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/app/redux/apiClient";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setMessage("");
    if (!email || !otp) {
      setMessage("Please enter OTP and email.");
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.post("/api/auth/verify-otp", { email, otp });
      if (res.data.success) {
        setMessage("Verified. Redirecting to login...");
        setTimeout(() => router.push("/auth/login"), 1000);
      } else {
        setMessage(res.data.message || "Verification failed");
      }
    } catch (err) {
      setMessage("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setMessage("");
    try {
      const res = await apiClient.post("/api/auth/resend-otp", { email });
      setMessage(res.data.message || (res.data.success ? "OTP resent" : "Failed"));
    } catch (err) {
      setMessage("Failed to resend OTP");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-50 p-6 rounded-md shadow-md bg-purple-100">
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">Verify OTP</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-3 bg-white border border-purple-300 shadow-md rounded focus:border-purple-600 focus:outline-none"
      />

      <input
        type="text"
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full p-2 mb-3 bg-white border border-purple-300 shadow-md rounded focus:border-purple-600 focus:outline-none"
      />

      {message && <p className="text-red-500 mb-3">{message}</p>}

      <button
        onClick={handleVerify}
        className={`w-full p-2 rounded text-white cursor-pointer ${loading ? "bg-purple-400" : "bg-purple-500"}`}
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <button
        onClick={handleResend}
        className="w-full mt-3 p-2 rounded cursor-pointer border border-purple-400 bg-purple-200"
      >
        Resend OTP
      </button>

      <p className="mt-4 text-center">
        Already verified? <a href="/auth/login" className="text-purple-500 cursor-pointer">Login</a>
      </p>
    </div>
  );
}
