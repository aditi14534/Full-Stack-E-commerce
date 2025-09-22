import React, { useEffect, useState } from "react";
import UploadProduct from "../components/UploadProduct";
import SummaryApi from "../common";
import AdminProductCard from "../components/AdminProductCard";

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);

  const fetchAllProduct = async () => {
    const response = await fetch(SummaryApi.allProduct.url);
    const dataResponse = await response.json();
    setAllProduct(dataResponse?.data || []);
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      <main className="flex-1 p-1">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          {/* Header inside card */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">All Products</h2>
            <button
              className="px-4 py-2 rounded-md font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition"
              onClick={() => setOpenUploadProduct(true)}
            >
              + Upload Product
            </button>
          </div>

          {/* Products Grid inside same card */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allProduct.length > 0 ? (
              allProduct.map((product, index) => (
                <AdminProductCard
                  data={product}
                  key={index + "allProduct"}
                  fetchdata={fetchAllProduct}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 font-medium py-6">
                No products available. Upload your first product 🚀
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Upload Product Modal */}
      {openUploadProduct && (
        <UploadProduct
          onClose={() => setOpenUploadProduct(false)}
          fetchData={fetchAllProduct}
        />
      )}
    </div>
  );
};

export default AllProducts;
