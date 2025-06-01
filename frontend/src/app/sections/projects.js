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
      title: "Project1",
      image: "/place.png",
      gridClass: "col-span-2 row-span-1",
      dis: "this is a cool projcet blah blah blah",
    },
    {
      id: 2,
      title: "Project2",
      image: "/place.png",
      gridClass: "col-span-1 row-span-1",
      dis: "this is a cool projcet blah blah blah",
    },
    {
      id: 3,
      title: "Project3",
      image: "/place.png",
      gridClass: "col-span-1 row-span-1",
      dis: "this is a cool projcet blah blah blah",
    },
    {
      id: 4,
      title: "Project4",
      image: "/place.png",
      gridClass: "col-span-2 row-span-1",
      dis: "this is a cool projcet blah blah blah",
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
            >
              
              <div className="group relative sm:h-72 md:h-80 w-full">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute h-80 top-69 left-0 right-0 transition-all duration-500 bg-zinc-900 group-hover:top-0 bg-opacity-50 p-3">
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
