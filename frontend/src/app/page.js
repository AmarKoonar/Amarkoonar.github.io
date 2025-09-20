"use client"
import Titlepage from "./sections/title";
import Navbar from "./components/navbar";
import AboutMe from "./sections/aboutme";
import Projects from "./sections/projects";
import Coursework from "./sections/coursework";
import Resume from "./sections/resume";
import Contact from "./sections/contact";
import Footer from "./components/footer";
import { useEffect } from "react";
import { useScroll, useSpring, useTransform, motion } from "framer-motion";

export default function Home() {
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 20,
    mass: 0.5,
  });

  const trailOpacity = useTransform(smoothProgress, [0, 1], [0.3, 1]);
  const barHeight = useTransform(smoothProgress, [0, 1], ["10vh", "89vh"]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
  }, []);

  return (
    <>

      <motion.div
        className="fixed top-0 -right-0 w-1 rounded-full bg-gradient-to-b from-transparent to-[#00CAFF] "
        style={{
          height: barHeight,
          y: trailOpacity,
        }}
      />
      <Navbar/>
      <Titlepage />
      <AboutMe/>
      <Projects/>
      <Coursework/>
      <Resume/>
      <Contact/>
      <Footer/>
    </>
  )
}