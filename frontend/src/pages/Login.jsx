import React, { useContext, useState } from "react";
import avatar_icon from "../assest/avatar_icon.png";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import Context from "../context";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataResponse = await fetch(SummaryApi.signIn.url, {
      method: SummaryApi.signIn.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      toast.success(dataApi.message);
      navigate("/");
      fetchUserDetails();
      fetchUserAddToCart();
    }

    if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  console.log("data login", data);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
      <div className="w-full max-w-sm flex flex-col items-center justify-center p-4">
        {/* Login Card */}
        <div className="w-full bg-black/40 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6">
          {/* Avatar Icon */}
          <div className="w-20 h-20 mx-auto mb-4">
            <img
              src={avatar_icon}
              alt="login icon"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-xl font-bold text-white text-center mb-5">
            Login
          </h2>

          {/* Form */}
          <form className="space-y-3" onSubmit={handleSubmit}>
            {/* Email */}
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={data.email}
              onChange={handleOnChange}
              required
              className="w-full px-3 py-2 rounded-lg bg-black/30 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={data.password}
                onChange={handleOnChange}
                required
                className="w-full px-3 py-2 rounded-lg bg-black/30 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <span
                className="absolute right-3 top-2 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Button */}
            <button className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 transition mt-2">
              Login
            </button>
          </form>

          {/* Footer */}
          <p className="mt-5 text-gray-400 text-xs text-center">
            Don’t have an account?{" "}
            <Link
              to="/sign-up"
              className="text-purple-400 hover:underline font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
