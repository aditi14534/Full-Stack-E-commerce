import React, { useState, useRef, useEffect } from "react";
import { CgClose } from "react-icons/cg";
import productCategory from "../helpers/productCategory";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../helpers/uploadImage";
import DisplayImage from "./DisplayImage";
import { MdDelete } from "react-icons/md";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const AdminEditProduct = ({ onClose, productData, fetchdata, position }) => {
  const [data, setData] = useState({
    ...productData,
    productName: productData?.productName,
    brandName: productData?.brandName,
    category: productData?.category,
    productImage: productData?.productImage || [],
    description: productData?.description,
    price: productData?.price,
    sellingPrice: productData?.sellingPrice,
  });
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");
  const cardRef = useRef(null);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => ({ ...preve, [name]: value }));
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    const uploadImageCloudinary = await uploadImage(file);
    setData((preve) => ({
      ...preve,
      productImage: [...preve.productImage, uploadImageCloudinary.url],
    }));
  };

  const handleDeleteProductImage = async (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);
    setData((preve) => ({ ...preve, productImage: [...newProductImage] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(SummaryApi.updateProduct.url, {
      method: SummaryApi.updateProduct.method,
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (responseData.success) {
      toast.success(responseData?.message);
      onClose();
      fetchdata();
    }

    if (responseData.error) {
      toast.error(responseData?.message);
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
        transform: "translateY(-100%)", // float above the clicked element
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
        className="bg-white rounded-xl shadow-2xl border border-gray-200 w-96 max-h-[80vh] flex flex-col"
        style={cardStyle}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="font-semibold text-lg text-indigo-600">
            Edit Product
          </h2>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            <CgClose size={20} />
          </button>
        </div>

        {/* Form - Scrollable */}
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
              placeholder="Enter product name"
              name="productName"
              value={data.productName}
              onChange={handleOnChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-indigo-400 focus:border-transparent 
                         outline-none text-sm"
              required
            />
          </div>

          {/* Brand Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand Name
            </label>
            <input
              type="text"
              placeholder="Enter brand name"
              value={data.brandName}
              name="brandName"
              onChange={handleOnChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-indigo-400 focus:border-transparent 
                         outline-none text-sm"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              required
              value={data.category}
              name="category"
              onChange={handleOnChange}
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

            {/* Upload Area */}
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

            {/* Uploaded Images */}
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

          {/* Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                placeholder="₹ Price"
                value={data.price}
                name="price"
                onChange={handleOnChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-indigo-400 focus:border-transparent 
                           outline-none text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selling Price
              </label>
              <input
                type="number"
                placeholder="₹ Selling Price"
                value={data.sellingPrice}
                name="sellingPrice"
                onChange={handleOnChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-indigo-400 focus:border-transparent 
                           outline-none text-sm"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Enter product description"
              rows={3}
              onChange={handleOnChange}
              name="description"
              value={data.description}
              className="w-full p-2.5 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-indigo-400 focus:border-transparent 
                         outline-none text-sm resize-none"
            />
          </div>
        </form>

        {/* Footer with Submit Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium
                       hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400
                       transition-all duration-200 shadow-sm"
          >
            Update Product
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

export default AdminEditProduct;
