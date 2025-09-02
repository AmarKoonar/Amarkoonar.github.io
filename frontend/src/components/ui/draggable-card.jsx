"use client";
import { cn } from "@/lib/utils";
import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  useVelocity,
  useAnimationControls,
} from "framer-motion";

export const DraggableCardBody = ({
  className,
  children,
  boundaryId,
  reset
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef(null);
  const controls = useAnimationControls();
  const [constraints, setConstraints] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  // physics biatch
  const velocityX = useVelocity(mouseX);
  const velocityY = useVelocity(mouseY);

  const springConfig = {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  };
  
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [25, -25]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-25, 25]), springConfig);

  const opacity = useSpring(useTransform(mouseX, [-300, 0, 300], [0.8, 1, 0.8]), springConfig);

  const glareOpacity = useSpring(useTransform(mouseX, [-300, 0, 300], [0.2, 0, 0.2]), springConfig);
  
useEffect(() => {
  const updateConstraints = () => {
    if (!cardRef.current) return;

    
    const ancestor = cardRef.current.closest(`#${boundaryId}`);
    if (!ancestor) return;

    const parentRect = ancestor.getBoundingClientRect();
    const selfRect = cardRef.current.getBoundingClientRect();

    setConstraints({
      top: parentRect.top - selfRect.top,
      left: parentRect.left - selfRect.left,
      right: parentRect.width - selfRect.width,
      bottom: parentRect.bottom - selfRect.bottom,
    });
  };

  updateConstraints();
  window.addEventListener("resize", updateConstraints);
  return () => window.removeEventListener("resize", updateConstraints);
}, []);



  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { width, height, left, top } =
      cardRef.current?.getBoundingClientRect() ?? {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      };
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    mouseX.set(deltaX);
    mouseY.set(deltaY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };
   useEffect(() => {
    if (reset) {
      controls.start({
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      });
    } 
  }, [reset, controls]);
useEffect(() => {
  const intervalId = setInterval(() => {
    controls.start({
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    });
  }, 30000);

  return () => clearInterval(intervalId);
}, [controls]);
  
  
  return (
    <motion.div
      ref={cardRef}
      drag
      dragConstraints={constraints}
      onDragStart={() => {
        document.body.style.cursor = "grabbing";
      }}
      onDragEnd={(event, info) => {
        document.body.style.cursor = "default";

        controls.start({
          rotateX: 0,
          rotateY: 0,
          transition: {
            type: "spring",
            ...springConfig,
          },
        });
        const currentVelocityX = velocityX.get();
        const currentVelocityY = velocityY.get();

        const velocityMagnitude = Math.sqrt(currentVelocityX * currentVelocityX +
          currentVelocityY * currentVelocityY);
        const bounce = Math.min(0.8, velocityMagnitude / 1000);

        animate(info.point.x, info.point.x + currentVelocityX * 0.3, {
          duration: 0.8,
          ease: [0.2, 0, 0, 1],
          bounce,
          type: "spring",
          stiffness: 50,
          damping: 15,
          mass: 0.8,
        });

        animate(info.point.y, info.point.y + currentVelocityY * 0.3, {
          duration: 0.8,
          ease: [0.2, 0, 0, 1],
          bounce,
          type: "spring",
          stiffness: 50,
          damping: 15,
          mass: 0.8,
        });
      }}
      style={{
        rotateX,
        rotateY,
        opacity,
        willChange: "transform",
      }}
      animate={controls}
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
//       onDragEnd={() => {
//   controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 300 } });
// }}
      className={cn(
        "absoloute   overflow-hidden rounded-md shadow-2xl transform-3d dark:bg-neutral-900 ",
        className
      )}>

      
      {children}
      <div className=" absolute inset-0 z-[500]  hover:cursor-grab" > </div>
      
    </motion.div>
  );
};

export const DraggableCardContainer = ({
  className,
  children
}) => {
  return (<div className={cn("[perspective:3000px]", className)}>{children}</div>);
};
