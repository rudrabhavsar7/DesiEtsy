import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { motion } from "framer-motion";

const Cart = () => {
  const {
    cartItems,
    categories,
    products,
    getCartCount,
    currency,
    updateCartItem,
    removeFromCart,
    getCartAmount,
    navigate,
    user,
    toast,
    axios
  } = useAppContext();

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [showAddress, setShowAddress] = useState(false);
  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState([]);

  const getUserAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      
      if (data.success) {
        setAddress(data.addresses);
        setSelectedAddress(data.addresses[0]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

   useEffect(() => {
        if(user){
            getUserAddress();
        }
    },[user]);

 const productsList =
  (cartItems &&
    cartItems.map((cartItem) => {
      const { productId, size, quantity } = cartItem;
      
      const product = products.find((product) => product._id === productId);

      return {
        id: productId + (size ? `_${size}` : ""),
        size,
        ...product,
        quantity,
      };
    })) ||
  [];

 

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handlePlaceOrder = async () => {

    if(!selectedAddress || Object.keys(selectedAddress).length === 0) {
      toast.error("Please select a delivery address");
      return;
    }

    if (productsList.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if(!user){
      toast.error("Please login to place an order");
      return;
    }

    if (selectedPayment === "cod") {
      try {
        console.log(productsList);
        // Call API to place order
        const { data } = await axios.post("/api/cart/order/cash", {
          userId: user._id,
          orderItems: productsList.map((item) => ({
            product: item._id,
            quantity: item.quantity,
            size: item.size || null,
            price: item.price * item.quantity,
            image: item.images[0],
          })),
          shippingAddress: selectedAddress,
          paymentMethod: selectedPayment,
          totalAmount: getCartAmount(),
        });



        console.log(data);
        if (data.success) {
          toast.success("Order placed successfully!");
          // Clear cart and redirect to home page
          // clearCart(); // You would need to implement this in your context
          navigate("/orders");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        
      }
    }

    // setIsProcessing(true);
    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      // Show success message or redirect
      alert("Order placed successfully!");
      // Clear cart and redirect to home page
      // clearCart(); // You would need to implement this in your context
      navigate("/");
    }, 1500);
  };

  // Empty cart state
  if (productsList.length === 0) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center bg-amber-50 px-4 py-10">
        <motion.div
          className="max-w-md w-full p-8 bg-white rounded-2xl border-2 border-amber-900 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-6">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 6V5.5C16 3.567 14.433 2 12.5 2h-1C9.567 2 8 3.567 8 5.5V6H4v16h16V6h-4zm-6-0.5C10 4.673 10.673 4 11.5 4h1c0.827 0 1.5 0.673 1.5 1.5V6h-4V5.5z"
                stroke="#7b3306"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M9 11l1.5 1.5L15 8"
                stroke="#7b3306"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-custom font-medium mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="w-full py-3 bg-amber-900 text-white font-medium rounded-full hover:bg-amber-800 transition"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-start bg-amber-50 px-4 py-6 md:py-10 mt-15">
      <motion.div
        className="flex flex-col md:flex-row max-w-6xl w-full border-2 rounded-2xl bg-white border-amber-900 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Cart Items Section */}
        <div className="flex-1 p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-custom font-medium">
              Shopping Cart
              <span className="ml-2 text-sm bg-amber-900 text-white px-2 py-0.5 rounded-full">
                {getCartCount()}
              </span>
            </h1>
          </div>

          {/* Header - Hidden on mobile */}
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-sm font-medium pb-3 border-b">
            <p className="text-left">Product Details</p>
            <p className="text-center">Subtotal</p>
            <p className="text-center">Action</p>
          </div>

          {/* Cart Items */}
          <div className="space-y-4 md:space-y-2 mt-4 md:mt-0">
            {productsList.map((product, index) => (
              <motion.div
                key={index}
                className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-3 text-gray-700 items-center text-sm md:text-base py-3 border-b"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {/* Product Info - Full width on mobile */}
                <div className="flex items-start md:items-center gap-3 md:gap-4">
                  <div
                    className="cursor-pointer w-20 h-20 md:w-24 md:h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden"
                    onClick={() =>
                      navigate(`/products/${product.category}/${product._id}`)
                    }
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={product.images[0]}
                      alt={product.name}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 line-clamp-2">
                      {product.name}
                    </p>
                    <div className="font-normal text-gray-500 mt-1 space-y-1">
                      {product.size && (
                        <p className="text-xs md:text-sm">
                          Size:{" "}
                          <span className="font-medium">{product.size}</span>
                        </p>
                      )}
                      <div className="flex items-center">
                        <p className="text-xs md:text-sm mr-1">Qty:</p>
                        <select
                          onChange={(e) => {
                            updateCartItem(
                              product.id,
                              parseInt(e.target.value)
                            );
                          }}
                          value={product.quantity}
                          className="outline-none border border-gray-300 rounded px-1 py-0.5 text-xs md:text-sm"
                        >
                          {Array(10)
                            .fill("")
                            .map((_, index) => (
                              <option key={index} value={index + 1}>
                                {index + 1}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Price - Mobile only */}
                      <div className="md:hidden flex justify-between items-center mt-2">
                        <p className="text-sm font-medium">
                          {currency}
                          {(product.offerPrice * product.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(product.id)}
                          className="text-red-500 text-xs flex items-center"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtotal - Desktop only */}
                <p className="hidden md:block text-center font-medium">
                  {currency}
                  {(product.offerPrice * product.quantity).toFixed(2)}
                </p>

                {/* Action - Desktop only */}
                <div className="hidden md:flex justify-center">
                  <button
                    onClick={() => handleRemoveItem(product.id)}
                    className="cursor-pointer hover:bg-red-50 p-2 rounded-full transition-colors"
                    aria-label="Remove item"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0"
                        stroke="#FF532E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            className="group cursor-pointer flex items-center mt-6 gap-2 text-amber-900 font-medium hover:underline"
            onClick={() => navigate("/products")}
          >
            <svg
              width="15"
              height="11"
              viewBox="0 0 15 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="group-hover:-translate-x-1 transition-transform"
            >
              <path
                d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
                stroke="#7b3306"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Continue Shopping
          </button>
        </div>

        {/* Order Summary Section */}
        <div className="w-full md:max-w-[360px] bg-amber-50/50 p-4 md:p-5 border-t md:border-t-0 md:border-l border-gray-300">
          <h2 className="text-xl font-medium">Order Summary</h2>
          <hr className="border-gray-300 my-4" />

          <div className="mb-6 space-y-4">
            <div>
              <p className="text-sm font-medium uppercase mb-2">
                Delivery Address
              </p>
              <div className="relative">
                <div className="flex justify-between items-start">
                  <p className="text-gray-500">
                    {user && selectedAddress
                      ? `${selectedAddress.street},${selectedAddress.city},${selectedAddress.state},${selectedAddress.country}`
                      : "No address found"}
                  </p>
                  <button
                    onClick={() => setShowAddress(!showAddress)}
                    className="text-amber-900 text-sm hover:underline cursor-pointer"
                  >
                    {showAddress ? "Close" : "Change"}
                  </button>
                </div>

                {showAddress && (
                  <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-white border border-gray-300 shadow-md rounded-b-lg">
                    {address.map((add) => (
                      <p
                        key={add._id}
                        onClick={() => {
                          setSelectedAddress(add);
                          setShowAddress(false);
                        }}
                        className="text-gray-500 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >{add.street}, {add.city}, {add.state}, {add.country}</p>
                    ))}
                    <p
                      onClick={() => {
                        navigate("/add-address");
                        setShowAddress(false);
                      }}
                      className="text-amber-900 px-4 py-2 hover:bg-amber-50 cursor-pointer"
                    >
                      Add address
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium uppercase mb-2">
                Payment Method
              </p>
              <select
                value={selectedPayment}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className="w-full border border-gray-300 bg-white px-3 py-2 text-sm rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="cod">Cash On Delivery</option>
                <option value="online">Online Payment</option>
              </select>
            </div>
          </div>

          <hr className="border-gray-300" />

          <div className="text-gray-500 mt-4 space-y-2">
            <p className="flex justify-between">
              <span>Price</span>
              <span>
                {currency}
                {getCartAmount().toFixed(2)}
              </span>
            </p>
            <p className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-green-600">Free</span>
            </p>
            <p className="flex justify-between">
              <span>Tax (2%)</span>
              <span>
                {currency}
                {(getCartAmount() * 0.02).toFixed(2)}
              </span>
            </p>
            <p className="flex justify-between text-lg font-medium mt-3">
              <span>Total Amount:</span>
              <span>
                {currency}
                {(getCartAmount() + getCartAmount() * 0.02).toFixed(2)}
              </span>
            </p>
          </div>

          <button
            className={`w-full py-3 mt-6 cursor-pointer bg-amber-900 text-white font-medium hover:bg-amber-800 transition ${
              isProcessing ? "opacity-75 cursor-not-allowed" : ""
            }`}
            onClick={handlePlaceOrder}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Place Order"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Cart;
