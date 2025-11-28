"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/app/redux/actions/authActions";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, token } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (token) {
      setSuccessMessage("Login successful! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    }
  }, [token, router]);

  const handleLogin = async () => {
    setSuccessMessage("");
    setFormError("");

    if (!email || !password) {
      setFormError("Please fill all details");
      return;
    }

    await dispatch(login({ email, password }));
  };

  return (
    <div className="max-w-sm mx-auto my-50 p-6 shadow-lg rounded bg-purple-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-800">Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`w-full p-2 mb-5 border rounded bg-white shadow-lg text-purple-900 focus:outline-none ${error || formError ? "border-red-500" : "border-purple-300 focus:border-purple-600"
          }`}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={`w-full p-2 mb-3 border rounded bg-white shadow-lg text-purple-900 focus:outline-none ${error || formError ? "border-red-500" : "border-purple-300 focus:border-purple-600"
          }`}
        required
      />

      {formError && <p className="text-red-500 mb-3">{formError}</p>}
      {error && <p className="text-red-500 mb-3">{error}</p>}
      {successMessage && (
        <p className="text-purple-600 mb-6 font-medium">{successMessage}</p>
      )}

      <button
        onClick={handleLogin}
        className={`w-full p-2 mt-3 rounded text-white cursor-pointer ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-500"
          }`}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p
        className="mt-4 text-center text-purple-700 underline cursor-pointer"
        onClick={() => router.push("/auth/forgot-password")}
      >
        Forgot Password?
      </p>

      <p className="mt-3 text-center text-gray-600 cursor-pointer">
        Don't have an account?{" "}
        <a href="/auth/register" className="text-purple-700 underline">
          Register
        </a>
      </p>
    </div>
  );
}
