"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function CustomCursor() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const opacity = useMotionValue(0);

  const ringX = useSpring(mouseX, { stiffness: 220, damping: 30, mass: 0.2 });
  const ringY = useSpring(mouseY, { stiffness: 220, damping: 30, mass: 0.2 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      opacity.set(1);
    };
    const onLeave = () => opacity.set(0);
    const onEnter = () => opacity.set(1);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [mouseX, mouseY, opacity]);

  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full"
        style={{
          width: 8,
          height: 8,
          backgroundColor: "#C47A3D",
          left: mouseX,
          top: mouseY,
          x: "-50%",
          y: "-50%",
          opacity,
        }}
      />
      <motion.div
        className="pointer-events-none fixed z-[9998] rounded-full border border-[#C47A3D]/50"
        style={{
          width: 32,
          height: 32,
          left: ringX,
          top: ringY,
          x: "-50%",
          y: "-50%",
          opacity,
        }}
      />
    </>
  );
}
