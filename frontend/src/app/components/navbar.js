"use client";

export default function navbar() {
  return (
    <div className="group fixed w-full transition duration-300 z-50">
      <div className="flex justify-center">
            <nav className=" p-3 text-white flex flex-wrap justify-between items-center rounded-full duration-500 shadow-xl/30 bg-slate-950 group-hover:shadow-[#00FFDE] hover:border-[#00FFDE] border-[#00CAFF] lg:border-3 border-1">
                <div className="space-x-2 p-0 sm:space-x-4 text-sm sm:text-base">
                <a href="#Title" className="hover:cursor-pointer hover:underline shadow-xl">Home</a>
                <a href="#Aboutme" className="hover:cursor-pointer hover:underline shadow-xl ">About</a>
                <a href="#Projects"  className="hover:cursor-pointer hover:underline shadow-xl ">Projects</a>
                <a href="#Coursework"  className="hover:cursor-pointer hover:underline shadow-xl ">Coursework</a>
                <a href="#Resume"  className="hover:cursor-pointer hover:underline shadow-xl ">Resume</a>
                <a href="#Contact"   className="hover:cursor-pointer hover:underline shadow-xl ">Contact</a>
                </div>
        </nav>
        </div>
      
    </div>
  );
}
