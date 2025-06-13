import React from "react";
import Hero from "../components/Hero";
import ProductCategories from "../components/ProductCategories";
import TagLine from "../components/TagLine";
import { RevealBento } from "../components/Footer";
import ImageGallery from "../components/ImageGallery";

const Home = () => {
  return (
    <div className="h-auto max-w-full overflow-hidden bg-amber-50">
      <Hero />
      <TagLine/>  
      <ProductCategories />
      <ImageGallery/>
      <RevealBento />
    </div>
  );
};

export default Home;
