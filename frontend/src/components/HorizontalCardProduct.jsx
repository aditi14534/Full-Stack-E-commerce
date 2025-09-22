import React, { useContext, useEffect, useRef, useState } from "react";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import displayINRCurrency from "../helpers/displayCurrency";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import addToCart from "../helpers/addToCart";
import Context from "../context";

const HorizontalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(13).fill(null);

  const scrollElement = useRef();

  const { fetchUserAddToCart } = useContext(Context);

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const fetchData = async () => {
    setLoading(true);
    const categoryProduct = await fetchCategoryWiseProduct(category);
    setLoading(false);

    console.log("horizontal data", categoryProduct.data);
    setData(categoryProduct?.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 my-6 relative">
      <h2 className="text-2xl font-semibold py-4">{heading}</h2>

      {/* Scrollable list */}
      <div
        className="flex items-center gap-4 md:gap-6 overflow-x-scroll scrollbar-hide transition-all scroll-smooth"
        ref={scrollElement}
      >
        {loading
          ? loadingList.map((_, index) => {
              return (
                <div
                  key={index}
                  className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-sm shadow flex"
                >
                  <div className="bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px] animate-pulse flex justify-center items-center"></div>
                  <div className="p-4 flex flex-col justify-between w-full">
                    <div className="space-y-2">
                      <h2 className="font-medium text-base md:text-lg bg-slate-200 animate-pulse p-1 rounded-full h-5"></h2>
                      <p className="bg-slate-200 animate-pulse rounded-full p-1 h-4"></p>
                      <div className="flex gap-3">
                        <p className="p-1 bg-slate-200 animate-pulse rounded-full h-4 w-16"></p>
                        <p className="p-1 bg-slate-200 animate-pulse rounded-full h-4 w-16"></p>
                      </div>
                    </div>
                    <button className="text-sm bg-slate-200 animate-pulse rounded-full h-8 mt-2"></button>
                  </div>
                </div>
              );
            })
          : data.map((product, index) => {
              return (
                <Link
                  key={index}
                  to={"product/" + product?._id}
                  className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-sm shadow flex"
                >
                  <div className="bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px] flex justify-center items-center">
                    <img
                      src={product.productImage[0]}
                      className="object-contain h-full w-full hover:scale-110 transition-all mix-blend-multiply"
                      alt={product?.productName}
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between w-full overflow-hidden">
                    <div className="space-y-1">
                      <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black">
                        {product?.productName}
                      </h2>
                      <p className="capitalize text-slate-500 text-sm">
                        {product?.category}
                      </p>
                      <div className="flex gap-3 items-center">
                        <p className="text-indigo-800 font-medium text-sm">
                          {displayINRCurrency(product?.sellingPrice)}
                        </p>
                        <p className="text-slate-500 line-through text-sm">
                          {displayINRCurrency(product?.price)}
                        </p>
                      </div>
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
    </div>
  );
};

export default HorizontalCardProduct;
