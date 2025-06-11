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
export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
    <Navbar/>
    <Titlepage></Titlepage>
    <AboutMe></AboutMe>
    <Projects></Projects>
    <Coursework></Coursework>
    <Resume></Resume>
    <Contact></Contact>
    <Footer></Footer>
    </>
  )
}
