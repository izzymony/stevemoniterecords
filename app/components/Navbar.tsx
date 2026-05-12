"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Music } from "lucide-react";
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

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-4",
        scrolled ? "py-3" : "py-6"
      )}
    >
      <div className={cn(
        "max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500",
        scrolled ? "glass-dark shadow-2xl backdrop-blur-xl" : "bg-transparent"
      )}>
        {/* BRAND LOGO SECTION */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-accent-orange/30 group-hover:border-accent-orange transition-all duration-500 shadow-[0_0_15px_rgba(255,107,0,0.2)] group-hover:shadow-[0_0_25px_rgba(255,107,0,0.4)]">
            <Image
              src="/WhatsApp Image 2026-05-12 at 10.02.23.jpeg"
              alt="Steve Monite Logo"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter uppercase leading-none">
              STEVE <span className="text-accent-orange">MONITE</span>
            </span>
            <span className="text-[9px] font-bold tracking-[0.4em] text-white/40 uppercase mt-1">
              Afro-Boogie Pioneer
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[11px] font-black hover:text-accent-orange transition-all duration-300 uppercase tracking-[0.2em] relative group/link"
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
            className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-accent-orange hover:text-white transition-all duration-300 shadow-xl"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-6 right-6 mt-4 glass-dark rounded-3xl p-8 md:hidden border border-white/10"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-bold uppercase tracking-widest hover:text-accent-orange"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-white/10" />
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                {/*   <Instagram className="w-5 h-5 hover:text-accent-orange" />
                  <Twitter className="w-5 h-5 hover:text-accent-orange" /> */}
                </div>
                <Link
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 rounded-full bg-accent-orange text-white text-xs font-bold uppercase"
                >
                  Book Artist
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;