"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { register } from "@/app/redux/actions/authActions";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleRegister = async () => {
    setFormError("");
    setSuccessMessage("");

    if (!fullName || !email || !password) {
      setFormError("Please fill all details.");
      return;
    }

    if (!validateEmail(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters long.");
      return;
    }

    const res = await dispatch(register({ fullName, email, password }));

    if (res.payload?.success) {
      router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
    }

  };

  return (
    <div className="max-w-sm mx-auto mt-50 p-6 rounded-md shadow-md bg-purple-100">
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">Register</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full p-2 mb-3 border border-purple-300 shadow-md rounded bg-white focus:border-purple-600 focus:outline-none"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-3 border border-purple-300 shadow-md rounded bg-white focus:border-purple-600 focus:outline-none"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-3 border border-purple-300 shadow-md rounded bg-white focus:border-purple-600 focus:outline-none"
      />

      {formError && <p className="text-red-500 mb-3">{formError}</p>}
      {!formError && error && <p className="text-red-500 mb-3">{error}</p>}

      {successMessage && (
        <p className="text-green-600 mb-3 font-medium">{successMessage}</p>
      )}

      <button
        onClick={handleRegister}
        className={`w-full p-2 rounded text-white cursor-pointer ${loading ? "bg-purple-400 cursor-not-allowed" : "bg-purple-500"
          }`}
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>

      <p className="mt-4 text-center text-gray-600">
        Already have an account?{" "}
        <a href="/auth/login" className="text-blue-500 underline text-purple-700 cursor-pointer">
          Login
        </a>
      </p>
    </div>
  );
}
