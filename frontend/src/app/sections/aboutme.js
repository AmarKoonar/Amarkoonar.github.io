"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutMe() {
    const titleVariants = {
    start: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    end: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        type: "spring",
        stiffness: 250,
        damping: 15,
      },
    },
  };
  const languages = [
    { name: "Python", icon: "/Python icon.svg" },
    { name: "JavaScript", icon: "/javascript icon.svg" },
    { name: "HTML", icon: "/html icon (1).svg" },
    { name: "CSS", icon: "/css icon.svg" },
    { name: "C++", icon: "/C++ Icon.svg" },
    { name: "C", icon: "/C icon.svg" },
  ];

  const technologies = [
    { name: "React", icon: "/react icon.svg" },
    { name: "Git", icon: "/git icon.svg" },
    { name: "GitHub", icon: "/github icon.svg" },
    { name: "VS Code", icon: "/vs code icon.svg" },
    { name: "Figma", icon: "/figma icon.svg" },
    { name: "Neovim", icon: "/neovim icon.svg" },
  ];

  return (
    <div className="flex flex-col items-center bg-black min-h-screen py-16 px-4">
      <motion.h1
        variants={titleVariants}
        initial="start"
        whileInView="end"
        className="text-5xl sm:text-6xl md:text-8xl font-bold lg:mb-14 mb-5 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 text-center"
      >
        About Me
      </motion.h1>
      <motion.div
        variants={titleVariants}
        initial="start"
        whileInView="end"
        className="w-full max-w-3xl p-6 border-2 mb-16 border-indigo-600 rounded-2xl"
      >
        <p className="text-base sm:text-lg leading-relaxed text-gray-300">
          I am a passionate and driven Computer Science student at Simon Fraser
          University, specializing in web development, software engineering,
          and full-stack applications. With a strong foundation in React,
          JavaScript, and Python, I enjoy building dynamic, user-focused
          solutions that are both scalable and efficient.
          <br /><br />
          Beyond coding, I thrive in collaborative environments where I can work
          with others to solve problems, share ideas, and create meaningful
          impact. I am constantly learning new technologies and refining my
          skills, with a focus on writing clean, maintainable code.
          <br /><br />
          I am excited to continue growing as a developer, contribute to
          innovative projects, and make a positive difference in the tech
          community.
        </p>
      </motion.div>
    </div>
  );
}
