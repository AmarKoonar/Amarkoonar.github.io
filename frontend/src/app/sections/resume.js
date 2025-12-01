"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Resume() {
const fade_variant = {
  start: {
    opacity: 0,

  },
  end: {
    opacity: 1,
    z:50,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

  return (
    <div id="Resume" className="flex flex-col items-center min-h-screen py-16 px-4">
      <motion.h1
        variants={fade_variant}
        initial="start"
        whileInView="end"
        style={{ textShadow: "0 0 30px rgba(0, 255, 255, 0.8)" }}
        className="sm:text-6xl md:text-8xl lg:mb-14 shadow-2xl text-5xl text-white text-center my-10"
      >
        Resume
      </motion.h1>

      <motion.iframe
        src="/Amars_Resume.pdf"
        variants={fade_variant}
        initial="start"
        whileInView="end"
        className="w-300 h-[600px] rounded-xl border-2 border-[#00CAFF] shadow-xl duration-500 hover:border-[#00FFDE] hover:shadow-[#00FFDE] glass-effect"
      />
    </div>
  );
}
