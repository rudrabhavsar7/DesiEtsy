import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const CategoryCard = ({ category, destination }) => {
  const imageRef = useRef(null);
  const cardRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(cardRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6 });
  }, []);

  const handleMouseEnter = () => {
    gsap.to(imageRef.current, {
      top: '50%',
      right: '50%',
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, {
      top: '0%',
      right: '0%',
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  return (
    <div
      ref={cardRef}
      className="relative h-[250px] w-[250px] sm:h-[300px] sm:w-[300px] m-4 sm:m-10 shadow-2xl bg-white shadow-background rounded-2xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex h-1/2 flex-col justify-center bg-amber-900 p-4 sm:p-6 rounded-2xl">
        <h3 className="mb-2 text-lg sm:text-xl font-semibold text-white">{category.title}</h3>
        <p className="text-xs sm:text-sm font-light text-white">
          {category.tagline}
        </p>
      </div>

      {/* Image Layer */}
      <div
        ref={imageRef}
        className="absolute inset-0 z-10 bg-slate-200 rounded-2xl"
        style={{
          backgroundImage: `url(${category.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          top: "0%",
          right: "0%",
          position: "absolute",
        }}
      ></div>

      {/* Bottom Right Button */}
      <Link
        to={destination}
        className="absolute bottom-0 right-0 z-0 grid h-1/2 w-1/2 place-content-center bg-white text-black transition-colors
        hover:text-amber-900 rounded-2xl"
      >
        <div className="flex items-center rounded-2xl">
          <span className="text-[10px] sm:text-xs">MORE</span>
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-base sm:text-lg"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
