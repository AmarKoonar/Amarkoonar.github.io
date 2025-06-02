"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Projects() {
    const leftVariant = {
    hidden: { opacity: 0, x: -200,transition: { duration: 1 },},
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1 },
    },
  };

  const rightVariant = {
    hidden: { opacity: 0, x: 200,transition: { duration: 1 }, },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1 },
    },
  };

  const projects = [
    {
      id: 1,
      title: "Thinkforge",
      image: "/projects/thinkforge.png",
      gridClass: "col-span-2 row-span-1",
      link: "https://github.com/AmrajKoonar/ThinkForge",
      dis: "Thinkforge is a web app that creates quizzes based on user-selected topics and difficulty levels. It’s built with Next.js, Tailwind, and React, and uses the OpenAI API to generate questions in real-time. The backend runs on serverless API routes, and a CI/CD pipeline handles deployment and previews. The project focuses on dynamic content generation and streamlined deployment.",
    },
    {
      id: 2,
      title: "Pokedex web app",
      image: "/projects/pokemon1.png",
      gridClass: "col-span-1 row-span-1",
      link: "https://github.com/AmarKoonar/Pokemon_Library",
      dis: "TThis project is a Pokédex-style application built with React, Vite, and Bootstrap 5. It features a card-based layout styled with modular CSS, with visual elements that change based on Pokémon types. It’s mainly focused on frontend UI and API usage.",
    },
    {
      id: 3,
      title: "SFU Weather X Bot",
      image: "/projects/twitterbot.png",
      gridClass: "col-span-1 row-span-1",
      link: "https://github.com/AmarKoonar/SFU-weather-twitter-bot",
      dis: "TwitterBot is a script that scrapes images and descriptions from websites using BeautifulSoup and posts them to X (Twitter) through its API. It automates the process of finding content and sharing it as tweets with captions. The project combines basic web scraping with automated API posting.",
    },
    {
      id: 4,
      title: "Posture App",
      image: "/projects/flaskapp.png",
      gridClass: "col-span-2 row-span-1",
      link: "https://github.com/AmarKoonar/posture_corrector",
      dis: "The Posture Detection App is a desktop application that uses a webcam to check sitting posture in real time. It’s built with Flask, MediaPipe, and PyWebView, and packaged with PyInstaller. The app tracks body landmarks to detect slouching and alerts the user when posture needs correcting. It focuses on simple real-time feedback using computer vision.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl text-center mb-16 flex justify-center space-x-4 ">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={index % 2 === 0 ? leftVariant : rightVariant}
              initial="hidden"
              whileInView="visible"
              className={`cursor-pointer overflow-hidden relative rounded-xl border-2 border-gray-200 duration-500 hover:border-pink-500 ${project.gridClass}`}
              onClick={() => window.open(project.link, "_blank")}
            >
              
              <div className="group relative sm:h-72 md:h-80 w-full">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover brightness-50"
                />
                <div className="absolute h-80 top-69 left-0 right-0 transition-all duration-500 bg-zinc-900 group-hover:top-30 bg-opacity-50 p-3">
                  <h3 className="text-white font-semibold text-lg">
                    {project.title}
                  </h3>
                  <h4 className="text-white text-md">
                    {project.dis}
                  </h4>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
