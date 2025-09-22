const razorpay = require("../../config/razorpay"); // jo tumne instance banaya hai
const userModel = require("../../models/userModel");

const paymentController = async (request, response) => {
  try {
    const { cartItems } = request.body;

    const user = await userModel.findById(request.userId);

    // cart total calculate karo safely
    const totalAmount =
      cartItems.reduce((sum, item) => {
        const price = item.productId?.sellingPrice || 0;
        const quantity = item.quantity || 0;
        return sum + price * quantity;
      }, 0) * 100; // paise me convert

    // Razorpay order create
    const options = {
      amount: totalAmount, // paise me
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: request.userId,
        email: user.email,
      },
    };

    const order = await razorpay.orders.create(options);

    response.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID, // frontend me use hoga
    });
  } catch (error) {
    response.status(500).json({
      message: error?.message || error,
      error: true,
      success: false,
    });
  }
};

module.exports = paymentController;
