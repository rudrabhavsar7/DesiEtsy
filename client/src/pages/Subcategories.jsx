import React, { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import CategoryCard from "../components/CategoryCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Subcategories = () => {
  const { category } = useParams();
  const { categories, subcategories } = useAppContext();

  const sectionRef = useRef(null);
  const cardContainerRef = useRef(null);

  const currentCategory = categories.find((cat) => cat.path === category);

  const currentSubcategories = React.useMemo(() => 
    subcategories.filter((subcat) => subcat.category === currentCategory?.path),
    [subcategories, currentCategory]
  );

  useEffect(() => {
    // Fade-in the full section
    gsap.from(sectionRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

    // Animate individual cards
    const cards = gsap.utils.toArray(".subcat-card");
    gsap.from(cards, {
      opacity: 0,
      y: 50,
      duration: 0.6,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: cardContainerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  // Scroll to center middle card on mobile on load
  useEffect(() => {
    if (!cardContainerRef.current) return;

    const container = cardContainerRef.current;
    const cards = container.querySelectorAll(".subcat-card");

    if (cards.length === 0) return;

    if (window.innerWidth < 640) {
      const middleIndex = Math.floor(cards.length / 2);
      const middleCard = cards[middleIndex];
      const containerWidth = container.offsetWidth;
      const cardLeft = middleCard.offsetLeft;
      const cardWidth = middleCard.offsetWidth;

      const scrollPosition = cardLeft - containerWidth / 2 + cardWidth / 2;

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [currentSubcategories]);


  return (
    <div
      ref={sectionRef}
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden bg-amber-50"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden" />

      <div className="relative z-10 rounded-3xl p-6 w-full max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 ">
          <h1 className="text-3xl md:text-4xl font-bold font-custom text-amber-900 tracking-wide text-center sm:text-left">
            {currentCategory?.title || "Category Not Found"}
          </h1>
          <Link
            to="/products"
            className="mt-4 sm:mt-0 inline-block text-sm text-amber-100 bg-amber-700 hover:bg-amber-800 px-4 py-2 rounded-full transition duration-300 shadow-md"
          >
            ← Back to Categories
          </Link>
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 border-2 border-amber-900 rounded-2xl bg-white">
          {currentCategory && currentSubcategories.length > 0 ? (
            currentSubcategories.map((subcat, idx) => (
              <div key={idx} className="subcat-card">
                <CategoryCard
                  category={subcat}
                  destination={`/products/${currentCategory.path}/${subcat.path}`}
                />
              </div>
            ))
          ) : (
            <div className="text-center text-white text-lg py-6">
              No Subcategories Found
            </div>
          )}
        </div>

        {/* Mobile Vertical Stack */}
        <div
          ref={cardContainerRef}
          className="sm:hidden flex flex-col gap-4 px-4 py-6 border-2 border-amber-900 rounded-2xl bg-white"
        >
          {currentCategory && currentSubcategories.length > 0 ? (
            currentSubcategories.map((subcat, idx) => (
              <div
                key={idx}
                className="subcat-card w-full"
              >
                <CategoryCard
                  category={subcat}
                  destination={`/products/${currentCategory.path}/${subcat.path}`}
                />
              </div>
            ))
          ) : (
            <div className="text-center text-amber-900 text-lg py-6 w-full">
              No Subcategories Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subcategories;