import { motion } from "framer-motion";

export function FloatingOrb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      className={`absolute rounded-full blur-3xl opacity-30 ${className}`}
    />
  );
}

export function FloatingShape({ type, className, delay = 0 }: { type: "cube" | "sphere" | "ring" | "pyramid" | "hexagon"; className?: string; delay?: number }) {
  const shapes: Record<string, React.ReactNode> = {
    cube: (
      <div className="w-16 h-16 relative" style={{ transformStyle: "preserve-3d" }}>
        <div className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-lg backdrop-blur-sm" />
        <div className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-lg transform rotate-45 scale-90" />
      </div>
    ),
    sphere: (
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 shadow-lg shadow-primary/20" />
    ),
    ring: (
      <div className="w-20 h-20 rounded-full border-4 border-primary/30 bg-transparent" />
    ),
    pyramid: (
      <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent border-b-accent/30" />
    ),
    hexagon: (
      <svg viewBox="0 0 100 100" className="w-16 h-16">
        <polygon
          points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
          fill="none"
          stroke="hsl(263, 70%, 50%)"
          strokeWidth="2"
          opacity="0.3"
        />
      </svg>
    ),
  };

  return (
    <motion.div
      animate={{
        y: [0, -25, 0],
        rotate: [0, type === "ring" ? 360 : 15, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: type === "ring" ? 20 : 6 + Math.random() * 4,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      className={`absolute pointer-events-none ${className}`}
    >
      {shapes[type]}
    </motion.div>
  );
}

export function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function GridPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(hsl(263 70% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(263 70% 50%) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
