import { motion } from "motion/react";
import React, { useState, useEffect, useRef } from "react";
import UnrollingScroll from "./UnrollingScroll";
import TimelineSection from "./TimelineSection";
import GuestbookSection from "./GuestbookSection";

interface BotanicalGardenProps {
  onReplay: () => void;
}

export default function BotanicalGarden({ onReplay }: BotanicalGardenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Track mouse coordinates for extremely gentle background ambient parallax sways
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const normX = (clientX / innerWidth - 0.5) * 12; // range [-6, 6]
      const normY = (clientY / innerHeight - 0.5) * 8;   // range [-4, 4]
      setMousePos({ x: normX, y: normY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[100dvh] flex flex-col items-center pt-16 md:pt-24 pb-20 md:pb-32 select-none bg-transparent"
    >
      {/* 3D Parallax Ambient Backdrop Washes (Extremely soft, light watercolor tones) */}
      <motion.div
        animate={{
          x: mousePos.x,
          y: mousePos.y,
        }}
        transition={{ type: "smooth", stiffness: 90, damping: 28 }}
        className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40 select-none z-0 overflow-hidden"
      >
        {/* Soft, beautiful large blurred botanical circles that look like watercolor washes - elegant warm champagne & soft silk blush */}
        <div className="absolute top-[15%] left-[5%] w-[450px] h-[450px] rounded-full bg-[#F5ECDF] filter blur-[100px] opacity-50" />
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-[#EFE6D8] filter blur-[120px] opacity-60" />
      </motion.div>
 
      {/* Middle centerpiece: Unrolling Scroll that slowly rolls down and floats with consistent safe margins */}
      <div className="w-full min-h-[85vh] flex items-center justify-center z-20 py-10 px-8 xs:px-12 md:px-24">
        <UnrollingScroll />
      </div>

      {/* Structured Chronological Timeline Section */}
      <div className="relative w-full z-20">
        <TimelineSection />
      </div>

      {/* Beautiful Interactive Vintage Guestbook Section */}
      <div className="relative w-full z-20">
        <GuestbookSection />
      </div>

      {/* Corner floating controls to reload and play seal reveal again (100% textless aesthetic) */}
      <motion.button
        id="btn-replay"
        onClick={(e) => {
          e.stopPropagation();
          onReplay();
        }}
        title="Quay lại Phong thư"
        className="fixed bottom-8 right-8 w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#8C7662]/20 bg-[#FAF6F0]/80 backdrop-blur-md shadow-md flex items-center justify-center text-[#5A4535] hover:bg-[#FAF6F0] hover:text-[#2A1D15] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer z-35"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <svg
          className="w-5 h-5 md:w-6 md:h-6 rotate-180 hover:rotate-360 transition-transform duration-700 ease-out"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          <path d="M12 8c2 0 3 1.5 3 3s-1.5 3-3 3-3-1.5-3-3" fill="currentColor" stroke="none" opacity="0.15" />
        </svg>
      </motion.button>
    </div>
  );
}
