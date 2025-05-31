import Image from "next/image";
import Titlepage from "./sections/title";
import Navbar from "./components/navbar";
import AboutMe from "./sections/aboutme";
export default function Home() {
  return (
    <>
    <Navbar/>
    <Titlepage></Titlepage>
    <AboutMe></AboutMe>
    </>
  )
}
