import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import Context from "../context";
import displayINRCurrency from "../helpers/displayCurrency";
import { MdDelete, MdShoppingCart, MdRemove, MdAdd } from "react-icons/md";
import { HiOutlineShoppingBag } from "react-icons/hi";
import axios from "axios";
import { toast } from "react-toastify";

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const loadingCart = new Array(4).fill(null);

  // Navigate to home page
  const handleContinueShopping = () => {
    navigate("/");
  };

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  };

  // Fetch cart data
  const fetchData = async () => {
    try {
      const response = await fetch(SummaryApi.addToCartProductView.url, {
        method: SummaryApi.addToCartProductView.method,
        credentials: "include",
        headers: { "content-type": "application/json" },
      });
      const responseData = await response.json();
      if (responseData.success) {
        setData(responseData.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Fetch cart error:", error);
      toast.error("Failed to load cart data");
    }
  };

  // Clear cart function - backend API call
  const clearCartFromBackend = async () => {
    try {
      const response = await fetch(
        SummaryApi.clearCart?.url || "/api/clear-cart",
        {
          method: "DELETE",
          credentials: "include",
          headers: { "content-type": "application/json" },
        }
      );

      const result = await response.json();
      if (result.success) {
        console.log("Cart cleared from backend successfully");
      }
    } catch (error) {
      console.error("Failed to clear cart from backend:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, []);

  // Increase quantity
  const increaseQty = async (id, qty) => {
    try {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ _id: id, quantity: qty + 1 }),
      });
      const responseData = await response.json();
      if (responseData.success) {
        fetchData();
        context.fetchUserAddToCart(); // Header count update
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to increase quantity");
    }
  };

  // Decrease quantity
  const decreaseQty = async (id, qty) => {
    if (qty >= 2) {
      try {
        const response = await fetch(SummaryApi.updateCartProduct.url, {
          method: SummaryApi.updateCartProduct.method,
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ _id: id, quantity: qty - 1 }),
        });
        const responseData = await response.json();
        if (responseData.success) {
          fetchData();
          context.fetchUserAddToCart(); // Header count update
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to decrease quantity");
      }
    }
  };

  // Delete product
  const deleteCartProduct = async (id) => {
    try {
      const response = await fetch(SummaryApi.deleteCartProduct.url, {
        method: SummaryApi.deleteCartProduct.method,
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      const responseData = await response.json();
      if (responseData.success) {
        toast.success("Item removed from cart");
        fetchData();
        context.fetchUserAddToCart(); // Header count update
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  };

  // Payment Handler - FIXED VERSION
  const handlePayment = async () => {
    if (totalPrice <= 0) {
      toast.info("Your cart is empty!");
      return;
    }

    try {
      setPaymentLoading(true);
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Razorpay script failed to load");
        return;
      }

      // Create order using your backend
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartItems: data,
          }),
        }
      );

      const orderData = await response.json();

      if (!orderData.success || !orderData?.order?.id) {
        toast.error("Order creation failed");
        return;
      }

      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Your E-Commerce Store",
        description: `Payment for ${totalQty} items`,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            toast.success("Payment Successful! Order placed.");

            // Backend se cart clear karo
            const clearResponse = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/api/clear-cart`,
              {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
              }
            );

            if (clearResponse.ok) {
              console.log("Cart cleared from backend");
            }

            // Local cart clear karo
            setData([]);

            // Header count update karo
            context.fetchUserAddToCart();
          } catch (err) {
            console.error("Post-payment error:", err);
            toast.error("Payment successful but cart update failed!");

            // Force refresh agar kuch fail ho jaye
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: { color: "#3B82F6" },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const rzp1 = new window.Razorpay(options);

      rzp1.on("payment.failed", function (response) {
        toast.error("Payment failed: " + response.error.description);
        setPaymentLoading(false);
      });

      rzp1.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment failed! Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const totalQty = data.reduce((prev, curr) => prev + curr.quantity, 0);
  const totalPrice = data.reduce(
    (prev, curr) => prev + curr.quantity * curr?.productId?.sellingPrice,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MdShoppingCart className="text-2xl text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">
              {totalQty > 0
                ? `${totalQty} items in your cart`
                : "Your cart is empty"}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Empty Cart */}
        {data.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <HiOutlineShoppingBag className="text-6xl text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any items yet.
              </p>
              <button
                onClick={handleContinueShopping}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {/* Cart Content */}
        {(data.length > 0 || loading) && (
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Products Section */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b">
                  Cart Items ({totalQty})
                </h2>
                <div className="space-y-6">
                  {loading
                    ? loadingCart.map((_, i) => (
                        <div
                          key={i}
                          className="flex gap-4 p-4 bg-gray-50 rounded-xl animate-pulse"
                        >
                          <div className="w-24 h-24 bg-gray-200 rounded-lg" />
                          <div className="flex-1 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                            <div className="h-4 bg-gray-200 rounded w-1/3" />
                          </div>
                        </div>
                      ))
                    : data.map((product) => (
                        <div
                          key={product?._id}
                          className="group bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex gap-6">
                            <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden border">
                              <img
                                src={product?.productId?.productImage[0]}
                                alt={product?.productId?.productName}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                              />
                            </div>

                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                                    {product?.productId?.productName}
                                  </h3>
                                  <p className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md inline-block">
                                    {product?.productId?.category}
                                  </p>
                                </div>
                                <button
                                  onClick={() =>
                                    deleteCartProduct(product?._id)
                                  }
                                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <MdDelete size={20} />
                                </button>
                              </div>

                              <div className="flex justify-between items-end">
                                <div>
                                  <p className="text-2xl font-bold text-gray-900">
                                    {displayINRCurrency(
                                      product?.productId?.sellingPrice
                                    )}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Total:{" "}
                                    {displayINRCurrency(
                                      product?.productId?.sellingPrice *
                                        product?.quantity
                                    )}
                                  </p>
                                </div>

                                <div className="flex items-center bg-gray-50 rounded-xl p-1">
                                  <button
                                    onClick={() =>
                                      decreaseQty(
                                        product?._id,
                                        product?.quantity
                                      )
                                    }
                                    className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:text-blue-600 hover:bg-white transition-colors"
                                    disabled={product?.quantity <= 1}
                                  >
                                    <MdRemove size={18} />
                                  </button>

                                  <span className="mx-4 font-semibold min-w-[2rem] text-center">
                                    {product?.quantity}
                                  </span>

                                  <button
                                    onClick={() =>
                                      increaseQty(
                                        product?._id,
                                        product?.quantity
                                      )
                                    }
                                    className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:text-blue-600 hover:bg-white transition-colors"
                                  >
                                    <MdAdd size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full xl:w-96">
              <div className="sticky top-8">
                {loading ? (
                  <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-12 bg-gray-200 rounded-xl" />
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b">
                      Order Summary
                    </h3>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Items ({totalQty})</span>
                        <span>{displayINRCurrency(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span className="text-green-600 font-medium">Free</span>
                      </div>
                      <div className="border-t pt-4 flex justify-between items-center">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {displayINRCurrency(totalPrice)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handlePayment}
                      disabled={paymentLoading || totalPrice <= 0}
                      className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                        paymentLoading || totalPrice <= 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {paymentLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        "Proceed to Payment"
                      )}
                    </button>

                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Secure payment powered by Razorpay
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
