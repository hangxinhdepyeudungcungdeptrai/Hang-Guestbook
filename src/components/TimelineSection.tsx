import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

const timelineData = [
  {
    id: 1,
    title: "Ngày Nhập Học",
    subtitle: "Bước chân đầu tiên",
    description: "Những ngày thu ngập tràn ánh nắng, mang theo bao bỡ ngỡ và khát vọng về một chân trời mới tại mái trường đại học thân yêu.",
    image: "https://lh3.googleusercontent.com/d/1AmIiA280YgFZ-FyXzVRnenBkFZuFqwkG",
  },
  {
    id: 2,
    title: "Câu lạc bộ TCT",
    subtitle: "Ngọn lửa nhiệt huyết",
    description: "Những buổi sinh hoạt đầy ắp tiếng cười, dệt nên những tình bạn thanh xuân rực rỡ và những kỉ niệm chẳng thể phai nhòa.",
    image: "https://lh3.googleusercontent.com/d/1pTSdGiiz1Cn98T9AaGNivUer1wBKJgQg",
  },
  {
    id: 3,
    title: "Giảng Đường TMU",
    subtitle: "Những đêm thức trắng",
    description: "Những bài luận, những lần thuyết trình căng thẳng, cùng bạn bè nỗ lực học tập dưới giảng đường TMU cổ kính.",
    image: "https://lh3.googleusercontent.com/d/1I2b-TdgFF2iFyrau6MyOBhHb77vLgCXZ",
  },
  {
    id: 4,
    title: "Ngày Tốt Nghiệp",
    subtitle: "Khép lại & Mở ra",
    description: "Khoác lên mình chiếc áo cử nhân vẻ vang, gói ghém một chặng đường tuyệt đẹp làm hành trang vững bước vào tương lai tươi sáng.",
    image: "https://lh3.googleusercontent.com/d/1OeXjI96hJPD6X9VZ9E6Fne8Kjz1LiIeU",
  }
];

function FitText({ text, className }: { text: string; className?: string }) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const [style, setStyle] = useState<any>({
    fontSize: "3rem",
    lineHeight: "1.2",
    visibility: "hidden", // Prevent brief layout flash/jump during measurement
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const adjustSize = () => {
      const parent = el.parentElement;
      if (!parent) return;

      // Measure the block-level grandparent container instead of the inline-block parent
      const layoutContainer = el.parentElement?.parentElement || parent;
      const parentWidth = layoutContainer.getBoundingClientRect().width;
      // Allow safety padding margin so it never touches the exact edges (px-6/px-8 is on container)
      const maxAvailableWidth = Math.max(280, parentWidth - 48);

      let size = 48; // Peak size (3rem)
      el.style.fontSize = `${size}px`;
      el.style.display = "inline-block";
      el.style.whiteSpace = "nowrap";

      // Incrementally scale down font size until it fully fits within bounds
      while (el.scrollWidth > maxAvailableWidth && size > 16) {
        size -= 0.5; // High-precision sizing
        el.style.fontSize = `${size}px`;
      }

      setStyle({
        fontSize: `${size}px`,
        lineHeight: "1.2",
        visibility: "visible",
      });
    };

    // Initial sizing
    adjustSize();

    // Re-trigger adjustments on browser window resize
    window.addEventListener("resize", adjustSize);

    // Watch parent element boundary changes dynamically
    const observer = new ResizeObserver(adjustSize);
    if (el.parentElement) {
      observer.observe(el.parentElement);
    }

    return () => {
      window.removeEventListener("resize", adjustSize);
      observer.disconnect();
    };
  }, [text]);

  return (
    <div className="filter drop-shadow-[0_2px_8px_rgba(140,109,79,0.15)] inline-block max-w-full">
      <h2
        ref={containerRef}
        className={`font-luxury italic tracking-[0.03em] font-medium text-center mx-auto select-none inline-block max-w-[95vw] sm:max-w-full py-1 ${className || ""}`}
        style={style}
      >
        {text}
      </h2>
    </div>
  );
}

