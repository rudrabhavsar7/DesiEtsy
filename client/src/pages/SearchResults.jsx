import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { useLocation } from "react-router-dom";

const SearchResults = () => {
  const { products } = useAppContext();
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get search query from URL
  const searchQuery = new URLSearchParams(location.search).get('q') || '';
  
  // Filter products based on search query
  useEffect(() => {
    setIsLoading(true);
    
    if (searchQuery && products.length > 0) {
      const query = searchQuery.toLowerCase();
      
      // Search in product name, description, and category
      const results = products.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(query);
        const categoryMatch = product.category.toLowerCase().includes(query);
        const descriptionMatch = product.description.some(desc => 
          desc.toLowerCase().includes(query)
        );
        
        return nameMatch || categoryMatch || descriptionMatch;
      });
      
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
    
    setIsLoading(false);
  }, [searchQuery, products]);

  return (
    <div className="mt-16 flex flex-col items-start justify-start gap-6 bg-amber-50 min-h-screen w-full overflow-x-hidden px-4 py-6">
      {/* Search Header */}
      <motion.div 
        className="w-full max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-medium text-amber-900 mb-2">
          Search Results for "{searchQuery}"
        </h1>
        <p className="text-gray-600">
          {isLoading 
            ? "Searching..." 
            : `Found ${searchResults.length} product${searchResults.length !== 1 ? 's' : ''}`}
        </p>
      </motion.div>
      
      {/* Search Results */}
      <motion.div 
        className="w-full max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-900"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {searchResults.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-amber-900/50 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
            <h2 className="text-xl font-medium text-gray-700 mb-2">No products found</h2>
            <p className="text-gray-500 max-w-md">
              We couldn't find any products matching "{searchQuery}". 
              Try using different keywords or browse our product categories.
            </p>
          </div>
        )}
      </motion.div>
      
      {/* Search Tips - Show only when there are no results */}
      {!isLoading && searchResults.length === 0 && (
        <motion.div 
          className="w-full max-w-6xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-sm border border-amber-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-lg font-medium text-amber-900 mb-3">Search Tips</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Check the spelling of your search term</li>
            <li>Try using more general keywords</li>
            <li>Try searching for related terms</li>
            <li>Browse our product categories to find what you're looking for</li>
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default SearchResults;