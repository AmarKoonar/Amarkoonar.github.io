"use client";

import { useRef, useState, useEffect } from "react";

export default function navbar() {
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const links = [
    { id: "Title", label: "Home" },
    { id: "Aboutme", label: "About" },
    { id: "Projects", label: "Projects" },
    { id: "Coursework", label: "Coursework" },
    { id: "Resume", label: "Resume" },
    { id: "Contact", label: "Contact" },
  ];

  const containerRef = useRef(null);
  const linkRefs = useRef([]);
  const [hoverIdx, setHoverIdx] = useState(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  
  useEffect(() => {
    const update = () => {
      if (hoverIdx === null) {
        setIndicator((i) => ({ ...i, opacity: 0 }));
        return;
      }
      const el = linkRefs.current[hoverIdx];
      const container = containerRef.current;
      if (!el || !container) return;

      
      const left = el.offsetLeft;
      const width = el.offsetWidth;

      setIndicator({ left, width, opacity: 1 });
    };

    update();
    // re-measure on resize for responsiveness
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [hoverIdx]);

  return (
    <div className="w-full flex justify-center ">
    <div className="group fixed transition duration-300 z-[600]">
      <div className="flex justify-center">
        <nav className="bg-[#00CAFF]/10 hover:bg-[#00FFDE]/10 transition-[box-shadow,border-color,scale,background] duration-500
         shadow-xl/30 border-[#00CAFF] shadow-[#00CAFF] hover:border-[#00FFDE] hover:shadow-[#00FFDE] glass-effect hover:backdrop-blur-lg  py-3 px-5 shadow-sm  text-white flex flex-wrap justify-between items-center rounded-2xl   backdrop-blur-xs group-hover:shadow-[#00FFDE]  lg:border-1 border-1 ">
          <div
            ref={containerRef}
            className="relative flex items-center gap-2 sm:gap-4 text-sm"
            onMouseLeave={() => setHoverIdx(null)}
          >
            {links.map((l, i) => (
              <div key={l.id} className="flex items-center">
                <a
                  ref={(el) => (linkRefs.current[i] = el)}
                  onMouseEnter={() => setHoverIdx(i)}
                  onClick={() => scrollToId(l.id)}
                  className="px-1 hover:cursor-pointer  shadow-xl whitespace-nowrap"
                >
                  {l.label}
                </a>
              </div>
            ))}


            {/* Optional subtle glow behind hovered link */}
            <div
              className="pointer-events-none absolute -z-10 top-1/2 -translate-y-1/2 h-7 rounded-xl bg-[#00FFDE]/10 border border-[#00FFDE]/30 transition-all duration-300 ease-out"
              style={{
                left: indicator.left -5,
                width: indicator.width +10,
                opacity: indicator.opacity ? 1 : 0,
              }}
            />
          </div>
        </nav>
      </div>
    </div>
    </div>
  );
}
