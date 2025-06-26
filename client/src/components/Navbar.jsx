import React, { useState } from "react";
import logo from "/logo.png";
import activehome from "../assets/navicons/active-house.png";
import closehome from "../assets/navicons/closed-house.png";
import closedsearch from "../assets/navicons/closed-search.png";
import activesearch from "../assets/navicons/active-search.png";
import activeproduct from "../assets/navicons/active-product.png";
import closedproduct from "../assets/navicons/closed-product.png";
import cart from "../assets/navicons/cart.png";
import { NavLink, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const {
    setShowUserLogin,
    user,
    setUser,
    getCartCount,
    navigate,
    axios,
    BACKEND_URL,
    toast
  } = useAppContext();

  const handleLogout = async () => {
    try {
      const {data} = await axios.post(`${BACKEND_URL}/api/user/logout`);

       if(data.success){
        setUser(null);
        navigate('/');
        toast.success("Logged Out");
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const navItems = [
    {
      name: "Home",
      logos: {
        closed: closehome,
        active: closehome,
      },
      bgColor: "bg-primary",
      path: "/",
    },
    {
      name: "Products",
      logos: {
        closed: closedproduct,
        active: activeproduct,
      },
      bgColor: "bg-primary",
      path: "/products",
    },
  ];

  const handleSearch = (e) => {
    setSearch(e.target.value);
  }
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setShowMobileSearch(false);
    }
  }
  
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [search, setSearch] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <nav className="fixed flex top-0 left-0 right-0 flex-wrap justify-between items-center z-50 w-full bg-transparent px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 py-4 transition-all">
      {/* Logo */}
      <Link
        to="/"
        className="w-auto mb-2 sm:mb-0 border-2 border-amber-900 rounded-full"
      >
        <div className="w-fit flex flex-row items-center justify-center bg-white gap-2 rounded-full px-2 py-1">
          <img className="h-10 sm:h-12 rounded-full" src={logo} alt="logo" />
          <h1 className="font-custom text-amber-900 text-xl sm:text-2xl">
            DesiEtsy
          </h1>
        </div>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex w-auto justify-center border-2 border-amber-900 rounded-full">
        <div className="bg-white rounded-full w-fit justify-around flex p-2">
          {navItems.map((item, idx) => {
            const isActive = activeTab === item.name;
            const icon = isActive ? item.logos.active : item.logos.closed;
            return (
              <Link
                key={idx}
                to={item.path}
                onClick={() => setActiveTab(item.name)}
                className={`flex flex-row h-auto w-auto gap-2 items-center text-center rounded-full p-2 transition-all duration-300 ${
                  isActive ? `${item.bgColor}` : "bg-transparent"
                }`}
              >
                <img src={icon} className="h-5" alt={item.name} />
                {isActive && (
                  <h1 className="text-black text-sm">{item.name}</h1>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex w-auto justify-end border-2 border-amber-900 rounded-full">
        <div className="flex justify-center items-center gap-4 lg:gap-8 bg-white rounded-full w-fit py-1 px-2">
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center text-sm gap-2 border border-black px-3 rounded-full">
            <input
              className="py-1.5 w-full bg-transparent outline-none placeholder-black"
              type="text"
              placeholder="Search products"
              value={search}
              onChange={handleSearch}
            />
            <button type="submit">
              <img src={closedsearch} className="h-5" alt="search" />
            </button>
          </form>

          <Link to="/cart">
            <div className="relative cursor-pointer">
              <img className="h-5" src={cart} alt="cart" />
              <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
                {getCartCount()}
              </button>
            </div>
          </Link>

          {user ? (
            <div className="relative group flex justify-center flex-col items-center">
              {/* Trigger Icon */}
              <div className="cursor-pointer">{user.name}</div>
              {/* Dropdown */}
              <ul className="absolute top-full right-0 mt-2 bg-white shadow-lg border border-gray-200 py-2 w-40 rounded-md text-sm z-40 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 invisible group-hover:visible">
                <li
                  onClick={() => navigate("/orders")}
                  className="px-4 py-2 hover:bg-secondary/10 cursor-pointer"
                >
                  Orders
                </li>
                <li
                  onClick={handleLogout}
                  className="px-4 py-2 hover:bg-secondary/10 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          ) : (
            <button
              className="cursor-pointer px-6 py-2 bg-primary hover:bg-primary/80 transition text-white rounded-full text-sm"
              onClick={() => setShowUserLogin(true)}
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile Right Section */}
      <div className="md:hidden flex items-center gap-2">
        {/* Mobile Search Toggle */}
        <button 
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="bg-white p-2 rounded-full"
        >
          <img src={closedsearch} className="h-5" alt="search" />
        </button>
        
        <Link to="/cart">
          <div className="bg-white p-2 rounded-full relative">
            <img className="h-5" src={cart} alt="cart" />
            <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
              {getCartCount()}
            </button>
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          className="bg-amber-900 rounded-full p-2.5"
        >
          <svg
            width="21"
            height="15"
            viewBox="0 0 21 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="21" height="1.5" rx=".75" fill="white" />
            <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="white" />
            <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="white" />
          </svg>
        </button>
      </div>

      {/* Mobile Search Bar - Appears below navbar */}
      {showMobileSearch && (
        <div className="md:hidden absolute top-full left-0 w-full px-4 py-2 bg-white shadow-md z-40">
          <form onSubmit={handleSearchSubmit} className="flex items-center w-full border border-amber-900 rounded-full px-3 py-1">
            <input
              className="flex-1 bg-transparent outline-none placeholder-gray-500 text-sm"
              type="text"
              placeholder="Search products"
              value={search}
              onChange={handleSearch}
              autoFocus
            />
            <button type="submit">
              <img src={closedsearch} className="h-5" alt="search" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg rounded-lg z-50">
          <div className="flex flex-col p-4 gap-3 justify-center items-center">
            {navItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                onClick={() => {
                  setActiveTab(item.name);
                  setOpen(false);
                }}
                className={`flex items-center p-3 w-full justify-center rounded-full hover:bg-amber-100 transition-colors ${
                  activeTab === item.name
                    ? "bg-amber-900 text-white"
                    : "text-amber-900"
                }`}
              >
                <img
                  src={
                    activeTab === item.name
                      ? item.logos.active
                      : item.logos.closed
                  }
                  className="h-5 mr-2"
                  alt={item.name}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </NavLink>
            ))}

            {user ? (
              <>
                <NavLink
                  to="/orders"
                  onClick={() => {
                    setActiveTab("Orders");
                    setOpen(false);
                  }}
                  className={`flex items-center p-3 w-full justify-center rounded-full hover:bg-amber-100 transition-colors text-amber-900  ${
                  activeTab === "Orders"
                    ? "bg-amber-900 text-white"
                    : "text-amber-900"
                }`}
                >
                  <span className="text-sm font-medium">Orders</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-3 w-full justify-center rounded-full hover:bg-amber-100 transition-colors text-amber-900"
                >
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </>
            ) : (
              <button
                className="cursor-pointer px-6 py-2 bg-primary hover:bg-primary/80 transition text-white rounded-full text-sm w-full"
                onClick={() => {
                  setShowUserLogin(true);
                  setOpen(false);
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;