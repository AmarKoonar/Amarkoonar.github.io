"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const contacts = [
  {
    name: "GitHub",
    icon: "/contact/github.svg",
    link: "https://github.com/amarkoonar"
  },
  {
    name: "Outlook",
    icon: "/contact/outlook.svg",
    link: "mailto:ask41@sfu.ca"
  },
  {
    name: "Gmail",
    icon: "/contact/gmail.svg",
    link: "mailto:amarkoonar@gmail.com"
  },
  {
    name: "LinkedIn",
    icon: "/contact/linkedin.svg",
    link: "https://www.linkedin.com/in/amar-koonar-36a186365/"
  }
];
const fadeScale = {
  start: {
    opacity: 0,
    scale: 0.9
  },
  end: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

    return(
        <div id="Contact" className="bg-slate-950 pb-16 flex flex-col items-center">
              <motion.h1
                variants={fadeScale}
                initial="start"
                whileInView="end"
                style={{ textShadow: "0 0 30px rgba(0, 255, 255, 0.8)" }}
                className=" sm:text-6xl md:text-8xl lg:mb-14  shadow-2xl text-5xl text-white text-center my-10"
              >
                Contact Me
              </motion.h1>
              <motion.h2
                variants={fadeScale}
                initial="start"
                whileInView="end"
                style={{ textShadow: "0 0 30px rgba(0, 255, 255, 0.8)" }}
                className=" sm:text-6xl md:text-2xl lg:mb-14  shadow-2xl text-5xl text-white text-center my-10 flex-wrap w-150"
              >
                I'm always interested in creating new projects. Reach out to me through any of these platforms.
              </motion.h2>
                 <motion.div 
                variants={fadeScale}
                initial="start"
                whileInView="end"
                 className="flex gap-10 border-2 border-[#00CAFF] transition-[box-shadow,border-color,scale] rounded-xl p-10 
                 duration-500 shadow-[#00CAFF] shadow-xl/30 hover:border-[#00FFDE] hover:shadow-[#00FFDE] hover:scale-103">
                    {contacts.map((cont) => (
                      <a
                        key={cont.name}
                        href={cont.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group hover:opacity-80 hover:scale-105 transition flex flex-col justify-center items-center "
                      >
                        <img
                          src={cont.icon}
                          alt={cont.name}
                          className="w-25 h-25"
                        />
                        <h1 className="text-white font-semibold transition duration-500 group-hover:text-[#00FFDE]">
                          {cont.name}
                        </h1>
                      </a>
                      
                    ))}
                  </motion.div>
        </div>

    );
}