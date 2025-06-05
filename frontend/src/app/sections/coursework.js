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
      link: "https://www.sfu.ca/students/calendar/2025/summer/courses/cmpt/225.html",
    },
    {
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
      link: "https://www.sfu.ca/students/calendar/2025/summer/courses/cmpt/201.html",
    },
    {
      title: "CMPT 276",
      description: "Introduction to Software Engineering",
      tags: ["Ethics", "SDLC", "Project Managment"],
      link: "https://www.sfu.ca/students/calendar/2025/summer/courses/cmpt/276.html",

    },
    {
    title: "MATH 152",
    description: "Calculus II",
    tags: [
        "Integration Techniques",
        "Improper Integrals",
        "Sequences and Series",
        "Taylor Series",
        "Parametric Equations",
        "Polar Coordinates",
        "Applications of Integration",
        "Differential Equations"
    ],
    link: "https://www.sfu.ca/students/calendar/2025/summer/courses/math/152.html",
    },
    {
    title: "MACM 316",
    description: "Numerical Analysis",
    tags: [
        "Root Finding",
        "Bisection Method",
        "Newton's Method",
        "Linear Systems",
        "LU Decomposition",
        "Interpolation",
        "Numerical Integration",
        "Error Analysis",
        "Floating Point Arithmetic",
        "Stability"
    ],
    link: "https://www.sfu.ca/students/calendar/2025/summer/courses/macm/316.html",
    },
    {
    title: "MATH 232",
    description: "Linear Algebra",
    tags: [
        "Vector Spaces",
        "Linear Transformations",
        "Matrix Algebra",
        "Gaussian Elimination",
        "Determinants",
        "Eigenvalues",
        "Eigenvectors",
        "Diagonalization",
        "Inner Products",
        "Orthogonality",
        "Basis and Dimension",
        "Applications to Systems of Equations"
    ],
    link: "https://www.sfu.ca/students/calendar/2025/summer/courses/math/232.html",
    }

  ];

  return (
    <div id="Coursework" className="bg-slate-900 min-h-screen flex flex-col items-center">
      <motion.h1
        variants={bounceInCenter}
        initial="start"
        whileInView="end"
        style={{ textShadow: "0 0 30px rgba(0, 255, 255, 0.8)" }}
        className=" sm:text-6xl md:text-8xl lg:mb-14  shadow-2xl text-5xl text-white text-center my-10"
      >
        Coursework
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coursework.map((item) => (
          <motion.div
            key={item.title}
            variants={bounceInCenter}
            initial="start"
            whileInView="end"
            className="cursor-pointer overflow-hidden rounded-xl border-2 border-[#00CAFF] transition-[box-shadow,border-color,scale]
             duration-500 shadow-xl/30 shadow-[#00CAFF] hover:border-[#00FFDE] hover:shadow-[#00FFDE] hover:scale-105 w-80"
            onClick={() => window.open(item.link, "_blank")}
          >
            <div className="group relative h-72 w-full">
              <img
                src="/SFU-block-logo.png"
                alt="SFU Logo"
                className="w-full h-40 object-cover brightness-50"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-[zinc-900] p-4">
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
                      className="text-xs bg-[#0065F8] text-white px-2 py-0.5 rounded-full"
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
