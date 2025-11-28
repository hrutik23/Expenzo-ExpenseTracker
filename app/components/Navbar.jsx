"use client";

import { LogOut, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { performLogout } from "../redux/actions/authActions";

export default function Navbar({ toggleSidebar }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    await dispatch(performLogout());
    router.push("/auth/login");
  };

  return (
    <div className="w-full h-16 bg-white flex justify-between items-center px-4 border-b border-gray-400">

      <Menu
        className="md:hidden cursor-pointer text-purple-700"
        size={28}
        onClick={toggleSidebar}
      />

      <div className="flex items-center gap-4 ml-auto">
        {user && (
          <span className="text-gray-700 font-medium hidden sm:block">
            Welcome, {user.fullName}
          </span>
        )}

        <LogOut
          className="text-red-500 cursor-pointer"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}
