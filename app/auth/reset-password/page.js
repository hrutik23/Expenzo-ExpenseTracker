"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { resetPassword } from "@/app/redux/actions/authActions";

export default function ResetPassword() {
  const params = useSearchParams();
  const email = params.get("email");

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleReset = async () => {
    if (!otp || !newPassword) {
      setMsg("Please fill all fields");
      return;
    }

    setLoading(true);
    setMsg("");

    const res = await dispatch(resetPassword({ email, otp, newPassword }));

    if (res.meta.requestStatus === "fulfilled") {
      setMsg("Password reset successful! Redirecting...");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1200);
    } else {
      setMsg(res.payload);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto my-50 p-6 shadow bg-purple-100">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>

      <input 
        type="text" 
        placeholder="OTP"
        value={otp}
        onChange={e => setOtp(e.target.value)}
        className="w-full bg-white p-2 mb-3 border border-purple-300 rounded focus:border-purple-600 focus:outline-none"
      />

      <input 
        type="password" 
        placeholder="New Password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        className="w-full bg-white p-2 mb-3 border border-purple-300 rounded focus:border-purple-600 focus:outline-none"
      />

      {msg && <p className="text-center text-purple-700 mb-3">{msg}</p>}

      <button 
        onClick={handleReset} 
        className={`w-full p-2 rounded text-white cursor-pointer ${loading ? "bg-gray-400" : "bg-purple-600"}`}
        disabled={loading}
      >
        {loading ? "Resetting password..." : "Reset Password"}
      </button>
    </div>
  );
}
