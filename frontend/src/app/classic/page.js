"use client";
import { useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Titlepage from '../sections/title';
import Navbar from '../components/navbar';
import AboutMe from '../sections/aboutme';
import Projects from '../sections/projects';
import Coursework from '../sections/coursework';
import Resume from '../sections/resume';
import Contact from '../sections/contact';
import Footer from '../components/footer';
import './classic.css';

export default function ClassicPortfolio() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 150, damping: 20, mass: .5 });
  const opacity = useTransform(progress, [0, 1], [.3, 1]);
  const height = useTransform(progress, [0, 1], ['10vh', '89vh']);
  useEffect(() => { window.scrollTo({top:0,behavior:'instant'}); }, []);
  return <main className="classic-site">
    <a className="classic-return" href="/">← Back to 3D workspace</a>
    <motion.div className="fixed top-0 right-0 w-1 rounded-full bg-gradient-to-b from-transparent to-[#00CAFF]" style={{ height, opacity }} />
    <Navbar /><Titlepage /><AboutMe /><Projects /><Coursework /><Resume /><Contact /><Footer />
  </main>;
}
