import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SummaryApi from "../common";
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";
import displayINRCurrency from "../helpers/displayCurrency";
import VerticalCardProduct from "../components/VerticalCardProduct";
import CategroyWiseProductDisplay from "../components/CategoryWiseProductDisplay";
import addToCart from "../helpers/addToCart";
import Context from "../context";

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
  });
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const productImageListLoading = new Array(4).fill(null);
  const [activeImage, setActiveImage] = useState(""); // Keep as empty string initially

  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({
    x: 0,
    y: 0,
  });
  const [zoomImage, setZoomImage] = useState(false);

  const { fetchUserAddToCart } = useContext(Context);

  const navigate = useNavigate();

  const fetchProductDetails = async () => {
    setLoading(true);
    const response = await fetch(SummaryApi.productDetails.url, {
      method: SummaryApi.productDetails.method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        productId: params?.id,
      }),
    });
    setLoading(false);
    const dataReponse = await response.json();

    setData(dataReponse?.data);
    // ✅ Fix: Check if productImage exists and has items before setting activeImage
    if (dataReponse?.data?.productImage?.length > 0) {
      setActiveImage(dataReponse.data.productImage[0]);
    }
  };

  console.log("data", data);

  useEffect(() => {
    fetchProductDetails();
  }, [params]);

  const handleMouseEnterProduct = (imageURL) => {
    // ✅ Fix: Only set if imageURL is not empty
    if (imageURL) {
      setActiveImage(imageURL);
    }
  };

  const handleZoomImage = useCallback(
    (e) => {
      setZoomImage(true);
      const { left, top, width, height } = e.target.getBoundingClientRect();
      console.log("coordinate", left, top, width, height);

      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;

      setZoomImageCoordinate({
        x,
        y,
      });
    },
    [zoomImageCoordinate]
  );

  const handleLeaveImageZoom = () => {
    setZoomImage(false);
  };

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const handleBuyProduct = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
    navigate("/cart");
  };

  return (
    <div className="container mx-auto p-10 bg-indigo-50 min-h-screen">
      <div className="min-h-[200px] flex flex-col lg:flex-row gap-6 overflow-auto scrollbar-hide">
        {/* product Image */}
        <div className="h-96 flex flex-col lg:flex-row-reverse gap-4">
          <div className="h-[320px] w-[320px] lg:h-96 lg:w-96 bg-white shadow-md rounded-xl relative p-3">
            {/* ✅ Fix: Conditional rendering for main image */}
            {activeImage ? (
              <img
                src={activeImage}
                className="h-full w-full object-contain mix-blend-multiply"
                onMouseMove={handleZoomImage}
                onMouseLeave={handleLeaveImageZoom}
                alt="Product"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500">No Image Available</p>
              </div>
            )}

            {/* product zoom */}
            {zoomImage && activeImage && (
              <div className="hidden lg:block absolute min-w-[500px] overflow-hidden min-h-[400px] bg-white shadow-lg rounded-lg p-2 -right-[520px] top-0">
                <div
                  className="w-full h-full min-h-[400px] min-w-[500px] scale-150"
                  style={{
                    background: `url(${activeImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: `${zoomImageCoordinate.x * 100}% ${
                      zoomImageCoordinate.y * 100
                    }% `,
                    backgroundSize: "cover",
                  }}
                ></div>
              </div>
            )}
          </div>

          {/* thumbnails */}
          <div className="h-full">
            <div className="flex gap-3 lg:flex-col overflow-auto scrollbar-hide h-full">
              {/* ✅ Fix: Filter out empty images and add conditional rendering */}
              {data?.productImage
                ?.filter((imgURL) => imgURL && imgURL.trim() !== "")
                ?.map((imgURL, index) => (
                  <div
                    className="h-20 w-20 bg-indigo-100 rounded-lg p-1 shadow-sm hover:shadow-md transition cursor-pointer"
                    key={`${imgURL}-${index}`}
                  >
                    <img
                      src={imgURL}
                      className="w-full h-full object-contain"
                      onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                      onClick={() => handleMouseEnterProduct(imgURL)}
                      alt={`Thumbnail ${index + 1}`}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* product details */}
        <div className="flex flex-col gap-3">
          <p className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full inline-block w-fit text-sm font-medium">
            {data?.brandName}
          </p>
          <h2 className="text-2xl lg:text-4xl font-semibold text-indigo-900">
            {data?.productName}
          </h2>
          <p className="capitalize text-slate-500">{data?.category}</p>

          <div className="text-yellow-400 flex items-center gap-1">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStarHalf />
          </div>

          <div className="flex items-center gap-3 text-2xl lg:text-3xl font-medium my-1">
            <p className="text-indigo-700">
              {displayINRCurrency(data.sellingPrice)}
            </p>
            <p className="text-slate-400 line-through">
              {displayINRCurrency(data.price)}
            </p>
          </div>

          <div className="flex items-center gap-4 my-2">
            <button
              className="border-2 border-indigo-600 rounded-lg px-5 py-2 min-w-[140px] text-indigo-600 font-medium hover:bg-indigo-600 hover:text-white transition"
              onClick={(e) => handleBuyProduct(e, data?._id)}
            >
              Buy
            </button>
            <button
              className="border-2 border-indigo-600 rounded-lg px-5 py-2 min-w-[140px] font-medium text-white bg-indigo-600 hover:text-indigo-600 hover:bg-white transition"
              onClick={(e) => handleAddToCart(e, data?._id)}
            >
              Add To Cart
            </button>
          </div>

          <div>
            <p className="text-indigo-900 font-semibold my-2">Description :</p>
            <p className="text-slate-700">{data?.description}</p>
          </div>
        </div>
      </div>

      {data?.category && (
        <CategroyWiseProductDisplay
          category={data?.category}
          heading={"Recommended Product"}
        />
      )}
    </div>
  );
};

export default ProductDetails;
