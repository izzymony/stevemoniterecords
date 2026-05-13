"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram, FaFacebook, FaSpotify } from 'react-icons/fa6';
import { cn } from "@/lib/utils";
import Image from "next/image";

const navLinks = [
  { name: "Home", href: "#hero" },
  { name: "Releases", href: "#releases" },
  { name: "About", href: "#about" },
  { name: "Videos", href: "#videos" },
  { name: "Gallery", href: "#gallery" },
  { name: "Events", href: "#events" },
  { name: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 1.1,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren",
      },
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0 },
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-4",
        scrolled ? "py-3" : "py-6"
      )}
    >
      <div className={cn(
        "max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500 relative z-[110]",
        scrolled || isOpen ? "glass-dark shadow-2xl backdrop-blur-xl" : "bg-transparent"
      )}>
        {/* BRAND LOGO SECTION */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-accent-orange/30 group-hover:border-accent-orange transition-all duration-500 shadow-[0_0_15px_rgba(255,107,0,0.2)] group-hover:shadow-[0_0_25px_rgba(255,107,0,0.4)]">
            <Image
              src="/WhatsApp Image 2026-05-12 at 10.02.23.jpeg"
              alt="Steve Monite Logo"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm md:text-lg font-black tracking-tighter uppercase leading-none">
              STEVE <span className="text-accent-orange">MONITE</span>
            </span>
            <span className="text-[7px] md:text-[9px] font-bold tracking-[0.4em] text-white/40 uppercase mt-1">
              Afro-Boogie Pioneer
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[10px] lg:text-[11px] font-black hover:text-accent-orange transition-all duration-300 uppercase tracking-[0.2em] relative group/link"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent-orange transition-all duration-300 group-hover/link:w-full" />
            </Link>
          ))}
        </div>

        {/* CTA / Booking */}
        <div className="hidden md:block">
          <Link
            href="#contact"
            className="px-6 py-2.5 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-accent-orange hover:text-white transition-all duration-300 shadow-xl"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <div className="w-6 h-5 relative flex flex-col justify-between items-center">
            <motion.span
              animate={isOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
              className="w-full h-[2px] bg-white rounded-full block origin-center transition-all duration-300"
            />
            <motion.span
              animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
              className="w-full h-[2px] bg-white rounded-full block transition-all duration-300"
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
              className="w-full h-[2px] bg-white rounded-full block origin-center transition-all duration-300"
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-[105] bg-black/98 backdrop-blur-2xl md:hidden flex flex-col items-center justify-center p-8 overflow-hidden"
          >
            <div className="flex flex-col items-center gap-6 w-full max-w-sm relative z-10">
              {navLinks.map((link) => (
                <motion.div key={link.name} variants={itemVariants} className="w-full text-center">
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-2xl font-black uppercase tracking-[0.3em] hover:text-accent-orange transition-colors duration-300 block py-1"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div variants={itemVariants} className="w-20 h-px bg-accent-orange/50 my-4" />
              
              <motion.div variants={itemVariants} className="flex gap-8 items-center">
                <Link href="https://instagram.com/stevemoniteofficial" target="_blank">
                  <FaInstagram size="1.8em" className="text-white hover:text-accent-orange transition-colors" />
                </Link>
                <Link href="https://facebook.com/stevemonite" target="_blank">
                  <FaFacebook size="1.8em" className="text-white hover:text-accent-orange transition-colors" />
                </Link>
                <Link href="https://open.spotify.com/artist/stevemonite" target="_blank">
                  <FaSpotify size="1.8em" className="text-white hover:text-accent-orange transition-colors" />
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-6">
                <Link
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className="px-10 py-4 rounded-full bg-accent-orange text-white text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(255,107,0,0.3)] hover:scale-105 transition-transform"
                >
                  Book Artist Now
                </Link>
              </motion.div>
            </div>

            {/* Decorative background elements */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 -left-20 w-80 h-80 bg-accent-orange/10 rounded-full blur-[100px]" 
            />
            <motion.div 
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent-purple/10 rounded-full blur-[100px]" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;