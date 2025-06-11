"use client";

export default function Footer() {
  return (
    <div className="w-full bg-black transition duration-300 z-50">

            <nav className=" p-3 text-white flex flex-col items-center justify-center duration-500 shadow-xl/30 bg-slate-950 group-hover:shadow-[#00FFDE] border-0 hover:border-[#00FFDE] border-t-[#00CAFF] lg:border-t-2 border-t-1">
                <div className="space-x-2 p-0 sm:space-x-4 text-sm sm:text-base mb-7">
                <a href="#Title" className="hover:cursor-pointer hover:underline shadow-xl">Home</a>
                <a>|</a>
                <a href="#Aboutme" className="hover:cursor-pointer hover:underline shadow-xl ">About</a>
                <a>|</a>
                <a href="#Projects"  className="hover:cursor-pointer hover:underline shadow-xl ">Projects</a>
                <a>|</a>
                <a href="#Coursework"  className="hover:cursor-pointer hover:underline shadow-xl ">Coursework</a>
                <a>|</a>
                <a href="#Resume"  className="hover:cursor-pointer hover:underline shadow-xl ">Resume</a>
                <a>|</a>
                <a href="#Contact"   className="hover:cursor-pointer hover:underline shadow-xl ">Contact</a>

                </div>
                <div className="space-x-2 p-0 sm:space-x-4 text-sm sm:text-base">
                <h1>
                  © 2025 Amar Koonar. All rights reserved.
                </h1>
                </div>
        </nav>
      
    </div>
  );
}
