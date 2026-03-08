import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { FaExclamationTriangle, FaBolt, FaClock, FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminGhostSlots() {
  const [ghosts, setGhosts] = useState([
    { id: 1, parking: "City Mall Parking", slot: "A-04", owner: "Amit Shah",   bookedBy: "Rishi Kumar",  bookedAt: "2:30 PM",  elapsed: 47, threshold: 30 },
    { id: 2, parking: "Hospital Parking",  slot: "B-02", owner: "Priya Menon", bookedBy: "Karan Dev",    bookedAt: "10:15 AM", elapsed: 92, threshold: 30 },
    { id: 3, parking: "City Mall Parking", slot: "A-11", owner: "Amit Shah",   bookedBy: "Suresh Patel", bookedAt: "1:00 PM",  elapsed: 18, threshold: 30 },
  ]);

  const [released, setReleased] = useState([]);

  // Functional updater prevents stale closure — setGhosts(prev => ...) always reads latest state
  useEffect(() => {
    const interval = setInterval(() => {
      setGhosts(prev => prev.map(g => ({ ...g, elapsed: g.elapsed + 1 })));
    }, 60000);
    return () => clearInterval(interval);
  }, []); // empty deps is safe because we use functional updater

  const forceRelease = (id) => {
    const ghost = ghosts.find(g => g.id === id);
    if (!ghost) return;
    setGhosts(prev => prev.filter(g => g.id !== id));
    setReleased(prev => [
      { ...ghost, releasedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ...prev,
    ]);
  };

  const getElapsedColor = (elapsed, threshold) => {
    const ratio = elapsed / threshold;
    if (ratio >= 2)  return "text-neon-red";
    if (ratio >= 1)  return "text-orange-400";
    return "text-yellow-400";
  };

  const getBarColor = (elapsed, threshold) => {
    if (elapsed >= threshold) return "bg-neon-red shadow-[0_0_8px_#ef4444]";
    return "bg-yellow-500";
  };

  return (
    <DashboardLayout role="ADMIN" userInfo={{ name: "Administrator", role: "ADMIN" }}>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FaExclamationTriangle className="text-neon-red animate-pulse" />
            Ghost Slot Monitor
          </h2>
          <p className="text-gray-400">Slots booked but with no check-in past the threshold</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-dark-card/60 border border-neon-red/20 rounded-xl px-4 py-2 text-center min-w-[80px]">
            <p className="text-neon-red font-bold text-2xl">{ghosts.length}</p>
            <p className="text-gray-500 text-xs">Active Ghosts</p>
          </div>
          <div className="bg-dark-card/60 border border-neon-green/20 rounded-xl px-4 py-2 text-center min-w-[80px]">
            <p className="text-neon-green font-bold text-2xl">{released.length}</p>
            <p className="text-gray-500 text-xs">Released</p>
          </div>
        </div>
      </div>

      {/* INFO BANNER */}
      <div className="mb-6 p-4 rounded-xl bg-neon-blue/5 border border-neon-blue/20 flex items-start gap-3 text-sm text-gray-400">
        <FaBolt className="text-neon-blue shrink-0 mt-0.5" />
        <span>
          Ghost slots are bookings where the user hasn't checked in for{" "}
          <span className="text-white font-bold">30+ minutes</span> after their start time.
          Force-release frees the slot for other users immediately.
        </span>
      </div>

      {/* ACTIVE GHOST CARDS */}
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-2 h-6 rounded-full bg-neon-red inline-block"></span>
        Active Ghost Signals
      </h3>

      {ghosts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-16 bg-dark-card/40 rounded-2xl border border-white/5 mb-8"
        >
          <FaCheckCircle className="text-neon-green text-4xl mx-auto mb-3" />
          <p className="text-white font-bold">All Clear!</p>
          <p className="text-gray-500 text-sm mt-1">No ghost slots detected right now.</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
        <AnimatePresence>
          {ghosts.map(g => (
            <motion.div
              key={g.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-dark-card/60 backdrop-blur-xl border border-neon-red/20 rounded-2xl p-5 relative overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-neon-red/10 rounded-full blur-[30px] animate-pulse pointer-events-none"></div>

              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Ghost Signal</p>
                  <h4 className="text-2xl font-bold text-white font-mono mt-0.5">#{g.slot}</h4>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-red/20 border border-neon-red/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-red animate-pulse"></div>
                  <span className="text-neon-red text-xs font-bold">GHOST</span>
                </div>
              </div>

              <div className="space-y-2 mb-5 relative z-10">
                {[
                  { label: "Parking",   value: g.parking,   valueClass: "text-white" },
                  { label: "Booked By", value: g.bookedBy,  valueClass: "text-neon-blue" },
                  { label: "Booked At", value: g.bookedAt,  valueClass: "text-white" },
                  { label: "Owner",     value: g.owner,     valueClass: "text-gray-400" },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{row.label}</span>
                    <span className={`font-medium ${row.valueClass}`}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* ELAPSED BAR */}
              <div className="mb-5 relative z-10">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 flex items-center gap-1"><FaClock size={10} /> Time Elapsed</span>
                  <span className={`font-bold ${getElapsedColor(g.elapsed, g.threshold)}`}>{g.elapsed} min</span>
                </div>
                <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getBarColor(g.elapsed, g.threshold)}`}
                    style={{ width: `${Math.min((g.elapsed / (g.threshold * 2)) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-gray-600 text-xs mt-1">Threshold: {g.threshold} min</p>
              </div>

              <button
                onClick={() => forceRelease(g.id)}
                className="w-full py-2.5 rounded-xl bg-neon-red/20 text-neon-red font-bold text-sm hover:bg-neon-red hover:text-white border border-neon-red/30 transition-all relative z-10"
              >
                Force Release Slot
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* RELEASED HISTORY */}
      {released.length > 0 && (
        <>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-6 rounded-full bg-neon-green inline-block"></span>
            Recently Released
          </h3>
          <div className="bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-white/10 bg-white/5">
                    <th className="py-3 px-6">Slot</th>
                    <th className="py-3 px-6">Parking</th>
                    <th className="py-3 px-6">Booked By</th>
                    <th className="py-3 px-6">Originally At</th>
                    <th className="py-3 px-6 text-right">Released At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {released.map((r, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-6 font-mono font-bold text-neon-green">#{r.slot}</td>
                      <td className="py-3 px-6 text-white text-sm">{r.parking}</td>
                      <td className="py-3 px-6 text-gray-400 text-sm">{r.bookedBy}</td>
                      <td className="py-3 px-6 text-gray-400 text-sm">{r.bookedAt}</td>
                      <td className="py-3 px-6 text-right">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-neon-green/20 text-neon-green border border-neon-green/30 inline-flex items-center gap-1">
                          <FaCheckCircle size={9} /> {r.releasedAt}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}