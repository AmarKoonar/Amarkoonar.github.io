"use client";

export default function navbar() {
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="group fixed w-full -top-18 transition duration-300 hover:translate-y-15 z-50">
            <nav className="p-3 sm:p-4 text-white flex flex-wrap justify-between items-center rounded-xl duration-500 shadow-xl/30 bg-slate-950 group-hover:shadow-[#00FFDE] border-[#00FFDE] lg:border-3 border-1">
                <h1 className="text-xl sm:text-2xl font-bold">Amar Koonar</h1>
                <div className="space-x-2 sm:space-x-4 text-sm sm:text-base">
                <a onClick={() => scrollToId("Title")} className="hover:cursor-pointer hover:underline shadow-xl">Home</a>
                <a onClick={() => scrollToId("Aboutme")}  className="hover:cursor-pointer hover:underline shadow-xl ">About</a>
                <a onClick={() => scrollToId("Projects")} className="hover:cursor-pointer hover:underline shadow-xl ">Projects</a>
                <a onClick={() => scrollToId("Resume")}  className="hover:cursor-pointer hover:underline shadow-xl ">Resume</a>
                <a onClick={() => scrollToId("Coursework")} className="hover:cursor-pointer hover:underline shadow-xl ">Coursework</a>
                <a onClick={() => scrollToId("Contact")} className="hover:cursor-pointer hover:underline shadow-xl ">Contact</a>
                </div>
        </nav>
        <div className="h-16 w-full p-3 sm:p-4 text-white flex justify-between items-center">
            <img src="/navbar1.png" alt="navbar icon" className="w-5 h-5">
            </img>
        </div>
      
    </div>
  );
}
