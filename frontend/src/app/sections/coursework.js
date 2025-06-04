"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Coursework() {
  const bounceInCenter = {
    start: {
      x: -500,
      opacity: 0,
      transition: {
        type: "spring",
        duration: 1,
        stiffness: 120,
        damping: 12,
      },
    },
    end: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
      },
    },
  };

  const coursework = [
    {
      id: 1,
      title: "CMPT 225",
      description: "Data Structures and Programming",
      tags: [
        "Linked Lists",
        "Stacks",
        "Queues",
        "Trees",
        "AVL Trees",
        "Hash Maps",
        "C++",
        "OOP",
        "Memory Management",
        "Debugging",
      ],
      link: "https://www.sfu.ca",
      image: "/images/cmpt225.jpg",
    },
    {
      id: 2,
      title: "CMPT 201",
      description: "Systems Programming",
      tags: [
        "Processes",
        "Concurrency",
        "Threads",
        "System Calls",
        "Memory Allocation",
        "File Systems",
        "IPC",
        "C",
      ],
      link: "https://www.sfu.ca",
      image: "/images/cmpt300.jpg",
    },
    {
      id: 3,
      title: "CMPT 376W",
      description: "Tech Writing & Ethics",
      tags: ["Writing", "Ethics", "Documentation", "Communication"],
      link: "https://www.sfu.ca",
      image: "/images/cmpt376w.jpg",
    },
  ];

  return (
    <div className="bg-slate-950 min-h-screen flex flex-col items-center">
      <motion.h1
        variants={bounceInCenter}
        initial="start"
        whileInView="end"
        style={{ textShadow: "0 0 30px rgba(0, 255, 255, 0.8)" }}
        className=" sm:text-6xl md:text-8xl lg:mb-14  shadow-2xl text-5xl text-white text-center my-10"
      >
        Coursework
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {coursework.map((item) => (
          <motion.div
            key={item.id}
            variants={bounceInCenter}
            initial="start"
            whileInView="end"
            className="cursor-pointer overflow-hidden rounded-xl border-2 border-gray-200 transition-[box-shadow,border-color] duration-500 hover:border-cyan-400 shadow-cyan-400 hover:shadow-2xl w-80"
            onClick={() => window.open(item.link, "_blank")}
          >
            <div className="group relative h-72 w-full">
              <img
                src="/SFU-block-logo.svg"
                alt="SFU Logo"
                className="w-full h-full object-cover brightness-50"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-zinc-900 p-4">
                <h3 className="text-white font-semibold text-lg">
                  {item.title}
                </h3>
                <h4
                  className="text-white text-md mb-2"
                >
                  {item.description}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-cyan-700 text-white px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
