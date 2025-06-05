"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
export default function Titlepage() {
  const [visible, setVisible] = useState(true);

  const TitleVariants = [
    {
      start: { x: -1000, opacity: 0 },
      end: { x: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } },
      exit: { x: -1000, opacity: 0, transition: { duration: 0.5 } },
    },
    {
      start: { x: 1000, opacity: 0 },
      end: { x: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } },
      exit: { x: 1000, opacity: 0, transition: { duration: 0.5 } },
    },
    {
      start: { y: -1000, opacity: 0 },
      end: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } },
      exit: { y: -1000, opacity: 0, transition: { duration: 0.5 } },
    },
    {
      start: { y: 1000, opacity: 0 },
      end: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } },
      exit: { y: 1000, opacity: 0, transition: { duration: 0.5 } },
    },
    {
      start: { scale: 5, opacity: 0 },
      end: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 100 } },
      exit: { scale: 5, opacity: 0, transition: { duration: 0.5 } },
    },
  ];

  const diseVariants = [
    {
      exit: { x: -1000, opacity: 0 },
    },
    {
      exit: { x: 1000, opacity: 0},
    },
    {
      exit: { y: -1000, opacity: 0},
    },
    {
      exit: { y: 1000, opacity: 0},
    },
    {
      exit: { scale: 5, opacity: 0 },
    },
  ];

  const Title = ["H", "i", ",", " ", "I", "'", "m", " ", "A", "m", "a", "r", " ", "K", "o", "o", "n", "a", "r"];

  const title_dis = [
    "I", "'", "m", " ", "a", " ", "p", "r", "o", "g", "r", "a", "m", "m", "e", "r", " ",
    "w", "h", "o", " ", "l", "i", "k", "e", "s", " ", "t", "o", " ",
    "l", "e", "a", "r", "n", " ", "n", "e", "w", " ", "t", "h", "i", "n", "g", "s", "."
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {  
        setVisible(false);
      }
      else{
        setVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div id="Title" className="flex bg-gradient-to-t from-gray-900 to-black flex-col justify-center items-center h-screen">
        <AnimatePresence>
          {visible && (
            <>

              <div className="text-white flex flex-wrap justify-center text-2xl sm:text-6xl md:text-8xl mb-5 text-center px-6" style={{ textShadow: "0 0 30px rgba(0, 255, 255, 0.8)" }}>

                {Title.map((letter, index) => (
                  <motion.span
                    key={`title-${index}`}
                    variants={TitleVariants[index % TitleVariants.length]}
                    initial="start"
                    animate="end"
                    exit="exit"
                    className="mx-2"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>


              <div className="text-white flex px-4 text-1xl lg:text-3xl font-bold flex-wrap justify-center mb-8" style={{ textShadow: "0 0 30px rgba(0, 255, 255, 0.8)" }}>
                {title_dis.map((letter, index) => (
                  <motion.span
                    key={`title-dis-${index}`}
                    variants={diseVariants[index % diseVariants.length]}
                    transition={{duration: 0.5 }}
                    initial={{ y: 1000, opacity: 1 }}
                    animate={{ y: 0, opacity: 1, scale: 1, transition: { duration: 0.4, delay: 1 + index * 0.05 } }}
                    exit="exit"
                    className="mx-1"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </>
          )}
        </AnimatePresence>
        
      </div>
    </>
  );
}