export default function TimelineSection() {
  const titleText = "Memories are gold, you shape the mold.";
  const timelineRef = useRef<HTMLDivElement>(null);

  // Track the scrolling of the timeline list compared to user's viewport
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"]
  });

  // Smooth standard gold accent scrolling tracker progress
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    restDelta: 0.001
  });

  return (
    <div className="relative w-full max-w-5xl mx-auto pt-24 md:pt-32 pb-10 md:pb-12 px-10 xs:px-12 md:px-24 flex flex-col items-center z-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-center mb-20 md:mb-28 w-full max-w-full overflow-hidden"
      >
        <span className="text-[#8C6D4F]/80 text-[10px] md:text-xs tracking-[0.4em] uppercase font-serif mb-4 block">
          Hồi Ức Thanh Xuân
        </span>
        <div className="mb-6">
          {/* Mobile version - 2 lines, large, clear, high-contrast, centered */}
          <div className="sm:hidden flex flex-col items-center justify-center gap-1.5 px-3 py-1">
            <span className="font-luxury italic text-[24px] xs:text-[28px] gold-lux-text text-center font-bold tracking-wide leading-snug">
              Memories are gold,
            </span>
            <span className="font-luxury italic text-[24px] xs:text-[28px] gold-lux-text text-center font-bold tracking-wide leading-snug">
              you shape the mold.
            </span>
          </div>

          {/* Desktop version - Responsive single line fit to screen */}
          <div className="hidden sm:block">
            <FitText text={titleText} className="gold-lux-text font-bold" />
          </div>
        </div>
        <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#8C6D4F]/30 to-transparent mx-auto" />
      </motion.div>

      <div ref={timelineRef} className="relative w-full">
        {/* Center Vertical Line Background - soft neutral warm tone */}
        <div className="absolute left-10 xs:left-12 md:left-1/2 top-0 bottom-0 w-[1.5px] bg-[#8C6D4F]/15 -translate-x-1/2 pointer-events-none" />

        {/* Center Vertical Line Active Progress- filled dynamically in sync with page scroll */}
        <motion.div
          style={{ scaleY }}
          className="absolute left-10 xs:left-12 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#8C6D4F]/30 via-[#8C6D4F] to-[#8C6D4F]/30 -translate-x-1/2 pointer-events-none origin-top"
        />

        {timelineData.map((node, index) => {
          const isEven = index % 2 === 0;
          return (
            <div key={node.id} className={`relative flex flex-col md:flex-row items-center justify-between mb-20 md:mb-32 w-full ${!isEven ? "md:flex-row-reverse" : ""}`}>
              {/* Center Node dot aligned with center line */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.15, duration: 0.8, ease: "backOut" }}
                className="absolute left-10 xs:left-12 md:left-1/2 w-4 h-4 rounded-full bg-[#FCFAF7] shadow-md border-2 border-[#8C6D4F] -translate-x-1/2 z-10"
              />

              {/* Empty space for opposite side */}
              <div className="hidden md:block w-[45%]" />

              {/* Content Card */}
              <motion.div 
                initial={{ opacity: 0, x: !isEven ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`w-full md:w-[45%] pl-16 xs:pl-20 md:pl-0 flex flex-col ${!isEven ? "md:items-end md:text-right" : "md:items-start md:text-left"}`}
              >
                {/* Image Placeholder with Soft Almond background, sized beautifully to never exceed frame lines */}
                <div className="w-full max-w-[210px] xs:max-w-[260px] sm:max-w-[320px] md:max-w-md aspect-[4/3] rounded shadow-lg relative overflow-hidden bg-[#FCFAF7]/95 border border-[#8C6D4F]/20 mb-6 group cursor-pointer">
                  {node.image ? (
                    <img
                      src={node.image}
                      alt={node.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-[#8C6D4F]/50 group-hover:text-[#8C6D4F] group-hover:bg-[#8C6D4F]/5 transition-all duration-700 ease-out">
                      <svg className="w-9 h-9 md:w-14 md:h-14 mb-3 opacity-60 transform group-hover:scale-110 transition-transform duration-700 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-serif text-[10px] md:text-xs tracking-[0.25em] uppercase">Thêm Ảnh Kỷ Niệm ✦</span>
                    </div>
                  )}
                  {/* Vintage inner framing decorations */}
                  <div className="absolute inset-2 border border-dashed border-[#8C6D4F]/15 pointer-events-none" />
                  <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#8C6D4F]/30 pointer-events-none" />
                  <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#8C6D4F]/30 pointer-events-none" />
                  <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#8C6D4F]/30 pointer-events-none" />
                  <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#8C6D4F]/30 pointer-events-none" />
                </div>

                <h3 className="text-[#3D2D24] font-handwritten text-3xl md:text-4xl mb-2 font-medium tracking-wide">{node.title}</h3>
                <p className="text-[#5C4D42] font-serif leading-relaxed text-[13px] md:text-base opacity-90 max-w-[210px] xs:max-w-[260px] sm:max-w-md">
                  {node.description}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
