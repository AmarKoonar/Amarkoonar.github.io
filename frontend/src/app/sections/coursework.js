"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronsUpDown,Minimize } from "lucide-react";
import { ExternalLink, BookOpen, Calculator, Grid3X3, Zap } from 'lucide-react';
export default function Coursework() {
  const bounceInCenter = {
    start: {
      x: -500,
      opacity: 0,
      
    },
    end: {
      x: 0,
      z:50,
      opacity: 1,
      
    },
  };
  const tags = [
    "Vector Spaces",
    "Linear Transformations", 
    "Matrix Algebra",
    "Gaussian Elimination",
    "Determinants",
    "Eigenvalues",
    "Eigenvectors"
  ];
  const coursework = useMemo(
    () => [
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
          "Differential Equations",
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
          "Numerical Integration",
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
        ],
        link: "https://www.sfu.ca/students/calendar/2025/summer/courses/math/232.html",
      },
    ],
    []
  );

  const [expand, setExpand] = useState(() => Array(coursework.length).fill(false));
  const [activeIndex, setActiveIndex] = useState(null);
  // --- Hover-follow background square state ---
  const gridRef = useRef(null);
  const cardRefs = useRef([]);
  const [hoverRect, setHoverRect] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [hovering, setHovering] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Recalculate if container resizes (responsive grid)
  useEffect(() => {
    if (!gridRef.current) return;
    const ro = new ResizeObserver(() => {
      // If currently hovering, recompute position from the active element
      if (hovering) {
        const el = document.elementFromPoint(
          hoverRect.x + (gridRef.current?.getBoundingClientRect().left ?? 0) + 1,
          hoverRect.y + (gridRef.current?.getBoundingClientRect().top ?? 0) + 1
        );
        // best-effort: if pointer moved away, we skip
      }
    });
    ro.observe(gridRef.current);
    return () => ro.disconnect();
  }, [hovering, hoverRect.x, hoverRect.y]);

  const positionHighlightTo = (el) => {
    if (!el || !gridRef.current) return;
    const gridBox = gridRef.current.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    setHoverRect({
      x: box.left - gridBox.left-15,
      y: box.top - gridBox.top-15,
      w: box.width+30,
      h: box.height+30,
    });
  };

  const handleEnter = (index) => {
    const el = cardRefs.current[index];
    positionHighlightTo(el);
    setActiveIndex(index);
    setHovering(true);
    console.log(coursework[index])
  };

  const handleMove = (index) => {
    // keep it buttery smooth if layout shifts on hover
    const el = cardRefs.current[index];
    positionHighlightTo(el);
  };

  const handleLeaveGrid = () => {
    if (!expand.some(Boolean)) setHovering(false);
  };
  const anyExpanded = expand.some(Boolean);
  return (
    <div id="Coursework" className="min-h-screen flex flex-col items-center">
      <motion.h1
        variants={bounceInCenter}
        initial="start"
        whileInView="end"
        style={{ textShadow: "0 0 30px rgba(0, 255, 255, 0.8)" }}
        className="sm:text-6xl md:text-8xl lg:mb-14 shadow-2xl text-5xl text-white text-center my-10"
      >
        Coursework
      </motion.h1>

      <div
        ref={gridRef}
        onMouseLeave={handleLeaveGrid}
        className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Hover-follow background square */}
        {(
          <motion.div
            aria-hidden
            className={` absolute rounded-xl z-0 border-[#00CAFF] border-2 bg-[#00CAFF]/30 ${expand.some(Boolean) ? "z-[500] backdrop-blur-md" : ""}`}
            initial={false}
            animate={
              hovering
                ? {
                    x: expand.some(Boolean) ? 0 : hoverRect.x,
                    y: expand.some(Boolean) ? 220 : hoverRect.y,
                    width: expand.some(Boolean) ? 1011 :hoverRect.w,
                    height: expand.some(Boolean) ? 300: hoverRect.h,
                    opacity: 1,
                  }
                : { opacity: 0 }
            }
            transition={{ type: "spring", stiffness: 100, damping: 24 }}
            
          >
            {expand.some(Boolean) && (
  <>
    {/* Top-left minimize */}
    <div
      className="absolute top-2 left-2 z-[500] cursor-pointer hover:bg-[#00CAFF]/20 p-1 rounded-md border border-[#00CAFF]/40"
      onClick={() => setExpand((prev) => Array(prev.length).fill(false))}

      title="Collapse"
    >
      <Minimize className="text-[#00CAFF]" />
    </div>




    {/* Content */}
    <div className="relative z-10 h-full p-8 sm:p-10 lg:p-12 flex flex-col justify-between text-white">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold
                           bg-gradient-to-r from-[#00FFDE] via-[#A5F3FC] to-[#00CAFF]
                           bg-clip-text text-transparent mb-1">
              {coursework[activeIndex].title}
            </h1>
            <p className="text-lg sm:text-xl font-semibold text-[#CCF8FF] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#00FFDE]" />
              {coursework[activeIndex].description}
            </p>
          </div>
        </div>

        <a
          href={coursework[activeIndex].link}
          target="_blank" rel="noreferrer"
          className={`p-3 rounded-full shadow-lg border border-[#00CAFF]/40
                      bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300
                      ${isHovered ? 'scale-110' : ''}`}
          title="Open course page"
        >
          <ExternalLink className="w-6 h-6 text-[#A5F3FC]" />
        </a>
      </div>

      {/* Tags */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-2 text-[#BFF9FF]">
          <Grid3X3 className="w-5 h-5" />
          <span className="font-medium text-lg">Key Topics</span>
        </div>

        <motion.div transition={{delay:5}} className="flex flex-wrap gap-3">
          {coursework[activeIndex].tags.map((tag, i) => (
            <div
              key={tag}
              className={`px-4 py-2 rounded-full text-sm font-medium
                          border border-[#00CAFF]/40 shadow-sm
                          bg-gradient-to-r from-[#00CAFF]/10 to-[#00FFDE]/10
                          text-[#E6FDFF] transition-all duration-300
                          ${isHovered ? 'translate-y-[-2px] shadow-[#00FFDE]/20 shadow-md' : ''}`}
              style={{ transitionDelay: isHovered ? `${i * 40}ms` : '0ms' }}
            >
              {tag}
            </div>
          ))}
        </motion.div>
      </div>

    </div>
  </>
)}

          </motion.div>
        )}
        
        {coursework.map((item, index) => {
          const isActive = hovering && activeIndex === index;       // the one being hovered
          const dimOthers = hovering && activeIndex !== index;
          
          return(<motion.div
            key={item.title}
            ref={(el) => (cardRefs.current[index] = el)}
            onMouseEnter={() => handleEnter(index)}
            onMouseMove={() => handleMove(index)}
            variants={bounceInCenter}
            initial="start"
            whileInView="end"
           className={`
            relative z-10 w-80 overflow-hidden rounded-xl border-2 
            backdrop-blur-xs bg-[#00CAFF]/10 border-[#00CAFF] shadow-xl/30 shadow-[#00CAFF]
            hover:bg-[#00FFDE]/20  transition-[scale,opacity,shadow,border-color] duration-500
            ${!dimOthers ? "" : "opacity-40 scale-95"}
            ${isActive ? "scale-105 border-[#00FFDE] shadow-[#00FFDE]" : ""}
          `}
          >
            <div className="group relative  w-full h-20">
              <img
                src="/SFU-block-logo.png"
                alt="SFU Logo"
                className="w-full h-500 object-cover brightness-50"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <div
                  className="absolute top-2 left-2 cursor-pointer hover:bg-red-900 p-1 rounded-md"
                  onClick={() =>
                    setExpand((prev) => {
                      const next = [...prev];
                      next[index] = !next[index];
                      return next;
                    })
                  }
                >
                  <ChevronsUpDown />
                </div>
                <h3 className="text-white font-semibold text-lg text-center">
                  {item.title}
                  <p className="text-sm">{item.description}</p>
                </h3>
              </div>
            </div>
          </motion.div>
);})}
      </div>
    </div>
  );
}
