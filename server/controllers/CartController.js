import User from "../models/user.js";


// Update User CartData : /api/cart/update
export const updateCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;
    console.log(cartItems);
    if (!Array.isArray(cartItems)) {
      return res.status(400).json({ success: false, message: "cartItems must be an array" });
    }

    // Update the cart array
    await User.findByIdAndUpdate(userId, { cart: cartItems });

    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log("Error updating cart:", error.message);
    res.json({ success: false, message: error.message });
  }
};
