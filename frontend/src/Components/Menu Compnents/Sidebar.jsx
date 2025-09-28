import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdPeople,MdBorderColor,MdInventory2 } from "react-icons/md";
import { GrInProgress } from "react-icons/gr";
import {
  FaBars,
  FaHome,
  FaClipboardList,
  FaCarAlt,
  FaFileAlt,
  FaTasks,
} from "react-icons/fa";
import { images } from "../../assets/Images/images";

export default function Sidebar({ userType, toggleSidebar }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth < 1280 && !isCollapsed) {
  //       setIsCollapsed(true);
  //       toggleSidebar(true);
  //     } else if (window.innerWidth >= 1280 && isCollapsed) {
  //       toggleSidebar(!isCollapsed); 
  //     }
  //   };

  //   window.addEventListener("resize", handleResize);
  //   handleResize(); // Run once on mount

  //   return () => window.removeEventListener("resize", handleResize);
  // }, [isCollapsed, toggleSidebar]);

  const menuItems = [
    { path: "/advisor/dashboard", label: "Home", icon: <FaHome />, condition: userType === "advisor"  },
    { path: "/advisor/service-inventories", label: "Service Inventory", icon: <MdInventory2 />, condition: userType === "advisor" },
    { path: "/advisor/ongoing-services", label: "Ongoing Services", icon: < GrInProgress />, condition: userType === "advisor" },
    { path: "/admin/dashboard", label: "Home", icon: <FaHome /> , condition: userType === "admin" },
    { path: "/admin/advisors", label: "Advisors", icon: <MdBorderColor />, condition: userType === "admin" },
    { path: "/admin/customers", label: "Customers", icon: <MdPeople />, condition: userType === "admin" },
    { path: "/admin/vehicles", label: "vehicles", icon: <FaCarAlt />, condition: userType === "admin" },
    { path: "/advisor/service-records", label: "Service Records", icon: <FaFileAlt />,condition: userType === "advisor" },
    { path: "/admin/service-records", label: "Service Records", icon: <FaFileAlt />,condition: userType === "admin" },
    { path: "/admin/service-inventory", label: "Service Inventory", icon: <FaTasks />, condition: userType === "admin" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 h-full bg-white shadow-xl p-5 flex flex-col z-50 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        {!isCollapsed && (
          <span className="text-lg font-bold text-black transition-all duration-300 w-full">
            <img src={images.Logo} alt="Logo" style={{ height: "80px" }} />
          </span>
        )}
        <button
          onClick={() => {
            setIsCollapsed(!isCollapsed);
            toggleSidebar(!isCollapsed);
          }}
          className="text-primary text-2xl"
        >
          <FaBars />
        </button>
      </div>

      <ul className="space-y-4">
        {menuItems.map(({ path, label, icon, condition }) =>
          condition !== false ? (
            <li key={path}>
              <Link
                to={path}
                className={`flex items-center space-x-3 p-3 rounded-md font-semibold text-black transition-all duration-300 ${
                  location.pathname.startsWith(path)
                    ? "bg-primary"
                    : "hover:bg-yellow-100"
                }`}
              >
                <span className="text-xl text-black">{icon}</span>
                {!isCollapsed && (
                  <span>
                    {label}
                  </span>
                )}
              </Link>
            </li>
          ) : null
        )}
      </ul>
    </nav>
  );
}
