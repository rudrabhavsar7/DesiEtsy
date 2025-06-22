import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import dummyProducts from "../assets/products.js";
import dummyCategories from "../assets/categories.js";
import dummySubcategories from "../assets/subcategories.js";
import axios from "axios";

const AppContext = createContext();
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState(dummyProducts);
  const [categories, setCategories] = useState(dummyCategories);
  const [subcategories, setSubcategories] = useState(dummySubcategories);
  const currency = "₹";

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchUser();
    fetchCategories();
    fetchSubcategories();
    fetchProducts();
  }, []);
  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`/api/user/is-auth`, {
        withCredentials: true,
      });

      if (data.success) {
        setUser(data.user);
        setShowUserLogin(false);
        setCartItems(data.user.cart);
      } else {
        setUser(false);
        setCartItems([]);
      }
    } catch (error) {
      setUser(null);
      setCartItems([]);
    }
  };

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get(`/api/artisan/is-auth`, {
        withCredentials: true,
      });
      if(data.success){
        setIsSeller(data.artisan);
      }
      else{
        setIsSeller(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/admin/categories`, {
        withCredentials: true,
      });
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const { data } = await axios.get(`/api/admin/subcategories`, {
        withCredentials: true,
      });
      setSubcategories(data.subcategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`/api/artisan/products`, {
        withCredentials: true,
      });
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };
  //add product to cart
  const addToCart = (itemId, selectedSize) => {
    const findProduct = products.find((product) => product._id === itemId);

    if (!findProduct) {
      toast.error("Product not found");
      return;
    }

    const hasSizes =
      Array.isArray(findProduct.sizes) && findProduct.sizes.length > 0;

    if (hasSizes && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    let updatedCart = [...cartItems]; // Clone the current cart

    // Find if item already exists in cart with the same size
    const existingItemIndex = updatedCart.findIndex(
      (item) =>
        item.productId === itemId &&
        item.size === (hasSizes ? selectedSize : null)
    );

    if (existingItemIndex !== -1) {
      updatedCart[existingItemIndex].quantity += 1;
    } else {
      updatedCart.push({
        productId: itemId,
        quantity: 1,
        size: hasSizes ? selectedSize : null,
      });
    }

    setCartItems(updatedCart);
    toast.success("Added to cart");
  };

  //update cart item

  const updateCartItem = (itemId, quantity) => {
    const id = itemId.split("_")[0];
    const size = itemId.split("_")[1];

    let cartData = structuredClone(cartItems);

    const product = size
      ? (cartData.find(
          (item) => item.productId === id && item?.size === size
        ).quantity = Number(quantity))
      : (cartData.find((item) => item.productId === id).quantity =
          Number(quantity));
 
    setCartItems(cartData);
    toast.success("Cart Updated");
  };

  //remove product from cart

  const removeFromCart = (itemId) => {
    const id = itemId.split("_")[0];
    const size = itemId.split("_")[1];

    let cartData = structuredClone(cartItems);
    const product = size
      ? (cartData.find(
          (item) => item.productId === id && item?.size === size
        ))
      : (cartData.find((item) => item.productId === id));

    if (product && product.quantity-1 === 0) {
      cartData = cartData.filter((item) => item.productId!== id);
    }
    else{
      cartData.find((item) => item.productId === id).quantity -= 1;
    }
    console.log(product);
    setCartItems(cartData);
    toast.success("Removed From Cart");
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
    cartItems.map((item) => {
      const product = products.find((product) => product._id === item.productId);
      if (product) {
        totalPrice += product.offerPrice * item.quantity;
      }
    })
    return Math.floor(totalPrice * 100) / 100;
  };

  //update cart items
  useEffect(() => {
    const updateCart = async () => {
      console.log(cartItems);
      try {
        const { data } = await axios.post("/api/cart/update", {
          userId: user._id, // pass userId from the user object
          cartItems,
        });

        if (data.success) {
          
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    if (user) {
      updateCart();
    }
  }, [cartItems]);

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
        fetchUser,
        BACKEND_URL,
        axios,
        toast,
        isSeller,
        setIsSeller,
        isAdmin,
        setIsAdmin,
        fetchSeller,
        fetchCategories,
        fetchSubcategories,
        fetchProducts,
        fetchUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
