import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { FaCalendarAlt, FaSearch, FaTimesCircle, FaCar, FaMapMarkerAlt, FaClock, FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminBookings() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [cancelTargetId, setCancelTargetId] = useState(null);

  const [bookings, setBookings] = useState([
    { id: 1, user: "Rishi Kumar",  parking: "City Mall Parking",  slot: "A-14", date: "Feb 14, 2026", duration: "3 hrs",   amount: "$15.00",  status: "COMPLETED", location: "City Center"    },
    { id: 2, user: "Suresh Patel", parking: "Hospital Parking",   slot: "B-05", date: "Feb 12, 2026", duration: "1.5 hrs", amount: "$8.50",   status: "COMPLETED", location: "Medical District"},
    { id: 3, user: "Karan Dev",    parking: "Airport Terminal 1", slot: "T1-45",date: "Feb 10, 2026", duration: "5 days",  amount: "$120.00", status: "CANCELLED", location: "Airport Rd"     },
    { id: 4, user: "Rishi Kumar",  parking: "Railway Station",    slot: "C-22", date: "Feb 24, 2026", duration: "Ongoing", amount: "Running", status: "ACTIVE",    location: "Station Square" },
    { id: 5, user: "Neha Singh",   parking: "City Mall Parking",  slot: "A-07", date: "Feb 23, 2026", duration: "2 hrs",   amount: "$10.00",  status: "COMPLETED", location: "City Center"    },
    { id: 6, user: "Karan Dev",    parking: "Hospital Parking",   slot: "B-11", date: "Feb 24, 2026", duration: "Ongoing", amount: "Running", status: "ACTIVE",    location: "Medical District"},
    { id: 7, user: "Suresh Patel", parking: "City Mall Parking",  slot: "A-02", date: "Feb 21, 2026", duration: "4 hrs",   amount: "$20.00",  status: "COMPLETED", location: "City Center"    },
  ]);

  // Derive cancel target fresh — no stale state
  const cancelTarget = bookings.find(b => b.id === cancelTargetId) || null;

  const forceCancel = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "CANCELLED" } : b));
    setCancelTargetId(null);
  };

  const filtered = bookings.filter(b => {
    const matchSearch = [b.user, b.parking, b.slot].some(v => v.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === "ALL" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    ALL:       bookings.length,
    ACTIVE:    bookings.filter(b => b.status === "ACTIVE").length,
    COMPLETED: bookings.filter(b => b.status === "COMPLETED").length,
    CANCELLED: bookings.filter(b => b.status === "CANCELLED").length,
  };

  const getStatusStyle = (s) => {
    switch (s) {
      case "ACTIVE":    return "bg-neon-blue/20 text-neon-blue border-neon-blue/30";
      case "COMPLETED": return "bg-neon-green/20 text-neon-green border-neon-green/30";
      case "CANCELLED": return "bg-neon-red/20 text-neon-red border-neon-red/30";
      default:          return "bg-gray-600/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <DashboardLayout role="ADMIN" userInfo={{ name: "Administrator", role: "ADMIN" }}>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">All Bookings</h2>
          <p className="text-gray-400">Platform-wide booking overview</p>
        </div>

        {/* MINI STAT PILLS */}
        <div className="flex gap-3">
          {[
            { label: "Active",    count: counts.ACTIVE,    color: "text-neon-blue"  },
            { label: "Completed", count: counts.COMPLETED, color: "text-neon-green" },
            { label: "Cancelled", count: counts.CANCELLED, color: "text-neon-red"   },
          ].map(s => (
            <div key={s.label} className="bg-dark-card/60 border border-white/10 rounded-xl px-4 py-2 text-center min-w-[64px]">
              <p className={`font-bold text-lg ${s.color}`}>{s.count}</p>
              <p className="text-gray-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SEARCH + TAB FILTER */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px] relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search user, parking or slot..."
            className="w-full bg-dark-card/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-neon-blue outline-none text-sm"
          />
        </div>
        <div className="bg-dark-card/60 border border-white/10 rounded-xl p-1 flex">
          {["ALL", "ACTIVE", "COMPLETED", "CANCELLED"].map(tab => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${filterStatus === tab ? "bg-neon-blue text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Parking Location</th>
                <th className="py-4 px-6">Slot</th>
                <th className="py-4 px-6">Date & Duration</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(b => (
                <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple/30 to-neon-blue/30 border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {b.user[0]}
                      </div>
                      <span className="text-white font-medium text-sm">{b.user}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-white text-sm font-medium flex items-center gap-1.5"><FaCar className="text-gray-500" size={11} /> {b.parking}</p>
                    <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5"><FaMapMarkerAlt size={9} /> {b.location}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-neon-purple font-bold bg-neon-purple/10 px-2 py-1 rounded border border-neon-purple/20 text-sm">
                      {b.slot}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-white text-sm flex items-center gap-1.5"><FaCalendarAlt className="text-gray-500" size={11} /> {b.date}</p>
                    <p className="text-gray-500 text-xs flex items-center gap-1.5 mt-0.5"><FaClock size={10} /> {b.duration}</p>
                  </td>
                  <td className="py-4 px-6 font-bold text-white text-sm">{b.amount}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1 ${getStatusStyle(b.status)}`}>
                      {b.status === "COMPLETED" && <FaCheckCircle size={10} />}
                      {b.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {b.status === "ACTIVE" ? (
                      <button
                        onClick={() => setCancelTargetId(b.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-neon-red/20 text-neon-red hover:bg-neon-red hover:text-white border border-neon-red/30 transition-all inline-flex items-center gap-1"
                      >
                        <FaTimesCircle size={10} /> Force Cancel
                      </button>
                    ) : (
                      <span className="text-gray-600 text-xs">—</span>
                    )}
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="7" className="py-12 text-center text-gray-500">No bookings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORCE CANCEL CONFIRM */}
      <AnimatePresence>
        {cancelTarget && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-card border border-neon-red/30 rounded-2xl p-8 max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 rounded-full bg-neon-red/20 flex items-center justify-center mx-auto mb-4">
                <FaTimesCircle className="text-neon-red text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Force Cancel Booking?</h3>
              <p className="text-gray-400 text-sm mb-1">
                Slot <span className="font-mono text-neon-purple font-bold">{cancelTarget.slot}</span> at{" "}
                <span className="text-white font-bold">{cancelTarget.parking}</span>
              </p>
              <p className="text-gray-500 text-xs mb-6">Booked by: {cancelTarget.user}</p>
              <div className="flex gap-3">
                <button onClick={() => setCancelTargetId(null)} className="flex-1 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 border border-white/10 transition-all">Go Back</button>
                <button onClick={() => forceCancel(cancelTarget.id)} className="flex-1 py-3 rounded-xl bg-neon-red text-white font-bold hover:bg-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all">Cancel It</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}