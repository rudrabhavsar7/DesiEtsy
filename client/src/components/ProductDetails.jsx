import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

const ProductDetails = () => {
  const { category, subcategory, id } = useParams();
  const [selectedSize, setSelectedSize] = useState("");
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const { products, categories, subcategories, navigate, currency, addToCart } =
    useAppContext();

  const product = products.find((product) => product._id === id);
  const findSubcategory = subcategories.find((scat) => scat.path === subcategory);
  const findCategory = categories.find((cat) => cat.path === findSubcategory?.category);
  const filteredProducts = products.filter(
    (product) =>
      product.category === findSubcategory?.title && product._id !== id
  );

  const [thumbnail, setThumbnail] = useState(product?.images?.[0]);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setThumbnail(product?.images?.[0]);
    setSelectedSize("");
  }, [id, product]);

  // Check if size is required but not selected
  const isSizeRequired = product?.sizes && product.sizes.length > 0;
  const isSizeSelected = selectedSize !== "";
  const showSizeWarning = isSizeRequired && !isSizeSelected;

  return (
    product && (
      <div className="mt-15 min-h-screen w-full flex flex-col justify-center items-center bg-amber-50 overflow-x-hidden gap-6 px-4 sm:px-6 md:px-10 py-6 md:py-10">
        {/* Breadcrumb Navigation - Scrollable on mobile */}
        <div className="max-w-6xl w-full overflow-x-auto whitespace-wrap pb-2 hide-scrollbar">
          <p className="text-sm text-gray-600">
            <span
              className="cursor-pointer text-black hover:underline"
              onClick={() => navigate(`/`)}
            >
              Home
            </span>{" "}
            /{" "}
            <span
              className="cursor-pointer text-black hover:underline"
              onClick={() => navigate(`/products`)}
            >
              Products
            </span>{" "}
            /{" "}
            <span
              className="cursor-pointer text-black hover:underline"
              onClick={() => navigate(`/products/${category}`)}
            >
              {findCategory?.title}
            </span>{" "}
            /{" "}
            <span
              className="cursor-pointer text-black hover:underline"
              onClick={() => navigate(`/products/${category}/${subcategory}`)}
            >
              {findSubcategory?.title}
            </span>{" "}
            /<span className="text-amber-900"> {product.name}</span>
          </p>
        </div>

        <motion.div 
          className="max-w-6xl w-full p-4 sm:p-6 bg-white rounded-2xl border-2 border-amber-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mt-2 w-full">
            {/* Left Side - Product Images */}
            <div className="flex flex-col-reverse sm:flex-row gap-4 items-center sm:items-start w-full lg:w-1/2">
              {/* Thumbnails - Horizontal on mobile, vertical on desktop */}
              <div className="flex flex-row sm:flex-col gap-3 overflow-x-auto sm:overflow-visible py-2 sm:py-0 w-full sm:w-auto">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setThumbnail(image)}
                    className={`border min-w-16 max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer transition-all ml-1 sm:ml-0 ${
                      thumbnail === image ? "ring-2 ring-amber-900" : ""
                    }`}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              
              {/* Main Image */}
              <div 
                className="border border-gray-500/30 rounded overflow-hidden w-full cursor-pointer relative"
                onClick={() => setIsImageZoomed(!isImageZoomed)}
              >
                <motion.img 
                  src={thumbnail} 
                  alt="Selected product" 
                  className={`w-full object-contain transition-all ${isImageZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                  animate={{ 
                    scale: isImageZoomed ? 1.5 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
                {isImageZoomed && (
                  <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-xs">
                    Click to zoom out
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Product Info */}
            <div className="text-sm w-full lg:w-1/2">
              <h1 className="text-2xl sm:text-3xl font-medium">{product.name}</h1>

              <div className="mt-4 sm:mt-6">
                <p className="text-gray-500/70 line-through">
                  {currency}
                  {product.price}
                </p>
                <p className="text-xl sm:text-2xl font-medium">
                  {currency}
                  {product.offerPrice}
                </p>
                <span className="text-gray-500/70 text-xs sm:text-sm">
                  (inclusive of all taxes)
                </span>
              </div>

              <p className="text-base font-medium mt-4 sm:mt-6">About Product</p>
              <ul className="list-disc ml-4 text-gray-500/70">
                {product.description.map((desc, index) => (
                  <li key={index} className="text-sm sm:text-base my-1">{desc}</li>
                ))}
              </ul>

              {product?.sizes && (
                <div className="mt-4 sm:mt-5">
                  <div className="flex justify-between items-center">
                    <p className="text-base font-medium">Select Size</p>
                    {showSizeWarning && (
                      <p className="text-red-500 text-xs">Please select a size</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size.size}
                        onClick={() => setSelectedSize(size.size)}
                        className={`h-10 min-w-12 border rounded-2xl px-4 py-2 flex items-center justify-center cursor-pointer transition-all ${
                          selectedSize === size.size
                            ? "bg-amber-900 text-white border-amber-900"
                            : "bg-white text-black border-gray-300 hover:border-amber-900"
                        }`}
                      >
                        {size.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center mt-5 gap-3 text-base w-full">
                <button
                  className={`w-full py-3 cursor-pointer font-medium bg-gray-300 text-gray-800/80 hover:bg-gray-200 transition rounded-full ${
                    showSizeWarning ? "animate-pulse" : ""
                  }`}
                  onClick={() => {
                    if (!isSizeRequired || isSizeSelected) {
                      addToCart(id, selectedSize);
                    }
                  }}
                >
                  Add to Cart
                </button>
                <button
                  className={`w-full py-3 cursor-pointer font-medium bg-amber-900 text-white hover:bg-amber-900/70 transition rounded-full ${
                    showSizeWarning ? "animate-pulse" : ""
                  }`}
                  onClick={() => {
                    if (!isSizeRequired || isSizeSelected) {
                      addToCart(id, selectedSize);
                      navigate("/cart");
                    }
                  }}
                >
                  Buy now
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {filteredProducts?.length > 0 ? (
          <motion.div 
            className="flex flex-col h-auto w-full bg-white rounded-2xl border-2 border-amber-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-2xl sm:text-3xl text-amber-900 p-3 rounded-t-2xl font-custom">
              Related Products
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-3 sm:px-6 py-4 sm:py-6 place-items-center">
              {filteredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </motion.div>
        ) : (
          <h1 className="text-gray-600 mt-4 sm:mt-8">No Related Products</h1>
        )}
      </div>
    )
  );
};

export default ProductDetails;