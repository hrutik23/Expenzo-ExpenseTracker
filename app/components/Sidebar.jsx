"use client";

import Link from 'next/link'
import { useState } from 'react';
import { Home, Users, Settings } from "lucide-react";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const [active, setActive] = useState("dashboard");

  const menuItems = [
    { name: "Dashboard", icon: <Home size={18} />, href: "/dashboard" },
    { name: "Reports", icon: <Users size={18} />, href: "/dashboard/reports" },
    { name: "Transactions", icon: <Settings size={18} />, href: "/dashboard/transactions" },
    { name: "Budgets", icon: <Home size={18} />, href: "/dashboard/budgets" }
  ];

  return (
    <div
      className={`
        fixed md:static top-0 left-0 h-full w-64 bg-white border-r border-gray-400 p-4
        transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      <button
        className="md:hidden mb-4 text-red-600 font-bold"
        onClick={closeSidebar}
      >
        X
      </button>

      <h2 className='text-3xl font-bold pl-2 mb-5 text-purple-700'>Expenzo</h2>

      <ul className='flex flex-col gap-2 list-none'>
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            onClick={() => {
              setActive(item.name.toLowerCase());
              closeSidebar();
            }}
            className={`flex items-center gap-3 p-2 cursor-pointer rounded-md ${
              active === item.name.toLowerCase()
                ? "bg-purple-300"
                : "hover:bg-purple-500 hover:text-white"
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
