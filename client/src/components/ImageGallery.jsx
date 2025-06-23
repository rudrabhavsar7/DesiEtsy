import React,{useState,useMemo} from "react";
import { useRef } from "react";
import img1 from "../assets/images/imageGallery/img1.png";
import img2 from "../assets/images/imageGallery/img2.png";
import img3 from "../assets/images/imageGallery/img3.png";
import img4 from "../assets/images/imageGallery/img4.png";
import img5 from "../assets/images/imageGallery/img5.png";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppContext } from "../context/AppContext";

gsap.registerPlugin(ScrollTrigger);

const ImageGallery = () => {

   const [activeIndex, setActiveIndex] = useState(null);
   const images = useMemo(()=>[img2, img1, img5],[]);

   const {navigate} = useAppContext();
  useGSAP(() => {
    const leftSide = gsap.utils.toArray(".left-ref");
    const rightSide = gsap.utils.toArray(".right-ref");
    const mainSide = gsap.utils.toArray(".main-ref");

    gsap.fromTo(
      ".main-ref",
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".main-ref",
          start: "top 90%",
          toggleActions: "play none none none",
        },
      }
    );

    leftSide.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          scrollTrigger: {
            trigger: mainSide,
            start: "top 50%",
            end: "30% 60%",
            toggleActions: "play none none reverse",
            markers: false,
          },
        }
      );
    });

    rightSide.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: 100 },
        {
          opacity: 1,
          x: 0,
          scrollTrigger: {
            trigger: mainSide,
            start: "top 50%",
            end: "30% 60%",
            toggleActions: "play none none reverse",
            markers: false,
          },
        }
      );
    });
  });

  return (
    <div className="main-ref flex flex-col md:flex-row justify-center items-center h-screen w-screen bg-background md:px-10 md:py-10">
      {/* left side */}
      <div className="bg-amber-50 h-2/3 w-full md:h-screen md:w-2/3 overflow-hidden md:rounded-l-2xl shadow-lg border-2 border-amber-900">
        <div className="h-full w-full relative">
          {/* inner part */}
          {/* left part */}
          <div
            style={{ backgroundImage: `url(${img4})` }}
            className="left-ref bg-cover bg-center relative h-1/2 w-full flex flex-col transition-all duration-500 ease-in-out cursor-pointer"
            onClick={()=>navigate('/products/fashion')}
          >
            <div
              // style={{ backgroundImage: `url(${img2})` }}
              className="left-ref bg-amber-50 absolute -top-10 left-0 h-full w-1/2 md:w-1/3 rounded-br-full border-b-4 border-amber-900 shadow-lg transition-transform duration-500 ease-in-out hover:scale-105 flex justify-center items-center overflow-hidden p-3"
            >
              <h1 className="text-amber-900 font-custom text-left text-3xl text-wrap">
                Your Everyday Ethnic Rooted In Softness.
              </h1>
            </div>
          </div>
          <div
            style={{ backgroundImage: `url(${img3})` }}
            className="right-ref bg-cover bg-center relative h-1/2 w-full flex flex-row-reverse border-t-2 border-amber-50 transition-all duration-500 ease-in-out"
          >
            <div
              // style={{ backgroundImage: `url(${img1})` }}
              className="right-ref bg-amber-50 absolute top-10 right-0 border-t-4 border-amber-900 h-full w-1/2 md:w-1/3 rounded-tl-full md:rounded-bl-2xl shadow-lg transition-transform duration-500 ease-in-out hover:scale-105 flex justify-center items-center overflow-hidden p-3"
            >
              <h1 className="text-amber-900 font-custom text-right text-3xl text-wrap">
                Woven With Tradition, Draped In Stories.
              </h1>
            </div>
          </div>
        </div>
      </div>
      {/* right side */}
      <div className="bg-amber-50 h-1/3 w-full md:h-screen md:w-1/3 rounded-r-2xl shadow-lg flex flex-col items-center justify-center p-1 transition-all duration-700 border-r-2 border-t-2 border-b-2 border-amber-900">
        {images.map((img, index) => (
          <div
            key={index}
            className={`relative overflow-hidden cursor-pointer rounded-xl shadow-md border border-white transition-all duration-700 ease-in-out ${
              activeIndex === null
                ? "w-full h-1/3"
                : activeIndex === index
                ? "w-full h-full z-10"
                : "w-0 h-0 opacity-0"
            }`}
            onClick={() =>
              setActiveIndex(activeIndex === index ? null : index)
            }
          >
            <img
              src={img}
              alt={`img-${index}`}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
