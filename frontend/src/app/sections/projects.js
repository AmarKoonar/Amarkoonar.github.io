"use client";
import React from "react";
import { motion } from "framer-motion";
import { CometCard } from "@/components/ui/comet-card";
import { CardBody } from "@/components/ui/3d-card";
import { CardItem } from "@/components/ui/3d-card";
export default function Projects() {
    const leftVariant = {
    hidden: { opacity: 0, x: '-25vw',transition: { duration: 5 },},
    visible: {
      opacity: 5,
      x: 0,
      transition: {  
        type: "spring",
        duration: 5,
        stiffness: 100,
        damping: 20, },
    },
  };

  const rightVariant = {
    hidden: { opacity: 0, x: '25vw',transition: { duration: 5 }, },
    visible: {
      opacity: 1,
      x: 0,
      transition: {  
        type: "spring",
        duration: 5,
        stiffness: 100,
        damping: 20, },
    },
  };
    const smleftVariant = {
    hidden: { opacity: 0, x: '-25vw',transition: { duration: 5 },},
    visible: {
      opacity: 5,
      x: 0,
      transition: {  
        type: "spring",
        duration: 5,
        stiffness: 100,
        damping: 20, },
    },
  };

  const smrightVariant = {
    hidden: { opacity: 0, x: '25vw',transition: { duration: 5 }, },
    visible: {
      opacity: 1,
      x: 0,
      transition: {  
        type: "spring",
        duration: 5,
        stiffness: 100,
        damping: 20, },
    },
  };
  const projects = [
  {
    id: 1,
    title: "GitGood",
    image: "/projects/gitgood.PNG",
    gridClass: "col-span-2 row-span-1 ",
    hoverheight: "group-hover:top-38",
    link: "https://github.com/CMPT-276-SUMMER-2025/final-project-15-mountains",
    dis: "Web app that that helps developers level up their github accounts by providing AI-generated suggestions for improving code quality, documentation, and best practices. Built with Next.js, Tailwind CSS, shadcn/ui, and OpenAI API.",
    status: "completed",
    tags: ["Next.js", "Tailwind", "React", "shadcn/ui", "OpenAI", "CI/CD"],
    demoUrl: "https://gitgood-pink.vercel.app/"
  },
  {
    id: 2,
    title: "Pokédex Web App",
    image: "/projects/pokemon1.png",
    gridClass: "col-span-1 row-span-1",
    hoverheight: "group-hover:top-38",
    link: "https://github.com/AmarKoonar/Pokemon_Library",
    dis: "Pokédex-style application built with React, Vite, and Bootstrap 5. Uses a modular CSS card-based layout with dynamic visual elements based on Pokémon type and API-driven data fetching.",
    status: "completed",
    tags: ["React", "Vite", "Bootstrap 5", "PokéAPI"]
  },
  {
    id: 3,
    title: "SFU Weather X Bot",
    image: "/projects/twitterbot.png",
    gridClass: "col-span-1 row-span-1",
    hoverheight: "group-hover:top-38",
    link: "https://github.com/AmarKoonar/SFU-weather-twitter-bot",
    dis: "Automated Twitter bot that scrapes weather data and posts updates to X using the Twitter API. Built with Python and BeautifulSoup, integrating web scraping and scheduled posting.",
    status: "completed",
    tags: ["Python", "BeautifulSoup", "Twitter API"]
  },
  {
    id: 4,
    title: "Posture App",
    image: "/projects/flaskapp.png",
    gridClass: "col-span-2 row-span-1",
    hoverheight: "group-hover:top-38",
    link: "https://github.com/AmarKoonar/posture_corrector",
    dis: "Desktop app that uses a webcam and MediaPipe to detect slouching in real time. Built with Flask and PyWebView, packaged with PyInstaller. Provides instant posture alerts using computer vision.",
    status: "completed",
    tags: ["Flask", "MediaPipe", "PyWebView", "PyInstaller"]
  }
];


  return (
    <div id="Projects" className="min-h-screen py-30 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl text-center mb-16 flex justify-center space-x-4 " style={{ textShadow: "0 0 30px rgba(0, 255, 255, 0.8)" }}>
          <motion.span
            variants={leftVariant}
            initial="hidden"
            whileInView="visible"
            className="text-8xl mx-0 text-white"
          >
            Pro
          </motion.span>
          <motion.span
            variants={rightVariant}
            initial="hidden"
            whileInView="visible"
            className="text-8xl text-white"
          >
            jects
          </motion.span>
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <CometCard  key={project.id} className="relative z-0 hover:z-[60]">
            <motion.div
              
              variants={index % 2 === 0 ? leftVariant : rightVariant}
              initial="hidden"
              whileInView="visible"
              className={`overflow-hidden relative rounded-xl border-2 border-[#00CAFF] transition-[box-shadow,border-color,scale]
                 duration-500 shadow-[#00CAFF] shadow-xl/30 hover:border-[#00FFDE] hover:shadow-[#00FFDE] glass-effect ${project.gridClass}`}
              // onClick={() => window.open(project.link, "_blank")}
            >
              
              <div className="group relative sm:h-72 md:h-80 w-full">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover brightness-50"
                />
                <div className={`absolute h-80 border-t-2  border-[#00CAFF] hover:border-[#00FFDE] hover:shadow-[#00FFDE] top-68 left-0 right-0 transition-all duration-500  bg-[#00CAFF]/10 hover:bg-[#00FFDE]/10 backdrop-blur-sm ${project.hoverheight} bg-opacity-50 p-3`}>
                   <div className="flex justify-between items-start mb-4">
    <div className="flex-1">
      <h3 className="text-white font-bold text-xl mb-2 leading-tight flex flex-row items-center gap-3">
        {project.title}
        {project.demoUrl && (
        <a 
          href={project.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="View Demo"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
        </a>
        
      )}
      {project.link && (
        <a 
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="View on GitHub"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
      )}
      </h3>
      <p className="text-gray-300 text-sm leading-relaxed">
        {project.dis}
      </p>
    </div>
    
    {/* Status Badge */}
    <span className={`px-3 py-1 rounded-full text-xs font-medium ml-4 whitespace-nowrap ${
      project.status === 'completed' ? 'bg-green-600 text-green-100' :
      project.status === 'in-progress' ? 'bg-blue-600 text-blue-100' :
      'bg-yellow-600 text-yellow-100'
    }`}>
      {project.status || 'Active'}
    </span>
  </div>

  {/* Tags */}
  {project.tags && project.tags.length > 0 && (
    <div className="flex flex-wrap gap-2 mb-4">
      {project.tags.map((tag, index) => (
        <span 
          key={index}
          className="px-2 py-1 bg-gray-700 text-gray-200 rounded-md text-xs font-medium hover:bg-gray-600 transition-colors"
        >
          {tag}
        </span>
      ))}
    </div>
  )}


                </div>
              </div>
             
            </motion.div>
            </CometCard>
          ))}
        </div>
      </div>
    </div>
  );
}