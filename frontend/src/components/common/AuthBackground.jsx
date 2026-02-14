import { motion } from "framer-motion";
import { FaParking } from "react-icons/fa";

export default function AuthBackground() {
    // Generate random positions for floating icons
    const icons = Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 10 + Math.random() * 10,
        delay: Math.random() * 5,
    }));

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Deep Space Background */}
            <div className="absolute inset-0 bg-[#0a0a1a]"></div>

            {/* Circuit Board Pattern */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `
                linear-gradient(to right, #4c1d95 1px, transparent 1px),
                linear-gradient(to bottom, #4c1d95 1px, transparent 1px)
            `,
                    backgroundSize: '40px 40px'
                }}
            ></div>

            {/* Glowing Circuit Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full opacity-30">
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Abstract Circuit Paths */}
                <motion.path
                    d="M0 100 H 200 V 300 H 500"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    filter="url(#glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                />
                <motion.path
                    d="M-50 400 H 150 V 600 H 800"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    filter="url(#glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 4, delay: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                />
                <motion.path
                    d="M800 100 H 600 V 400 H 400"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="2"
                    filter="url(#glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 5, delay: 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                />
                <motion.path
                    d="M1000 600 H 800 V 300 H 600"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2"
                    filter="url(#glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 4.5, delay: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                />
            </svg>

            {/* Radial Gradient Glows */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neon-purple/20 via-transparent to-neon-blue/20 mix-blend-screen"></div>

            {/* Floating P Icons */}
            {icons.map((icon) => (
                <motion.div
                    key={icon.id}
                    className="absolute text-neon-purple/20"
                    initial={{ x: `${icon.x}vw`, y: `${icon.y}vh`, opacity: 0, scale: 0.5 }}
                    animate={{
                        y: [`${icon.y}vh`, `${icon.y - 20}vh`, `${icon.y}vh`],
                        opacity: [0, 0.4, 0],
                        scale: [0.5, 1, 0.5],
                        rotate: [0, 360]
                    }}
                    transition={{
                        duration: icon.duration,
                        repeat: Infinity,
                        delay: icon.delay,
                        ease: "linear"
                    }}
                >
                    <div className="p-4 rounded-xl border border-neon-purple/30 bg-black/20 backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                        <FaParking className="text-4xl" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
