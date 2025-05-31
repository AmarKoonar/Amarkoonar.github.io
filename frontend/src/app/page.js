import Image from "next/image";
import Titlepage from "./sections/title";
import Navbar from "./components/navbar";
export default function Home() {
  return (
    <>
    <Navbar/>
    <Titlepage></Titlepage>
    </>
  )
}
