import User from "../models/User.js";
import Order from "../models/Order.js";


// Update User CartData : /api/cart/update
export const updateCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;

    if (!Array.isArray(cartItems)) {
      return res.status(400).json({ success: false, message: "cartItems must be an array" });
    }

    // Update the cart array
    const newCart = await User.findByIdAndUpdate(userId, { cart: cartItems },{new: true });

    res.json({ success: true, message: "Cart Updated", cart: newCart.cart });
  } catch (error) {
    console.log("Error updating cart:", error.message);
    res.json({ success: false, message: error.message });
  }
};

//place order : /api/cart/order/cash

export const placeOrderbyCash = async (req, res) => {
  try {
    const { userId, orderItems, shippingAddress, paymentMethod, totalAmount } = req.body;

    const totalPrice = totalAmount + (totalAmount * 0.02)
    // Create a new order document
    const newOrder = new Order({
      userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      amount:totalPrice,
    });
    // Save the order to the database
    await newOrder.save();
    // Update the user's cart to empty
    console.log(newOrder);

    res.json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.log("Error placing order:", error.message);
    res.json({ success: false, message: error.message });
  }
}
    
export const getOrdersById = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({userId});

    res.json({ success: true, orders });
  } catch (error) {
    console.log("Error getting orders:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getOrdersByArtisanId = async (req, res) => {
  try {
    const artisanId = req.artisanId;
    const orders = await Order.find({ artisanId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log("Error getting orders by artisan:", error.message);
    res.json({ success: false, message: error.message });
  }
}