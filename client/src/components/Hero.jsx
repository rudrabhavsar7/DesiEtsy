import React, { useEffect, useRef, useState } from "react";
import images from "../assets/images.js";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Register GSAP plugins if needed
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (headingRef.current && subheadingRef.current && imageRef.current) {
      const tl = gsap.timeline();

      tl.from(headingRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "power3.out",
      })
        .from(
          subheadingRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .from(
          imageRef.current,
          {
            scale: 0.8,
            opacity: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)",
            rotation: -5,
          },
          "-=0.6"
        );
    }
  }, []);

  useEffect(() => {
    if (imageRef.current && currentIndex !== undefined) {
      const imageElement = imageRef.current;

      const tl = gsap.timeline();

      tl.to(imageElement, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.out",
      }).to(imageElement, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        rotation: Math.random() * 6 - 3,
        ease: "elastic.out(1, 0.5)",
      });
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  // Background pattern based on current image
  const getPatternStyle = () => {
    const currentImage = images[currentIndex];
    return {
      background:
        currentImage.bgColor ||
        "linear-gradient(135deg, #f5e3c4 0%, #ecd4a4 100%)",
      boxShadow: `0 10px 30px -5px ${currentImage.shadow || "#8B4513"}80`,
    };
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-amber-50">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-amber-900/10 blur-3xl"></div>
        <div className="absolute top-[60%] -right-[5%] w-[30%] h-[40%] rounded-full bg-amber-700/10 blur-3xl"></div>
      </div>

      <div
        ref={containerRef}
        className="container mx-auto px-4 py-8 md:py-0 h-screen flex flex-col md:flex-row items-center justify-center z-10 relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Text content */}
        <div className="w-full md:w-1/2 text-center md:text-left z-10 px-4 md:px-8">
          <h1
            ref={headingRef}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-amber-900 mb-4 font-custom leading-tight"
          >
            Crafted by Hands, <br />
            <span className="text-amber-700">Cherished by Hearts</span>
          </h1>

          <p
            ref={subheadingRef}
            className="text-lg md:text-xl text-amber-800/80 mb-8 max-w-lg"
          >
            Discover authentic handcrafted treasures that bring the rich
            heritage of traditional craftsmanship to your home.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-wrap gap-4 justify-center md:justify-start"
          >
            <Link to="/products">
              <button className="px-8 py-3 bg-amber-900 text-white rounded-full hover:bg-amber-800 transition-all shadow-lg hover:shadow-amber-900/30 hover:-translate-y-1">
                Explore Collection
              </button>
            </Link>
            <Link to={`/products/${images[currentIndex]?.path || ""}`}>
              <button className="px-8 py-3 border-2 border-amber-900 text-amber-900 rounded-full hover:bg-amber-900/10 transition-all">
                View {images[currentIndex]?.name || "Products"}
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Product showcase */}
        <div className="w-full md:w-1/2 mt-12 md:mt-0 flex justify-center items-center">
          <div
            className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] rounded-full flex items-center justify-center"
            style={getPatternStyle()}
          >
            <div
              ref={imageRef}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.img
                src={images[currentIndex]?.link}
                alt={images[currentIndex]?.name || "Product image"}
                className="h-[80%] w-[80%] object-contain drop-shadow-2xl"
                style={{
                  filter: `drop-shadow(0px 10px 15px ${
                    images[currentIndex]?.shadow || "#8B4513"
                  }90)`,
                }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </div>

            {/* Product name overlay */}
            <div className="absolute -bottom-8 left-0 right-0 text-center">
              <motion.h3
                key={currentIndex} // Force re-render on change
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-semibold text-amber-900 bg-amber-50/80 backdrop-blur-sm py-2 px-4 rounded-full inline-block shadow-lg"
              >
                {images[currentIndex]?.name || "Product"}
              </motion.h3>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-amber-900 w-8"
                : "bg-amber-900/40 hover:bg-amber-900/60"
            }`}
            aria-label={`View ${images[index]?.name || `product ${index + 1}`}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-amber-900/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 2, duration: 1.5, repeat: Infinity }}
      >
        <span className="text-sm mb-1">Scroll</span>
        <svg
          width="20"
          height="12"
          viewBox="0 0 20 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L10 10L19 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default Hero;
