"use client";
import { useState, useEffect, useCallback } from "react";
import { ShoppingCart, Heart, LogIn, Bell } from "lucide-react";
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
  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname === "/#";

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAuthenticated = status === "authenticated";
  const cartItems = useSelector((store) => store.cart.items);

  const NAV_LINKS = [
    { name: "Home", type: isHomePage ? "scroll" : "link", id: "home", path: "/" },
    { name: "Categories", type: isHomePage ? "scroll" : "link", id: "categories", path: "/#categories" },
    { name: "All Products", type: "link", id: "products", path: "/products" },
    { name: "New Arrivals", type: isHomePage ? "scroll" : "link", id: "new-arrivals", path: "/#new-arrivals" },
    { name: "Top Picks", type: isHomePage ? "scroll" : "link", id: "top-products", path: "/#top-products" },
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
  }, []);

  const scrollToSection = useCallback((id) => {
    const section = document.getElementById(id);
    if (section) {
      const offset = 80;
      const position = section.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: position, behavior: "smooth" });
    }
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setClick(false);
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">EASYEATS</Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6 text-sm font-medium">
          {NAV_LINKS.map((item) => {
            const isActive = item.type === "scroll" ? activeLink === item.id : pathname === item.path;
            return (
              <li key={item.name}>
                {item.type === "scroll" ? (
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                      handleLinkClick(item.id);
                    }}
                    className={`hover:text-blue-600 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-700'}`}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    href={item.path}
                    onClick={() => handleLinkClick(item.id)}
                    className={`hover:text-blue-600 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-700'}`}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* Icons for Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/cart" className="relative">
            <ShoppingCart className="text-gray-600 hover:text-blue-600" />
            {cartItems.length > 0 && <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center">{cartItems.length}</span>}
          </Link>
          {user ? <UserMenu user={user} onLogout={handleLogout} /> : <button onClick={() => setAuthModalOpen(true)}><LogIn className="text-gray-600 hover:text-blue-600" /></button>}
        </div>

        {/* Mobile Navigation Icons and Toggle */}
        <div className="flex md:hidden items-center space-x-4">
          <Link href="/cart" className="relative">
            <ShoppingCart className="text-gray-600 hover:text-blue-600" />
            {cartItems.length > 0 && <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center">{cartItems.length}</span>}
          </Link>
          <button onClick={() => setClick(!click)} className="flex flex-col justify-center items-center">
            <span className="block w-6 h-0.5 bg-gray-600 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-600 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-600"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-0 right-0 w-3/4 max-w-xs h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${click ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5">
          <ul className="space-y-3">
            {NAV_LINKS.map((item) => {
              const isActive = item.type === "scroll" ? activeLink === item.id : pathname === item.path;
              return (
                <li key={item.name}>
                  {item.type === "scroll" ? (
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(item.id);
                        handleLinkClick(item.id);
                        setClick(false);
                      }}
                      className={`block px-4 py-2 rounded ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-800'}`}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      href={item.path}
                      onClick={() => setClick(false)}
                      className={`block px-4 py-2 rounded ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-800'}`}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-6 border-t pt-4">
            {user ? (
              <button onClick={handleLogout} className="w-full text-left text-red-600 hover:bg-red-50 px-4 py-2 rounded">Sign Out</button>
            ) : (
              <button onClick={() => { setAuthModalOpen(true); setClick(false); }} className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sign In / Register</button>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {click && <div onClick={() => setClick(false)} className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-40"></div>}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
}