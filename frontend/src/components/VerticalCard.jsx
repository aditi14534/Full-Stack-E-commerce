import React, { useContext } from "react";
import scrollTop from "../helpers/scrollTop";
import displayINRCurrency from "../helpers/displayCurrency";
import Context from "../context";
import addToCart from "../helpers/addToCart";
import { Link } from "react-router-dom";

const VerticalCard = ({ loading, data = [] }) => {
  const loadingList = new Array(13).fill(null);
  const { fetchUserAddToCart } = useContext(Context);

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,300px))] justify-center md:justify-between md:gap-4 transition-all">
      {loading
        ? loadingList.map((_, index) => {
            return (
              <div
                key={index}
                className="w-full min-w-[280px]  md:min-w-[320px] max-w-[280px] md:max-w-[320px]  bg-white rounded-sm shadow"
              >
                <div className="bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center animate-pulse"></div>
                <div className="p-4 grid gap-3">
                  <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200"></h2>
                  <p className="capitalize text-slate-500 p-1 animate-pulse rounded-full bg-slate-200  py-2"></p>
                  <div className="flex gap-3">
                    <p className="text-red-600 font-medium p-1 animate-pulse rounded-full bg-slate-200 w-full  py-2"></p>
                    <p className="text-slate-500 line-through p-1 animate-pulse rounded-full bg-slate-200 w-full  py-2"></p>
                  </div>
                  <button className="text-sm  text-white px-3  rounded-full bg-slate-200  py-2 animate-pulse"></button>
                </div>
              </div>
            );
          })
        : data.map((product) => {
            return (
              <Link
                key={product?._id || Math.random()}
                to={"/product/" + product?._id}
                className="w-full min-w-[280px]  md:min-w-[300px] max-w-[280px] md:max-w-[300px]  bg-white rounded-sm shadow "
                onClick={scrollTop}
              >
                <div className="bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center">
                  {/* ✅ Fix: Check for both existence and non-empty string */}
                  {product?.productImage?.[0] &&
                  product.productImage[0].trim() !== "" ? (
                    <img
                      src={product.productImage[0]}
                      alt={product?.productName || "product"}
                      className="object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply"
                      onError={(e) => {
                        // ✅ Fix: Handle image load errors
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}

                  {/* ✅ Fix: Fallback div instead of broken image */}
                  {(!product?.productImage?.[0] ||
                    product.productImage[0].trim() === "") && (
                    <div className="flex flex-col items-center justify-center h-full w-full text-slate-400">
                      <svg
                        className="w-16 h-16 mb-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs">No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-4 grid gap-3">
                  <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black">
                    {product?.productName}
                  </h2>
                  <p className="capitalize text-slate-500">
                    {product?.category}
                  </p>
                  <div className="flex gap-3">
                    <p className="text-indigo-800 font-medium">
                      {displayINRCurrency(product?.sellingPrice)}
                    </p>
                    <p className="text-slate-500 line-through">
                      {displayINRCurrency(product?.price)}
                    </p>
                  </div>
                  <button
                    className="text-sm bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-3 py-1 rounded-full transition-all mt-2 flex-shrink-0"
                    onClick={(e) => handleAddToCart(e, product?._id)}
                  >
                    Add to Cart
                  </button>
                </div>
              </Link>
            );
          })}
    </div>
  );
};

export default VerticalCard;
