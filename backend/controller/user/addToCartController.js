const addToCartModel = require("../../models/cartProduct");

const addToCartController = async (req, res) => {
  try {
    const { productId } = req.body;
    const currentUser = req.userId;

    // Check if product exists for this user
    let cartItem = await addToCartModel.findOne({
      productId,
      userId: currentUser,
    });

    if (cartItem) {
      // Already exists → increment quantity
      cartItem.quantity = (cartItem.quantity || 1) + 1;
      const updated = await cartItem.save();

      return res.json({
        data: updated,
        message: "Quantity updated in Cart",
        success: true,
        error: false,
      });
    }

    // If not exists → create new
    const payload = {
      productId,
      quantity: 1,
      userId: currentUser,
    };

    const newAddToCart = new addToCartModel(payload);
    const saveProduct = await newAddToCart.save();

    return res.json({
      data: saveProduct,
      message: "Product Added in Cart",
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err?.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = addToCartController;
