import React, { useState, useRef, useEffect } from "react";
import { CgClose } from "react-icons/cg";
import productCategory from "../helpers/productCategory";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../helpers/uploadImage";
import DisplayImage from "./DisplayImage";
import { MdDelete } from "react-icons/md";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const UploadProduct = ({ onClose, fetchData, position }) => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
  });

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");
  const cardRef = useRef(null);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadImageCloudinary = await uploadImage(file);
    setData((prev) => ({
      ...prev,
      productImage: [...prev.productImage, uploadImageCloudinary.url],
    }));
  };

  const handleDeleteProductImage = (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);
    setData((prev) => ({ ...prev, productImage: [...newProductImage] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(SummaryApi.uploadProduct.url, {
      method: SummaryApi.uploadProduct.method,
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (responseData.success) {
      toast.success(responseData?.message);
      onClose();
      fetchData();
    } else {
      toast.error(responseData?.message || "Failed to upload product");
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

  // Positioning style (same as AdminEditProduct)
  const cardStyle = position
    ? {
        position: "fixed",
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999,
        transform: "translateY(-100%)",
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
        style={cardStyle}
        className="bg-white rounded-xl shadow-2xl border border-gray-200 
                   w-96 max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="font-semibold text-lg text-indigo-600">
            Upload Product
          </h2>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            <CgClose size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4"
          onSubmit={handleSubmit}
        >
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="productName"
              placeholder="Enter product name"
              value={data.productName}
              onChange={handleOnChange}
              required
              className="w-full p-2.5 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-indigo-400 focus:border-transparent 
                         outline-none text-sm"
            />
          </div>

          {/* Brand Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand Name
            </label>
            <input
              type="text"
              name="brandName"
              placeholder="Enter brand name"
              value={data.brandName}
              onChange={handleOnChange}
              required
              className="w-full p-2.5 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-indigo-400 focus:border-transparent 
                         outline-none text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={data.category}
              onChange={handleOnChange}
              required
              className="w-full p-2.5 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-indigo-400 focus:border-transparent 
                         outline-none text-sm bg-white"
            >
              <option value="">Select Category</option>
              {productCategory.map((el, index) => (
                <option value={el.value} key={el.value + index}>
                  {el.label}
                </option>
              ))}
            </select>
          </div>

          {/* Product Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>
            <label htmlFor="uploadImageInput" className="cursor-pointer">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 
                            hover:border-indigo-400 hover:bg-gray-50 transition-colors
                            flex flex-col items-center justify-center h-24"
              >
                <FaCloudUploadAlt className="text-gray-400 text-xl mb-1" />
                <span className="text-xs text-gray-500">Upload Images</span>
                <input
                  type="file"
                  id="uploadImageInput"
                  className="hidden"
                  onChange={handleUploadProduct}
                />
              </div>
            </label>

            {data?.productImage[0] && (
              <div className="flex flex-wrap gap-2 mt-3">
                {data.productImage.map((el, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={el}
                      alt={`Product ${index + 1}`}
                      className="w-16 h-16 object-cover border border-gray-200 rounded-lg 
                                 cursor-pointer hover:opacity-75 transition-opacity"
                      onClick={() => {
                        setOpenFullScreenImage(true);
                        setFullScreenImage(el);
                      }}
                    />
                    <button
                      type="button"
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1
                                 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteProductImage(index)}
                    >
                      <MdDelete size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price & Selling Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                name="price"
                placeholder="₹ Price"
                value={data.price}
                onChange={handleOnChange}
                required
                className="w-full p-2.5 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-indigo-400 focus:border-transparent 
                           outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selling Price
              </label>
              <input
                type="number"
                name="sellingPrice"
                placeholder="₹ Selling Price"
                value={data.sellingPrice}
                onChange={handleOnChange}
                required
                className="w-full p-2.5 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-indigo-400 focus:border-transparent 
                           outline-none text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={data.description}
              onChange={handleOnChange}
              placeholder="Enter product description"
              className="w-full p-2.5 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-indigo-400 focus:border-transparent 
                         outline-none resize-none text-sm"
            ></textarea>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium
                       hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400
                       transition-all duration-200 shadow-sm"
          >
            Upload Product
          </button>
        </div>
      </div>

      {/* Full screen image */}
      {openFullScreenImage && (
        <DisplayImage
          onClose={() => setOpenFullScreenImage(false)}
          imgUrl={fullScreenImage}
        />
      )}

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

export default UploadProduct;
