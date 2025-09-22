import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import avatar_icon from "../assest/avatar_icon.png";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    profilePic: "",
  });

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // 🚀 Upload image to Cloudinary
  const handleUploadPic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoadingImage(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mern-product"); // <-- apna preset daalna
    formData.append("cloud_name", "dhtq1q8l4"); // <-- apna cloud name daalna

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dhtq1q8l4/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await res.json();
      if (result.secure_url) {
        setData((prev) => ({ ...prev, profilePic: result.secure_url }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Image upload failed!");
      }
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setLoadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password === data.confirmPassword) {
      const res = await fetch(SummaryApi.signUP.url, {
        method: SummaryApi.signUP.method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data), // ✅ ab yahan sirf Cloudinary ka URL jaayega
      });
      const resData = await res.json();

      if (resData.success) {
        toast.success(resData.message);
        navigate("/login");
      } else {
        toast.error(resData.message);
      }
    } else {
      toast.error("Passwords do not match");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
      <div className="w-full max-w-sm flex flex-col items-center justify-center p-4">
        {/* Signup Card */}
        <div className="w-full bg-black/40 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6">
          <h2 className="text-xl font-bold text-white text-center mb-5">
            Sign Up
          </h2>

          {/* Upload Avatar */}
          <div className="flex flex-col items-center mb-5">
            <label className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-purple-500/50 shadow-md cursor-pointer">
              <img
                src={data.profilePic || avatar_icon}
                alt="profile"
                className="w-full h-full object-cover"
              />
              <input
                type="file"
                className="hidden"
                onChange={handleUploadPic}
              />
            </label>
            {loadingImage && (
              <p className="text-xs text-yellow-400 mt-1">Uploading...</p>
            )}
            <p className="text-xs text-purple-300 mt-2 cursor-pointer">
              Upload Photo
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name */}
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              value={data.name}
              onChange={handleOnChange}
              required
              className="w-full px-3 py-2 rounded-lg bg-black/30 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />

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

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleOnChange}
                required
                className="w-full px-3 py-2 rounded-lg bg-black/30 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <span
                className="absolute right-3 top-2 text-gray-400 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Button */}
            <button
              disabled={loadingImage}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
            >
              {loadingImage ? "Uploading..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-5 text-gray-400 text-xs text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-400 hover:underline font-semibold"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
