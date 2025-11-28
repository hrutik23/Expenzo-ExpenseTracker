"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotPassword } from "@/app/redux/actions/authActions";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email) {
      setMsg("Please enter email");
      return;
    }

    setLoading(true);
    setMsg("");

    const res = await dispatch(forgotPassword(email));

    if (res.meta.requestStatus === "fulfilled") {
      setMsg("OTP sent! Redirecting...");
      setTimeout(() => {
        router.push(`/auth/reset-password?email=${email}`);
      }, 1200);
    } else {
      setMsg(res.payload);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto my-60 p-6 shadow-lg rounded bg-purple-100">
      <h2 className="text-xl text-center font-bold mb-4">Forgot Password</h2>

      <input 
        type="email" 
        placeholder="Enter Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full p-2 mb-4 bg-white border border-purple-300 rounded focus:border-purple-600 focus:outline-none"
      />

      {msg && <p className="text-center text-purple-700 mb-3">{msg}</p>}

      <button 
        onClick={handleSubmit} 
        className={`w-full p-2 rounded text-white cursor-pointer ${loading ? "bg-gray-400" : "bg-purple-600"}`}
        disabled={loading}
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
    </div>
  );
}
