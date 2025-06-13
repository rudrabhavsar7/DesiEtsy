import { createContext, useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import products from "../assets/products.js";
import categories from "../assets/categories.js";
import subcategories from "../assets/subcategories.js";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const currency = "₹";

  //add product to cart
  const addToCart = (itemId, selectedSize) => {
    let cartData = structuredClone(cartItems);
    const findProduct = products.find((product) => product._id === itemId);

    if (!findProduct) {
      toast.error("Product not found");
      return;
    }

    const hasSizes =
      Array.isArray(findProduct.sizes) && findProduct.sizes.length > 0;

    // If product has sizes but size is not selected
    if (hasSizes && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    // Create unique key for sized products
    const itemKey = selectedSize ?  itemId + "_" + selectedSize : itemId ;

    if (cartData[itemKey] && cartData[itemKey].size ===selectedSize) {
      cartData[itemKey].quantity += 1;
    } else {
      cartData[itemKey] = {
        quantity: 1,
        size: hasSizes ? selectedSize : null,
      };
    }
    setCartItems(cartData);
    toast.success("Added to cart");
  };

  //update cart item

  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId].quantity = Number(quantity);
    setCartItems(cartData);
    toast.success("Cart Updated");
  };

  //remove product from cart

  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    toast.success("Removed From Cart");
    setCartItems(cartData);
  };

  //get cart items count
  const getCartCount = () => {
    let count = 0;
    for (const items in cartItems) {
      count += cartItems[items].quantity;
    }
    return count;
  };

  //get cart total price
  const getCartAmount = () => {
    let totalPrice = 0;
    for (const items in cartItems) {
      const id = items.split("_")[0]
      let product = products.find((item) => item._id === id);
      if (cartItems[items].quantity > 0 && product) {
        totalPrice += product.offerPrice * cartItems[items].quantity;
      }
    }
    return Math.floor(totalPrice * 100) / 100;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        showUserLogin,
        setShowUserLogin,
        addToCart,
        removeFromCart,
        cartItems,
        getCartCount,
        getCartAmount,
        navigate,
        updateCartItem,
        currency,
        products,
        categories,
        subcategories,
        showAddress,
        setShowAddress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
