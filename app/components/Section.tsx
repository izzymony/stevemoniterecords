"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode, useRef } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  containerClassName?: string;
}

const Section = ({ children, className, id, containerClassName }: SectionProps) => {
  const ref = useRef(null);
  
  return (
    <section
      id={id}
      ref={ref}
      className={cn("relative py-24 px-6 overflow-hidden", className)}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn("max-w-7xl mx-auto relative z-10", containerClassName)}
      >
        {children}
      </motion.div>
    </section>
  );
};

export default Section;
