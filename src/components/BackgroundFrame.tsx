import { motion } from "motion/react";

interface BackgroundFrameProps {
  isGardenScene: boolean;
}

export default function BackgroundFrame({ isGardenScene }: BackgroundFrameProps) {
  return (
    <div className={`${isGardenScene ? "absolute h-full" : "fixed min-h-[100dvh]"} inset-x-0 top-0 bottom-0 pointer-events-none z-0 overflow-hidden`}>
      {/* Elegant vintage double-border frame close to the screen edge */}
      <motion.div
        animate={{
          borderColor: isGardenScene ? "rgba(184, 164, 119, 0.25)" : "rgba(184, 164, 119, 0.45)",
        }}
        transition={{ duration: 1.5 }}
        className="absolute inset-3 md:inset-6 border-[3px] border-[#B8A477]/45 rounded-[16px] md:rounded-[28px] transition-all duration-1000 shadow-[inset_0_0_20px_rgba(184,164,119,0.06)]"
      >
        {/* Secondary inner companion ultra-thin border with refined spacing */}
        <div className="absolute inset-[4px] border border-[#B8A477]/25 rounded-[12px] md:rounded-[24px]" />
      </motion.div>
    </div>
  );
}
