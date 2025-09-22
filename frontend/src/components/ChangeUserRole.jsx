import React, { useState, useRef, useEffect } from "react";
import ROLE from "../common/role";
import { IoMdClose } from "react-icons/io";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const ChangeUserRole = ({
  name,
  email,
  role,
  userId,
  onClose,
  callFunc,
  position,
}) => {
  const [userRole, setUserRole] = useState(role);
  const cardRef = useRef(null);

  const handleOnChangeSelect = (e) => {
    setUserRole(e.target.value);
  };

  const updateUserRole = async () => {
    const fetchResponse = await fetch(SummaryApi.updateUser.url, {
      method: SummaryApi.updateUser.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userId,
        role: userRole,
      }),
    });

    const responseData = await fetchResponse.json();

    if (responseData.success) {
      toast.success(responseData.message);
      onClose();
      callFunc();
    } else {
      toast.error(responseData.message || "Failed to update role");
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Positioning style
  const cardStyle = position
    ? {
        position: "fixed",
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999,
        transform: "translateY(-100%)", // Card ko icon ke upar shift karne ke liye
        animation: "slideIn 0.2s ease-out",
      }
    : {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
      };

  return (
    <>
      {/* Transparent overlay */}
      <div className="fixed inset-0 z-40" onClick={onClose}></div>

      {/* Floating Card */}
      <div
        ref={cardRef}
        className="bg-white rounded-xl shadow-2xl border border-gray-200 w-80 p-6"
        style={cardStyle}
      >
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={onClose}
        >
          <IoMdClose size={20} />
        </button>

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-purple-600 mb-2">
            Change User Role
          </h2>
          <div className="w-12 h-0.5 bg-purple-200"></div>
        </div>

        {/* User Info - Compact */}
        <div className="space-y-3 mb-6">
          <div>
            <span className="text-sm font-medium text-gray-600">Name:</span>
            <p className="text-gray-800 font-medium">{name}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-600">Email:</span>
            <p className="text-gray-800">{email}</p>
          </div>
        </div>

        {/* Role Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Role:
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                       bg-white"
            value={userRole}
            onChange={handleOnChangeSelect}
          >
            {Object.values(ROLE).map((el) => (
              <option key={el} value={el}>
                {el}
              </option>
            ))}
          </select>
        </div>

        {/* Action Button */}
        <button
          className="w-full py-2.5 rounded-lg bg-purple-600 text-white text-sm font-medium
                     hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400
                     transition-all duration-200 shadow-sm"
          onClick={updateUserRole}
        >
          Update Role
        </button>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-100%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(-100%) scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default ChangeUserRole;
