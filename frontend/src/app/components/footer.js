"use client";

export default function Footer() {
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="w-full bg-black transition duration-300 z-50">

            <nav className=" p-3 text-white flex flex-col items-center justify-center duration-500 group-hover:shadow-[#00FFDE] border-0 hover:border-[#00FFDE] border-t-[#00CAFF] lg:border-t-2 border-t-1 hover:scale-103 glass-effect">
                <div className="space-x-2 p-0 sm:space-x-4 text-sm sm:text-base mb-7">
                <a onClick={() => scrollToId("Title")} className="hover:cursor-pointer hover:underline shadow-xl">Home</a>
                <a>|</a>
                <a onClick={() => scrollToId("Aboutme")}  className="hover:cursor-pointer hover:underline shadow-xl ">About</a>
                <a>|</a>
                <a onClick={() => scrollToId("Projects")} className="hover:cursor-pointer hover:underline shadow-xl ">Projects</a>
                <a>|</a>
                <a onClick={() => scrollToId("Coursework")} className="hover:cursor-pointer hover:underline shadow-xl ">Coursework</a>
                <a>|</a>
                <a onClick={() => scrollToId("Resume")}  className="hover:cursor-pointer hover:underline shadow-xl ">Resume</a>
                
                <a>|</a>
                <a onClick={() => scrollToId("Contact")} className="hover:cursor-pointer hover:underline shadow-xl ">Contact</a>

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
