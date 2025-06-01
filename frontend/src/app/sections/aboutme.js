"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Spline from "@splinetool/react-spline";
export default function AboutMe() {
    const titleVariants = {
    start: {
      opacity: 0.1,
      y: 50,
      scale: 0.8,
       transition: {
        duration: 0.7,
        type: "spring",
        stiffness: 250,
        damping: 15,
      },
    },
    end: {
      opacity: 1,
      y: 0,
      scale: 1,
     
    },
  };
  const languages = [
    { name: "Python", icon: "/" },
    { name: "JavaScript", icon: "/" },
    { name: "HTML", icon: "/" },
    { name: "CSS", icon: "/" },
    { name: "C++", icon: "/" },
    { name: "C", icon: "/" },
  ];

  const technologies = [
    { name: "React", icon: "/" },
    { name: "Git", icon: "/" },
    { name: "GitHub", icon: "/" },
    { name: "VS Code", icon: "/" },
    { name: "Figma", icon: "/" },
    { name: "Neovim", icon: "/" },
  ];

  return (
    <div className="flex flex-col items-center bg-neutral-900 min-h-screen py-16 px-4">
      <motion.h1 variants={titleVariants} initial="start" whileInView="end"
        className="text-5xl sm:text-6xl md:text-8xl lg:mb-14 mb-5 text-white text-center"
      >
        About Me
      </motion.h1>
      
      <div className="flex flex-row">
        <motion.div variants={titleVariants} initial="start" whileInView="end" 
        className="w-full max-w-3xl p-6 border-2 mb-16 border-gray-200 transition duration-500 hover:border-indigo-600 rounded-2xl"
        >
            <p className="text-base sm:text-lg leading-relaxed text-gray-300">
            I am a passionate and driven Computer Science student at Simon Fraser
            University, specializing in web development, software engineering,
            and full-stack applications. With a strong foundation in React,
            JavaScript, and Python, I enjoy building dynamic, user-focused
            solutions that are both scalable and efficient.
            <br /><br />
            I am excited to continue growing as a developer, contribute to
            innovative projects, and make a positive difference in the tech
            community.
            </p>
        </motion.div>
      </div>
      <div className="flex flex-col lg:flex-row gap-14 items-center">
        <motion.div variants={titleVariants} initial="start" whileInView="end"
          className="w-full max-w-md p-6 sm:p-8 border-2 border-gray-200 transition duration-500 hover:border-indigo-600 rounded-2xl flex flex-col items-center"
        >
          <h1 className="text-2xl sm:text-3xl mb-10 text-white text-center">
            Languages
          </h1>
          <div className="flex flex-wrap justify-center gap-5">
            {languages.map((lang) => (
              <div className="group" key={lang.name}>
                <div className="flex duration-500 transform group-hover:rotate-y-360 group-hover:rotate-x-360 group-hover:rotate-z-360 justify-center items-center w-14 h-14 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-400 transition-all group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-yellow-400">
                  <div className="relative w-12 h-12">
                    <Image src={lang.icon} alt={lang.name} fill sizes="48px"
                      className="object-contain group-hover:brightness-125"
                    />
                  </div>
                </div>
                <span className="flex flex-col items-center mt-3 text-sm font-medium text-gray-300 group-hover:text-pink-500 transition-all">
                  {lang.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={titleVariants} initial="start" whileInView="end"
            className="w-full max-w-md p-6 sm:p-8 border-2  border-gray-200 transition duration-500 hover:border-indigo-600 rounded-2xl flex flex-col items-center"
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-10 text-white text-center">
            Technologies
          </h1>
          <div className="flex flex-wrap justify-center gap-5">
            {technologies.map((lang) => (
              <div className="group" key={lang.name}>
                <div className="flex  duration-20000 transform group-hover:rotate-y-3600 group-hover:rotate-z-3600 group-hover:rotate-x-3600 justify-center items-center w-14 h-14 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-400 transition-all group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-yellow-400">
                  <div className="relative w-12 h-12">
                    <Image src={lang.icon} alt={lang.name} fill sizes="48px" className="object-contain group-hover:brightness-125"
                    />
                  </div>
                </div>
                <span className="flex flex-col items-center mt-3 text-sm font-medium text-gray-300 group-hover:text-pink-500 transition-all">
                  {lang.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>



    </div>

  );
}
