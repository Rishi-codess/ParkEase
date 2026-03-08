import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCar, FaParking, FaShieldAlt, FaMobileAlt, FaBolt, FaMapMarkerAlt } from "react-icons/fa";

const FEATURES = [
  { icon: <FaMapMarkerAlt className="text-neon-blue text-2xl" />,   title: "Find Nearby",       desc: "Browse available parking spots near you in real-time"       },
  { icon: <FaBolt         className="text-neon-purple text-2xl" />, title: "Instant Booking",   desc: "Reserve your slot in seconds — no waiting, no hassle"       },
  { icon: <FaShieldAlt    className="text-neon-green text-2xl" />,  title: "Secure Payments",   desc: "UPI, Card, Wallet — all transactions are encrypted & safe"   },
  { icon: <FaMobileAlt    className="text-yellow-400 text-2xl" />,  title: "Live Tracking",     desc: "Track your session timer and extend parking anytime"         },
];

const STATS = [
  { value: "50+",  label: "Parking Lots"    },
  { value: "2K+",  label: "Active Users"    },
  { value: "99%",  label: "Uptime"          },
  { value: "< 3s", label: "Booking Speed"  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-bg text-white overflow-x-hidden">
      {/* Grid bg */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-dark-bg/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              <FaParking className="text-white text-sm" />
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">ParkEase</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/login")}
              className="px-5 py-2 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              Login
            </button>
            <button onClick={() => navigate("/register")}
              className="px-5 py-2 text-sm font-bold bg-neon-blue text-white rounded-xl hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-neon-purple/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-neon-blue/10 border border-neon-blue/20 rounded-full text-neon-blue text-xs font-bold mb-8 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse"></span>
            SMART PARKING SYSTEM
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Park Smarter,{" "}
            <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue bg-clip-text text-transparent">
              Not Harder
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Find, book, and manage parking slots in real-time. No more circling blocks — your spot is waiting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-black rounded-xl text-lg hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2">
              <FaCar /> Book a Spot Free
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login")}
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl text-lg hover:bg-white/10 transition-all">
              Sign In
            </motion.button>
          </div>
        </motion.div>

        {/* Mini live stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mx-auto relative z-10">
          {STATS.map(({ value, label }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center backdrop-blur-xl">
              <p className="text-3xl font-black bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">{value}</p>
              <p className="text-gray-400 text-sm mt-1">{label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-white mb-3">Everything You Need</h2>
            <p className="text-gray-400">Powerful features built for modern urban parking</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-2xl p-7 hover:border-neon-blue/20 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-white font-bold mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="relative bg-gradient-to-br from-neon-blue/20 via-neon-purple/10 to-neon-blue/5 border border-neon-blue/20 rounded-3xl p-12 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-5"
              style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
            <div className="relative z-10">
              <h2 className="text-4xl font-black text-white mb-4">Ready to Park Smarter?</h2>
              <p className="text-gray-400 mb-8 text-lg">Join thousands already using ParkEase every day.</p>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/register")}
                className="px-10 py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-black rounded-xl text-lg hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all inline-flex items-center gap-3">
                <FaCar /> Get Started — It's Free
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <p className="text-gray-600 text-sm">© 2026 ParkEase · Smart Parking System</p>
      </footer>
    </div>
  );
}