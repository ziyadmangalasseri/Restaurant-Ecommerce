"use client";
import { useState, useEffect, useCallback, useRef, use } from "react";
import { ShoppingCart, Heart, LogIn, Bell,ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthModal, UserMenu } from "./AuthModal";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useSelector } from "react-redux";

export default function Navbar() {
  const [click, setClick] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname === "/#";

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAuthenticated = status === "authenticated";
  const cartItems = useSelector((store) => store.cart.items);

  const PRODUCTS_DROPDOWN =[
    { name: "All Products", path: "/products" },
    { name: "New Arrivals", path: "/#new-arrivals" , type: "scroll", id: "new-arrivals"},
    { name: "Top Picks", path: "/#top-products", type: "scroll", id: "top-products" },
  ]

  const NAV_LINKS = [
    { name: "Home", type: isHomePage ? "scroll" : "link", id: "home", path: "/" },
    { name: "Categories", type: isHomePage ? "scroll" : "link", id: "categories", path: "/#categories" },
    {
      name: "Products",
      type: "dropdown",
      id: "products",
      dropdownItems: PRODUCTS_DROPDOWN,
    },
    { name: "About", type: isHomePage ? "scroll" : "link", id: "about", path: "/#about" },
    { name: "Contact", type: "link", id: "contact", path: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // close dropdown when clicking outside

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  })

  useEffect(() => {
    if (!isHomePage) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = entry.target.id;
          const isTop = window.scrollY < 100;
          setActiveLink(isTop ? "home" : section);
        }
      });
    }, { rootMargin: "-50px 0px -50px 0px", threshold: 0.3 });

    NAV_LINKS.forEach((link) => {
      if (link.type === "scroll") {
        const section = document.getElementById(link.id);
        if (section) observer.observe(section);
      }
    });
    return () => observer.disconnect();
  }, [isHomePage]);

  const handleLinkClick = useCallback((linkName) => {
    setActiveLink(linkName);
    setClick(false);
    setOpenDropdown(null);
  }, []);

  const scrollToSection = useCallback((id) => {
    const section = document.getElementById(id);
    if (section) {
      const offset = 80;
      const position = section.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: position, behavior: "smooth" });
    }
  }, []);

  const handleDropdownToggle = (dropdownid)=>{
    setOpenDropdown(openDropdown === dropdownid ? null :dropdownid);
  }
  const handleLogout = async () => {
    await signOut({ redirect: false });
    setClick(false);
  };
   const renderNavItem = (item) => {
    const isActive = item.type === "scroll" ? activeLink === item.id : pathname === item.path;
    
    if (item.type === "dropdown") {
      return (
        <li key={item.name} className="relative" ref={dropdownRef}>
          <button
            onClick={() => handleDropdownToggle(item.id)}
            className={`flex items-center space-x-1 hover:text-[#1a2649] transition-colors ${
              isActive ? 'text-[#1a2649]' : 'text-gray-700'
            }`}
          >
            <span>{item.name}</span>
            <ChevronDown 
              className={`w-4 h-4 transition-transform ${
                openDropdown === item.id ? 'rotate-180' : ''
              }`} 
            />
          </button>
          
          {/* Dropdown Menu */}
          {openDropdown === item.id && item.dropdownItems &&(
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="py-2">
                {item.dropdownItems.map((dropdownItem) => {
                  if (dropdownItem.type === "scroll") {
                    return (
                      <a
                        key={dropdownItem.name}
                        href={`#${dropdownItem.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(dropdownItem.id);
                          handleLinkClick(dropdownItem.id);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#1a2649] transition-colors"
                      >
                        {dropdownItem.name}
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={dropdownItem.name}
                      href={dropdownItem.path}
                      onClick={() => handleLinkClick(item.id)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#1a2649] transition-colors"
                    >
                      {dropdownItem.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </li>
      );
    }

    if (item.type === "scroll") {
      return (
        <li key={item.name}>
          <a
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(item.id);
              handleLinkClick(item.id);
            }}
            className={`hover:text-[#1a2649] transition-colors ${
              isActive ? 'text-[#1a2649]' : 'text-gray-700'
            }`}
          >
            {item.name}
          </a>
        </li>
      );
    }

    return (
      <li key={item.name}>
        <Link
          href={item.path}
          onClick={() => handleLinkClick(item.id)}
          className={`hover:text-[#1a2649] transition-colors ${
            isActive ? 'text-[#1a2649]' : 'text-gray-700'
          }`}
        >
          {item.name}
        </Link>
      </li>
    );
  };

  const renderMobileNavItem = (item) => {
    const isActive = item.type === "scroll" ? activeLink === item.id : pathname === item.path;
    
    // For mobile, show individual links instead of dropdown
    if (item.type === "dropdown" && item.dropdown) {
      return item.dropdown.map((dropdownItem) => {
        if (dropdownItem.type === "scroll") {
          const isDropdownActive = activeLink === dropdownItem.id;
          return (
            <li key={dropdownItem.name}>
              <a
                href={`#${dropdownItem.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(dropdownItem.id);
                  handleLinkClick(dropdownItem.id);
                  setClick(false);
                }}
                className={`block px-4 py-2 rounded ${
                  isDropdownActive ? 'bg-blue-100 text-[#1a2649]' : 'text-gray-800'
                }`}
              >
                {dropdownItem.name}
              </a>
            </li>
          );
        }
        return (
          <li key={dropdownItem.name}>
            <Link
              href={dropdownItem.path}
              onClick={() => setClick(false)}
              className={`block px-4 py-2 rounded ${
                pathname === dropdownItem.path ? 'bg-blue-100 text-[#1a2649]' : 'text-gray-800'
              }`}
            >
              {dropdownItem.name}
            </Link>
          </li>
        );
      });
    }

    if (item.type === "scroll") {
      return (
        <li key={item.name}>
          <a
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(item.id);
              handleLinkClick(item.id);
              setClick(false);
            }}
            className={`block px-4 py-2 rounded ${
              isActive ? 'bg-blue-100 text-[#1a2649]' : 'text-gray-800'
            }`}
          >
            {item.name}
          </a>
        </li>
      );
    }

    return (
      <li key={item.name}>
        <Link
          href={item.path || '/'}
          onClick={() => setClick(false)}
          className={`block px-4 py-2 rounded ${
            isActive ? 'bg-blue-100 text-[#1a2649]' : 'text-gray-800'
          }`}
        >
          {item.name}
        </Link>
      </li>
    );
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-[#1a2649]">EASYEATS</Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6 text-sm font-medium">
          {NAV_LINKS.map(renderNavItem)}
        </ul>

        {/* Icons for Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/cart" className="relative">
            <ShoppingCart className="text-gray-600 hover:text-[#1a2649]" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
          {user ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <button onClick={() => setAuthModalOpen(true)}>
              <LogIn className="text-gray-600 hover:text-[#1a2649]" />
            </button>
          )}
        </div>

        {/* Mobile Navigation Icons and Toggle */}
        <div className="flex md:hidden items-center space-x-4">
          <Link href="/cart" className="relative">
            <ShoppingCart className="text-gray-600 hover:text-[#1a2649]" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
          <button 
            onClick={() => setClick(!click)} 
            className="flex flex-col justify-center items-center"
          >
            <span className="block w-6 h-0.5 bg-gray-600 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-600 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-600"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-0 right-0 w-3/4 max-w-xs h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
        click ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-5">
          <ul className="space-y-3">
            {NAV_LINKS.map(renderMobileNavItem)}
          </ul>

          <div className="mt-6 border-t pt-4">
            {user ? (
              <button 
                onClick={handleLogout} 
                className="w-full text-left text-red-600 hover:bg-red-50 px-4 py-2 rounded"
              >
                Sign Out
              </button>
            ) : (
              <button 
                onClick={() => { 
                  setAuthModalOpen(true); 
                  setClick(false); 
                }} 
                className="w-full bg-[black] text-white px-4 py-2 rounded hover:bg-[#1a2649]"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {click && (
        <div 
          onClick={() => setClick(false)} 
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-40"
        ></div>
      )}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
}
