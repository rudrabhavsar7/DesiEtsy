import React from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { FiArrowRight, FiMail, FiMapPin } from "react-icons/fi";
import { SiGithub, SiFacebook, SiX, SiYoutube } from "react-icons/si";
import logo from '/logo.png'
import { Link } from "react-router-dom";

export const RevealBento = () => {

    const yourSvgString = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="memphis" width="80" height="80" patternUnits="userSpaceOnUse">
      <rect width="80" height="80" fill="#78350f" />
      <!-- Shapes with your theme colors -->
      <circle cx="10" cy="10" r="5" fill="#1f1b16" />
      <rect x="40" y="10" width="10" height="10" fill="#FCD7AD" />
      <path d="M5 50 Q10 45, 15 50 T25 50" stroke="#1f1b16" stroke-width="2" fill="none" />
      <polygon points="60,60 65,70 55,70" fill="#FCD7AD" />
      <line x1="30" y1="30" x2="40" y2="40" stroke="#1f1b16" stroke-width="2" />
      <path d="M60 20 q5 10 10 0" stroke="#1f1b16" stroke-width="2" fill="none" />
      <circle cx="20" cy="60" r="3" fill="#FCD7AD" />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#memphis)" />
</svg>
`;
  return (
    <div
      // style={{
      //   backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
      //     yourSvgString
      //   )}")`,
      // }}
      className="min-h-screen max-h-fit px-4 py-12 text-zinc-50 flex flex-col items-center justify-end"
    >
      {/* <Logo /> */}
      <motion.div
        initial="initial"
        animate="animate"
        transition={{
          staggerChildren: 0.05,
        }}
        className="mx-auto grid max-w-4xl grid-flow-dense grid-cols-12 gap-4 bac"
      >
        <HeaderBlock />
        <SocialsBlock />
        <AboutBlock />
        <LocationBlock />
        <EmailListBlock />
      </motion.div>
      <Footer />
    </div>
  );
};

const Block = ({ className, ...rest }) => {
  return (
    <motion.div
      variants={{
        initial: {
          scale: 0.5,
          y: 50,
          opacity: 0,
        },
        animate: {
          scale: 1,
          y: 0,
          opacity: 1,
        },
      }}
      transition={{
        type: "spring",
        mass: 3,
        stiffness: 400,
        damping: 50,
      }}
      className={twMerge(
        "col-span-4 rounded-lg border border-zinc-700 bg-background p-6",
        className
      )}
      {...rest}
    />
  );
};

const HeaderBlock = () => (
  <Block className="col-span-12 row-span-2 md:col-span-6 rounded-full flex flex-row items-center justify-around">
        <img src={logo} className="h-30 w-30 rounded-full" alt={logo} />
        <h1 className="text-5xl font-custom text-amber-900">DesiEtsy</h1>
  </Block>
);

const SocialsBlock = () => (
  <>
    <Block
      whileHover={{
        rotate: "2.5deg",
        scale: 1.1,
      }}
      className="col-span-6 bg-red-500 md:col-span-3"
    >
      <Link
        to="/"
        className="grid h-full place-content-center text-3xl text-white"
      >
        <SiYoutube />
      </Link>
    </Block>
    <Block
      whileHover={{
        rotate: "-2.5deg",
        scale: 1.1,
      }}
      className="col-span-6 bg-green-600 md:col-span-3"
    >
      <Link
        to="/"
        className="grid h-full place-content-center text-3xl text-white"
      >
        <SiGithub />
      </Link>
    </Block>
    <Block
      whileHover={{
        rotate: "-2.5deg",
        scale: 1.1,
      }}
      className="col-span-6 bg-zinc-50 md:col-span-3"
    >
      <Link
        href="/"
        className="grid h-full place-content-center text-3xl text-black"
      >
        <SiFacebook />
      </Link>
    </Block>
    <Block
      whileHover={{
        rotate: "2.5deg",
        scale: 1.1,
      }}
      className="col-span-6 bg-blue-500 md:col-span-3"
    >
      <Link
        href="/"
        className="grid h-full place-content-center text-3xl text-white"
      >
        <SiX />
      </Link>
    </Block>
  </>
);

const AboutBlock = () => (
  <Block className="col-span-12 text-3xl leading-snug ">
    <p className="text-amber-900/70">
      Bringing comfort, care, and craft to your home — one product at a time.
      Made with love. Delivered with trust. 🏡
    </p>
  </Block>
);

const LocationBlock = () => (
  <Block className="col-span-12 flex flex-col items-center gap-4 md:col-span-3">
    <FiMapPin className="text-3xl" />
    <p className="text-center text-lg text-zinc-400">Nadiad</p>
  </Block>
);

const EmailListBlock = () => (
  <Block className="col-span-12 md:col-span-9">
    <p className="mb-3 text-lg text-black/50">Subscribe To Our Newsletter</p>
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex items-center gap-2"
    >
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full rounded border border-zinc-700 bg-amber-900/50 px-3 py-1.5 transition-colors focus:border-red-300 focus:outline-0"
      />
      <button
        type="submit"
        className="flex items-center gap-2 whitespace-nowrap rounded bg-white px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-300"
      >
        <FiMail /> Join the list
      </button>
    </form>
  </Block>
);

const Footer = () => {
  return (
    <footer className="mt-12">
      <p className="text-center text-zinc-400">
        Made with ❤️ by{" Rudra "}
      </p>
    </footer>
  );
};