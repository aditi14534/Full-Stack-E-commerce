const addToCartModel = require("../../models/cartProduct");

const clearCartController = async (request, response) => {
  try {
    const currentUser = request.userId;

    await addToCartModel.deleteMany({ userId: currentUser });

    response.json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    response.status(400).json({
      message: error?.message || error,
      error: true,
      success: false,
    });
  }
};

module.exports = clearCartController;
