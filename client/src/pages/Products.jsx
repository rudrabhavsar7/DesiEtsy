import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";

const Products = () => {
  const { products, subcategories } = useAppContext();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (e) => {
    const { checked, value } = e.target;
    
    if (checked) {
      setSelectedCategories((prev) => [...prev, value]);
    } else {
      setSelectedCategories((prev) => prev.filter((cat) => cat !== value));
    }
  };

  // Check screen size on initial load
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // Don't hide filters on large screens
      } else {
        // Keep filters hidden by default on small screens
        setShowFilters(false);
      }
    };
    
    // Run once on mount
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get unique categories from products for filtering
  const uniqueCategories = [...new Set(products.map(product => product.category))];
  
  // Filter products based on selected categories
  const filteredProducts = selectedCategories.length > 0
    ? products.filter(product => selectedCategories.includes(product.category))
    : products;
    
  // Group products by category for display
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <div className="mt-16 flex flex-col lg:flex-row items-start justify-start gap-6 bg-amber-50 min-h-screen w-full overflow-x-hidden px-4 py-6">
      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden w-full mb-4">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="w-full py-2 bg-amber-900 text-white rounded-full flex items-center justify-center gap-2 shadow-md"
        >
          <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 transition-transform ${showFilters ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {/* Sidebar Filter - Desktop (always visible) */}
      <div className="hidden lg:block border-2 w-1/5 max-w-[20%] h-auto lg:h-auto rounded-t-2xl rounded-br-2xl bg-white p-4 sticky top-20">
        <h1 className="text-center text-xl font-custom text-amber-900 border-b-2 pb-2 rounded-2xl">Filters</h1>
        <h2 className="text-md px-2 mt-4">Category</h2>
        {uniqueCategories.map((category) => (
          <div key={`desktop-${category}`} className="flex flex-row items-center px-3 gap-2 py-1">
            <input
              type="checkbox"
              name={`desktop-${category}`}
              id={`desktop-${category}`}
              value={category}
              onChange={handleChange}
              checked={selectedCategories.includes(category)}
              className="cursor-pointer"
            />
            <label htmlFor={`desktop-${category}`} className="text-sm cursor-pointer">{category}</label>
          </div>
        ))}
        
        {selectedCategories.length > 0 && (
          <button 
            onClick={() => setSelectedCategories([])}
            className="mt-4 w-full py-2 text-sm bg-amber-900 text-white rounded-full hover:bg-amber-800 transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>
      
      {/* Sidebar Filter - Mobile (collapsible) */}
      <motion.div 
        className="lg:hidden border-2 w-full max-w-full h-auto rounded-t-2xl rounded-br-2xl bg-white p-4"
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: showFilters ? 'auto' : 0,
          opacity: showFilters ? 1 : 0,
          display: showFilters ? 'block' : 'none'
        }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-center text-xl font-custom text-amber-900 border-b-2 pb-2 rounded-2xl">Filters</h1>
        <h2 className="text-md px-2 mt-4">Category</h2>
        {uniqueCategories.map((category) => (
          <div key={`mobile-${category}`} className="flex flex-row items-center px-3 gap-2 py-1">
            <input
              type="checkbox"
              name={`mobile-${category}`}
              id={`mobile-${category}`}
              value={category}
              onChange={handleChange}
              checked={selectedCategories.includes(category)}
              className="cursor-pointer"
            />
            <label htmlFor={`mobile-${category}`} className="text-sm cursor-pointer">{category}</label>
          </div>
        ))}
        
        <div className="mt-4 flex gap-2">
          <button 
            onClick={() => setShowFilters(false)}
            className="flex-1 py-2 bg-amber-900 text-white rounded-full"
          >
            Apply Filters
          </button>
          
          {selectedCategories.length > 0 && (
            <button 
              onClick={() => setSelectedCategories([])}
              className="flex-1 py-2 bg-white border border-amber-900 text-amber-900 rounded-full"
            >
              Clear All
            </button>
          )}
        </div>
      </motion.div>

      {/* Product List */}
      <div className="border-2 w-full h-auto overflow-x-hidden overflow-y-visible rounded-2xl flex flex-col px-4 py-3 bg-white">
        {Object.keys(groupedProducts).length > 0 ? (
          Object.entries(groupedProducts).map(([category, categoryProducts]) => (
            <motion.div 
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-2xl sm:text-3xl py-2 text-amber-900 font-custom">
                {category}
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 place-items-center">
                {categoryProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-xl text-amber-900">No products match your filter criteria</p>
            <button 
              onClick={() => setSelectedCategories([])}
              className="mt-4 px-6 py-2 bg-amber-900 text-white rounded-full"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;