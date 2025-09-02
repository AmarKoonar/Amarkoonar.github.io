"use client";
import React from "react";
import { motion } from "framer-motion";
export default function Resume() {
const spining_varient = {
  start: {
    borderRadius: "50%",
    scale: 0,
    opacity: 0,
    rotate: -180
  },
  end: {
    borderRadius: "0%",
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 60,
      duration: 1.2
    }
  }
}

  return (
    <div id="Resume" className="flex flex-col items-center min-h-screen py-16 px-4">
        <motion.h1
                variants={spining_varient}
                initial="start"
                whileInView="end"
                style={{ textShadow: "0 0 30px rgba(0, 255, 255, 0.8)" }}
                className=" sm:text-6xl md:text-8xl lg:mb-14  shadow-2xl text-5xl text-white text-center my-10"
              >
                Resume
        </motion.h1>

             <iframe
            src="/Amars_Resume.pdf"
            className="w-300 h-[600px] rounded-xl border-2 border-[#00CAFF] shadow-xl duration-500 hover:border-[#00FFDE] hover:shadow-[#00FFDE] hover:scale-103 glass-effect"
        />

        
    </div>
  )
}