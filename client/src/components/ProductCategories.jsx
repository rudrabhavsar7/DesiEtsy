import React, { useRef, useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CategoryCard from "./CategoryCard";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const ProductCategories = () => {
  const { categories, navigate } = useAppContext();
  const mainRef = useRef(null);
  const gridRef = useRef(null);
  const [visibleCategories, setVisibleCategories] = useState(3);

  // GSAP animations
  useEffect(() => {
    const cards = gsap.utils.toArray(".category-card");
    
    // Main entrance animation
    gsap.from(cards, {
      opacity: 0,
      y: 60,
      duration: 0.5,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: mainRef.current,
        start: "top 85%",
        end: "bottom 80%",
        scrub:2,
      },
    });

    // Title animation
    gsap.from(".category-title", {
      opacity: 1,
      y: 30,
      duration: 0.8,
      scrollTrigger: {
        trigger: mainRef.current,
        start: "top 85%",
        end: "bottom 80%",
        scrub: 2,
      },
    });
  }, [visibleCategories]);

  // Get categories to display based on current state
  const displayedCategories = categories.slice(0, visibleCategories);

  return (
    <div
      ref={mainRef}
      className="w-full py-16 md:py-24 relative bg-amber-50"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-100/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-amber-100/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title with decorative elements */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <h2 
              className="category-title text-3xl md:text-5xl font-custom text-amber-900 relative z-10"
            >
              Shop by Categories
            </h2>
            <div className="h-3 w-full bg-amber-200 mt-1 rounded-full transform -rotate-1"></div>
          </div>
          
          <motion.p 
            className="mt-4 text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Discover our curated collection of handcrafted treasures, each telling a story of tradition and artistry
          </motion.p>
        </div>

        {/* Categories Grid */}
        <div 
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 place-items-center"
        >
          {displayedCategories.map((category, idx) => (
            <div
              key={idx}
              className="category-card"
            >
              <CategoryCard
                category={category}
                destination={`/products/${category.path}`}
              />
            </div>
          ))}
        </div>
        
        {/* Browse all categories button */}
        <div className="flex justify-center mt-10">
          <motion.button
            onClick={() => navigate('/products')}
            className="group relative px-8 py-3 overflow-hidden rounded-full bg-white border-2 border-amber-900 text-amber-900 shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <span>Browse All Collections</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-amber-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProductCategories;