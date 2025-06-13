import React from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

const SubcategoryProducts = () => {
  const { subcategory } = useParams();
  const { subcategories, products } = useAppContext();

  const findSubcategory = subcategories.find(
      (scat) => scat.path === subcategory
    );
    
  const filteredProducts = products.filter(
    (product) => product.category === findSubcategory.title
  );
  return (
    <div className="flex flex-col items-center justify-start w-screen h-screen bg-amber-50">
      <div className="flex flex-col">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 mt-[15%]">
          <h1 className="text-3xl md:text-4xl font-bold font-custom text-amber-900 tracking-wide text-center sm:text-left">
            {findSubcategory.title}
          </h1>
          <Link
            to={`/products/${findSubcategory.category}`}
            className="mt-4 sm:mt-0 inline-block text-sm text-amber-100 bg-amber-700 hover:bg-amber-800 px-4 py-2 rounded-full transition duration-300 shadow-md"
          >
            ← Back to Categories
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 place-items-center border-2 border-amber-900 p-4 rounded-2xl bg-white ">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubcategoryProducts;
