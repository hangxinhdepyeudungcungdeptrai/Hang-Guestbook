import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface UnrollingScrollProps {
  onReplay?: () => void;
}

export default function UnrollingScroll({ onReplay }: UnrollingScrollProps) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX - window.innerWidth / 2) / 60;
      const y = (clientY - window.innerHeight / 2) / 60;
      setMouseOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <motion.div
      style={{
        x: mouseOffset.x,
        y: mouseOffset.y,
        perspective: "1600px",
      }}
      animate={{
        y: [mouseOffset.y - 4, mouseOffset.y + 4, mouseOffset.y - 4],
      }}
      transition={{
        y: {
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      className="relative w-[85%] sm:w-[90%] md:w-full max-w-[500px] aspect-[4/5] flex items-center justify-center select-none z-20 cursor-default p-4"
    >
      {/* 3D Drop Shadow for the entire composition */}
      <div className="absolute inset-8 bg-black/35 blur-[35px] rounded-2xl pointer-events-none" />



      {/* ==============================================
          LAYER 1: The Premium Diagonal Red Envelope
          ============================================== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: 4 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute w-[90%] h-[78%] bg-gradient-to-br from-[#A8181D] via-[#8C1015] to-[#590508] rounded-lg shadow-[inset_0_4px_24px_rgba(255,255,255,0.15),_0_20px_40px_rgba(0,0,0,0.4)] border border-[#780D11] overflow-hidden z-10 flex flex-col justify-start p-8 md:p-10"
      >
        {/* Subtle premium fabric texture lines on envelope background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.03)_1px,_transparent_1px)] bg-[size:3px_3px] opacity-40 pointer-events-none" />
        
        {/* Soft vignette/glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5 pointer-events-none" />

        {/* Golden Foil Logo: "TR TRUST REAL" styled beautifully at top right */}
        <div className="self-end flex items-center gap-3 mr-3 mt-1 relative z-20">
          <div className="flex flex-col items-end text-[#E6C594] leading-none">
            <span className="font-serif tracking-[0.18em] text-[11px] md:text-xs font-bold drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.5)] text-transparent bg-clip-text bg-gradient-to-r from-[#F6DFB6] via-[#E2C392] to-[#B08D56]">
              TRUST REAL
            </span>
            <span className="text-[6px] uppercase tracking-[0.22em] font-sans opacity-85 mt-1 drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.3)] text-[#F6DFB6]/90">
              bring you trust
            </span>
          </div>

          {/* Connected T-R minimalist crest */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F6DFB6] via-[#CCAB73] to-[#8F6A30] p-[1.5px] shadow-[0_2px_8px_rgba(0,0,0,0.35)] flex items-center justify-center">
            <div className="w-full h-full bg-[#8C1015] rounded-full flex items-center justify-center">
              <span className="font-serif text-[#E2C392] text-[10px] font-bold tracking-tighter">TR</span>
            </div>
          </div>
        </div>

        {/* Diagonal folder folds lines to feel like a real red folder envelope */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 0,0 L 50,45 L 100,0 M 0,100 L 50,55 L 100,100" stroke="#FFF" strokeWidth="1.2" fill="none" />
          <path d="M 0,0 L 50,44.5 L 100,0 M 0,100 L 50,54.5 L 100,100" stroke="#000" strokeWidth="0.8" fill="none" />
        </svg>
      </motion.div>

      {/* ==============================================
          LAYER 2: The Pristine Slanted White/Ivory Sheet
          ============================================== */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: 5, scale: 0.95 }}
        animate={{ opacity: 1, y: 15, rotate: -2, scale: 1 }}
        transition={{ delay: 0.3, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute w-[80%] h-[74%] bg-[#FAF9F5] border-x-[5px] border-y-[2px] border-[#EDE9DE] shadow-[0_15px_45px_rgba(0,0,0,0.25),_0_3px_10px_rgba(0,0,0,0.15)] rounded-sm z-20 flex flex-col p-6 overflow-hidden"
      >
        {/* Soft, microscopic paper fiber grain overlay */}
        <div className="absolute inset-0 bg-[#FCFAF7]/90 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_60%,_rgba(0,0,0,0.012)_100%)] pointer-events-none" />

        {/* Refined Double Margin Borders like high-end stationery */}
        <div className="absolute inset-3 border border-[#E1D3BA]/60 rounded-sm pointer-events-none">
          <div className="absolute inset-[1.5px] border border-dashed border-[#E1D3BA]/35" />
        </div>

        {/* Inside Content Area */}
        <div className="flex-1 w-full h-full flex flex-col items-center justify-center relative z-10 p-2 md:p-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.2 }}
            className="text-center w-full max-w-[270px] sm:max-w-xs mx-auto flex flex-col items-center justify-center"
          >
            {/* Elegant tiny top gold divider */}
            <div className="text-[#8C6D4F]/40 text-[10px] tracking-[0.3em] mb-3 sm:mb-5 flex items-center justify-center gap-1.5">
              <span className="h-[1px] w-5 bg-gradient-to-r from-transparent to-[#8C6D4F]/30" />
              <span>✦</span>
              <span className="h-[1px] w-5 bg-gradient-to-l from-transparent to-[#8C6D4F]/30" />
            </div>

            {/* Luxurious hand-written Vietnamese script using Charmonman, sized perfectly */}
            <p className="text-[#3A2A1E] font-handwritten text-[18px] sm:text-[23px] md:text-[26px] leading-[1.7] tracking-wider font-bold">
              <span className="block whitespace-nowrap">Cảm ơn mọi người</span>
              <span className="block whitespace-nowrap">vì 4 năm rực rỡ.</span>
            </p>

            {/* Elegant subtle bottom line */}
            <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-[#8C6D4F]/25 to-transparent mt-4 sm:mt-6" />
          </motion.div>
        </div>
      </motion.div>

      {/* ==============================================
          LAYER 3: Classic Elegant Gold-Accented Fountain Pen
          ============================================== */}
      <motion.div
        initial={{ opacity: 0, x: -70, y: 80, rotate: -40 }}
        animate={{ opacity: 1, x: 0, y: 0, rotate: -22 }}
        transition={{ delay: 0.8, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-[5%] sm:left-[7%] top-[20%] w-[14%] h-[68%] z-30 pointer-events-none"
      >
        {/* Meticulously crafted 3D pen shadow */}
        <div className="absolute top-[25px] left-[20px] w-[90%] h-[90%] bg-black/35 blur-[12px] rounded-full transform rotate-[4deg] origin-top " />

        <svg className="w-full h-full drop-shadow-[5px_15px_10px_rgba(0,0,0,0.15)]" viewBox="0 0 50 300" fill="none">
          {/* Defs containing rich gradients */}
          <defs>
            <linearGradient id="nibGold" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#DFBA73" />
              <stop offset="30%" stopColor="#FAE0AD" />
              <stop offset="65%" stopColor="#D9A343" />
              <stop offset="100%" stopColor="#8F6A22" />
            </linearGradient>
            <linearGradient id="nibSilver" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9C9C9C" />
              <stop offset="35%" stopColor="#EAEAEA" />
              <stop offset="65%" stopColor="#CDCDCD" />
              <stop offset="100%" stopColor="#7E7E7E" />
            </linearGradient>
            <linearGradient id="penGloss" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0B0B0C" />
              <stop offset="25%" stopColor="#2D2E31" />
              <stop offset="55%" stopColor="#141517" />
              <stop offset="100%" stopColor="#020202" />
            </linearGradient>
          </defs>

          {/* 1. Golden Stainless steel nib */}
          <path d="M 25 15 L 14 55 L 18 85 L 32 85 L 36 55 Z" fill="url(#nibGold)" />
          {/* Inner silver inlay */}
          <path d="M 25 20 L 17 55 L 20 85 L 30 85 L 33 55 Z" fill="url(#nibSilver)" />
          {/* Center vent hole */}
          <circle cx="25" cy="55" r="1.5" fill="#1C1D1F" />
          {/* Nib slit */}
          <line x1="25" y1="15" x2="25" y2="55" stroke="#1C1D1F" strokeWidth="0.8" />
          
          {/* 2. Plastic grip section */}
          <path d="M 17.5 85 L 16.5 125 L 33.5 125 L 32.5 85 Z" fill="url(#penGloss)" />
          
          {/* 3. Gold joining collar */}
          <rect x="15.5" y="125" width="19" height="5" rx="0.5" fill="url(#nibGold)" />

          {/* 4. Elegant shiny black barrel bar */}
          <path d="M 14.5 130 L 11 260 Q 11 264, 15 264 L 35 264 Q 39 264, 39 260 L 35.5 130 Z" fill="url(#penGloss)" />

          {/* 5. Gold bands and highlights ornamenting barrel */}
          <rect x="13.5" y="130" width="23" height="4" fill="url(#nibGold)" />
          <rect x="10.8" y="254" width="28.4" height="6" fill="url(#nibGold)" />

          {/* 6. Gold pen clip lying over body */}
          <path d="M 25 134 L 25 210 Q 25 213, 27 213" stroke="url(#nibGold)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
