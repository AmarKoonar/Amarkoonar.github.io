"use client";
import { CometCard } from "@/components/ui/comet-card";
import { motion } from "framer-motion";
import { DraggableCardBody } from "@/components/ui/draggable-card";
import { DraggableCardContainer } from "@/components/ui/draggable-card";
import { useState } from "react";
export default function AboutMe() {
    const titleVariants = {
    start: {
      opacity: 0.1,
      y: 50,
      scale: 0.5,
       transition: {
        duration: 1,
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
    { name: "Python", icon: "/languages/python_icon.svg" },
    { name: "JavaScript", icon: "/languages/javascript icon.svg" },
    { name: "HTML", icon: "/languages/html icon.svg" },
    { name: "CSS", icon: "/languages/css icon.svg" },
    { name: "C++", icon: "/languages/cpp.svg" },
    { name: "C", icon: "/languages/c.svg" },
  ];

  const technologies = [
    { name: "React", icon: "/tech/react_icon.svg" },
    { name: "Git", icon: "/tech/git icon.svg" },
    { name: "GitHub", icon: "/tech/github icon.svg" },
    { name: "VS Code", icon: "/tech/vs code icon.svg" },
    { name: "Figma", icon: "/tech/figma icon.svg" },
    { name: "Neovim", icon: "/tech/neovim_logo.png" },
  ];
  const [reset, setReset] = useState([false,false,false,false,false,false]);
  const [reset1, setReset1] = useState([false,false,false,false,false,false]);
  return (
    <div id="Aboutme" className="flex flex-col items-center  min-h-screen py-16 px-4">
      <motion.h1 variants={titleVariants} initial="start" whileInView="end"
        className="text-5xl sm:text-6xl md:text-8xl lg:mb-14 mb-5 text-white text-center shadow-2xl"
        style={{ textShadow: "0 0 30px rgba(0, 255, 255, 0.8)" }}
      >
        About Me
      </motion.h1>
      
      <div className="flex flex-row">
        <motion.div variants={titleVariants} initial="start" whileInView="end" 
        className=" max-w-3xl p-6 border-2 mb-7  rounded-2xl backdrop-blur-xs bg-[#00CAFF]/10 hover:bg-[#00FFDE]/10 transition-[box-shadow,border-color,scale,background] duration-500
         shadow-xl/30 border-[#00CAFF] shadow-[#00CAFF] hover:border-[#00FFDE] hover:shadow-[#00FFDE] glass-effect"
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
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <motion.div variants={titleVariants} initial="start" whileInView="end"
          className="w-full max-w-md p-6 sm:p-8 border-2 backdrop-blur-xs bg-[#00CAFF]/10 hover:bg-[#00FFDE]/10 transition-[backdrop-filter,box-shadow,border-color,scale,background] duration-500 shadow-xl/30 border-[#00CAFF] shadow-[#00CAFF] hover:border-[#00FFDE] hover:shadow-[#00FFDE] rounded-2xl flex flex-col items-center glass-effect"
        >
          <h1 style={{ textShadow: "0 0 30px rgba(0, 255, 255, 0.8)" }} className="text-2xl sm:text-3xl mb-10 text-white text-center">
            Languages
          </h1>
          <div className="flex flex-wrap justify-center gap-5">
            {languages.map((lang,i) => (
              <div className="group " key={lang.name} >
                <div className="absolute bg-zinc-900 rounded-xl w-14 h-14 flex justify-center items-center px-5 hover:cursor-pointer transition-all duration-500 hover:shadow-[#00FFDE] hover:shadow-xl/10" onClick={() => {
  setReset1(prev => {
    const next = [...prev];
    next[i] = true;
    return next;
  });
  setTimeout(() => {
    setReset1(prev => {
      const next = [...prev];
      next[i] = false;
      return next;
    });
  }, 50);
}}>Reset</div>
                <DraggableCardBody boundaryId="Aboutme" reset={reset1[i]}>
                <div className="flex   justify-center items-center w-14 h-14 rounded-lg bg-zinc-900 group-hover:from-[#00FFDE] group-hover:to-[#00CAFF] ">
                  <div className="relative w-12 h-12 ">
                    <img src={lang.icon} alt={lang.name} fill="true" className="object-contain group-hover:brightness-125 z-0 rounded-2xl"
                    />
                  </div>
                </div>
                </DraggableCardBody>
                <span className="flex flex-col items-center mt-3 text-sm font-medium text-gray-300 group-hover:text-[#00FFDE] transition-all">
                  {lang.name}
                </span>
                
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={titleVariants} initial="start" whileInView="end" 
            className="w-full max-w-md p-6 sm:p-8 border-2 backdrop-blur-xs  bg-[#00CAFF]/10 hover:bg-[#00FFDE]/10 transition-[backdrop-filter,box-shadow,border-color,scale,background] duration-500 shadow-xl/30 border-[#00CAFF] shadow-[#00CAFF] hover:border-[#00FFDE] hover:shadow-[#00FFDE] rounded-2xl flex flex-col items-center glass-effect"
        >
          
          <h1 style={{ textShadow: "0 0 30px rgba(0, 255, 255, 0.8)" }} className="text-2xl sm:text-3xl mb-10 text-white text-center">
            Technologies
          </h1>
          <div className="flex flex-wrap justify-center gap-5" > 
            {technologies.map((lang,i) => (
              <div className="group " key={lang.name} >
                <div className="absolute bg-zinc-900 rounded-xl w-14 h-14 flex justify-center items-center px-5 hover:cursor-pointer transition-all duration-500 hover:shadow-[#00FFDE] hover:shadow-xl/10" onClick={() => {
  setReset(prev => {
    const next = [...prev];
    next[i] = true;
    return next;
  });
  setTimeout(() => {
    setReset(prev => {
      const next = [...prev];
      next[i] = false;
      return next;
    });
  }, 50);
}}>Reset</div>
                <DraggableCardBody boundaryId="Aboutme" reset={reset[i]}>
                <div className="flex   justify-center items-center w-14 h-14 rounded-lg bg-zinc-900 group-hover:from-[#00FFDE] group-hover:to-[#00CAFF] ">
                  <div className="relative w-12 h-12">
                    <img src={lang.icon} alt={lang.name} fill="true" className="object-contain group-hover:brightness-125 z-0 rounded-2xl"
                    />
                  </div>
                </div>
                </DraggableCardBody>
                <span className="flex flex-col items-center mt-3 text-sm font-medium text-gray-300 group-hover:text-[#00FFDE] transition-all">
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