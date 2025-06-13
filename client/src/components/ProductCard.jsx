import React from "react";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const [count, setCount] = React.useState(0);
  const {
    currency,
    addToCart,
    removeFromCart,
    cartItems,
    navigate,
    subcategories,
    categories,
  } = useAppContext();

  const findSubcategory = subcategories.find(
    (scat) => scat.title === product.category
  );
  const findCategory = categories.find(
    (cat) => findSubcategory.category === cat.path
  );

  return (
    product && (
      <div
        onClick={() => {
          navigate(
            `/products/${findCategory.path}/${findSubcategory.path}/${product._id}`
          );
          scrollTo(0, 0);
        }}
        className="shadow-xl shadow-amber-900/30 rounded-lg bg-white p-3 md:p-4 flex flex-col cursor-pointer transition-transform hover:scale-[1.01] w-full max-w-xs sm:max-w-sm md:max-w-md"
      >
        {/* Image */}
        <div className="w-full h-48 sm:h-52 md:h-60 flex items-center justify-center overflow-hidden rounded-md">
          <img
            className="object-contain h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
            src={product.images[0]}
            alt={product.name}
          />
        </div>

        {/* Info */}
        <div className="mt-3 text-gray-600 text-sm">
          <p>{product.category}</p>
          <p className="text-gray-800 font-semibold text-base md:text-lg truncate">
            {product.name}
          </p>

          <div className="flex justify-between items-center mt-2">
            <p className="text-primary font-semibold text-base md:text-xl">
              {currency}
              {product.offerPrice}
              <span className="line-through ml-2 text-xs md:text-sm text-gray-500">
                {currency}
                {product.price}
              </span>
            </p>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;
