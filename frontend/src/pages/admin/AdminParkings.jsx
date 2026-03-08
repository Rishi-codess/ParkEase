import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { FaBuilding, FaMapMarkerAlt, FaCheck, FaTimes, FaBan, FaEye } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_STYLES = {
  PENDING:   "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  APPROVED:  "bg-neon-green/20 text-neon-green border-neon-green/30",
  REJECTED:  "bg-neon-red/20 text-neon-red border-neon-red/30",
  SUSPENDED: "bg-gray-600/40 text-gray-400 border-gray-500/30",
};

export default function AdminParkings() {
  const [filter, setFilter] = useState("ALL");
  const [selectedId, setSelectedId] = useState(null);

  const [parkings, setParkings] = useState([
    { id: 1, name: "City Mall Parking",     owner: "Amit Shah",     ownerEmail: "amit@email.com",    location: "City Center, Block A",      slots: 10, pricePerHr: "$5", status: "APPROVED",  submitted: "Jan 15, 2026", description: "Covered parking with 24/7 security" },
    { id: 2, name: "Hospital Parking",      owner: "Priya Menon",   ownerEmail: "priya@email.com",   location: "Medical District, Gate 2",  slots: 6,  pricePerHr: "$3", status: "APPROVED",  submitted: "Oct 20, 2025", description: "Open air parking near hospital main entrance" },
    { id: 3, name: "Phoenix Mall Basement", owner: "Rahul Joshi",   ownerEmail: "rahul@email.com",   location: "Phoenix Complex, Basement", slots: 20, pricePerHr: "$8", status: "PENDING",   submitted: "Feb 20, 2026", description: "Multi-level basement parking inside mall" },
    { id: 4, name: "Station Road Parking",  owner: "Deepa Nair",    ownerEmail: "deepa@email.com",   location: "Railway Station Sq.",       slots: 15, pricePerHr: "$4", status: "PENDING",   submitted: "Feb 22, 2026", description: "Open air parking near the railway station" },
    { id: 5, name: "Old Airport Lot",       owner: "Suresh Pillai", ownerEmail: "suresh.p@email.com",location: "Airport Rd, Sector 7",      slots: 30, pricePerHr: "$6", status: "REJECTED",  submitted: "Jan 5, 2026",  description: "Outdoor parking lot near old airport terminal" },
  ]);

  // Derive selected from array — always fresh, never stale
  const selected = parkings.find(p => p.id === selectedId) || null;

  const updateStatus = (id, newStatus) => {
    setParkings(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const filtered = filter === "ALL" ? parkings : parkings.filter(p => p.status === filter);

  const counts = {
    ALL:       parkings.length,
    PENDING:   parkings.filter(p => p.status === "PENDING").length,
    APPROVED:  parkings.filter(p => p.status === "APPROVED").length,
    REJECTED:  parkings.filter(p => p.status === "REJECTED").length,
    SUSPENDED: parkings.filter(p => p.status === "SUSPENDED").length,
  };

  return (
    <DashboardLayout role="ADMIN" userInfo={{ name: "Administrator", role: "ADMIN" }}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Parking Management</h2>
        <p className="text-gray-400">Review and approve owner-submitted parking lots</p>
      </div>

      {/* PENDING ALERT BANNER */}
      {counts.PENDING > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shrink-0"></div>
          <span className="text-yellow-400 font-bold">
            {counts.PENDING} parking lot{counts.PENDING > 1 ? "s" : ""} awaiting your approval
          </span>
        </motion.div>
      )}

      {/* FILTER TABS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["ALL", "PENDING", "APPROVED", "REJECTED", "SUSPENDED"].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${filter === tab ? "bg-neon-blue/20 text-neon-blue border-neon-blue/40" : "bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10"}`}
          >
            {tab}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${filter === tab ? "bg-neon-blue/30" : "bg-white/10"}`}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* PARKING CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(p => (
          <motion.div
            key={p.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-white font-bold text-lg">{p.name}</h4>
                <p className="text-gray-400 text-sm flex items-center gap-1 mt-0.5">
                  <FaMapMarkerAlt className="text-neon-blue" size={10} /> {p.location}
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${STATUS_STYLES[p.status]}`}>
                {p.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: "Slots",    value: p.slots,      color: "text-neon-purple" },
                { label: "Per Hour", value: p.pricePerHr, color: "text-neon-green"  },
                { label: "Owner",    value: p.owner.split(" ")[0], color: "text-neon-blue" },
              ].map(item => (
                <div key={item.label} className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
                  <p className={`font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-gray-500 text-xs">{item.label}</p>
                </div>
              ))}
            </div>

            <p className="text-gray-600 text-xs mb-4 italic">Submitted: {p.submitted}</p>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedId(p.id)}
                className="flex-1 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white text-sm font-bold border border-white/10 transition-all flex items-center justify-center gap-1"
              >
                <FaEye size={12} /> View
              </button>

              {p.status === "PENDING" && (
                <>
                  <button onClick={() => updateStatus(p.id, "APPROVED")} className="flex-1 py-2 rounded-lg bg-neon-green/20 text-neon-green hover:bg-neon-green hover:text-white text-sm font-bold border border-neon-green/30 transition-all flex items-center justify-center gap-1">
                    <FaCheck size={12} /> Approve
                  </button>
                  <button onClick={() => updateStatus(p.id, "REJECTED")} className="flex-1 py-2 rounded-lg bg-neon-red/20 text-neon-red hover:bg-neon-red hover:text-white text-sm font-bold border border-neon-red/30 transition-all flex items-center justify-center gap-1">
                    <FaTimes size={12} /> Reject
                  </button>
                </>
              )}
              {p.status === "APPROVED" && (
                <button onClick={() => updateStatus(p.id, "SUSPENDED")} className="flex-1 py-2 rounded-lg bg-gray-600/30 text-gray-400 hover:bg-gray-600 hover:text-white text-sm font-bold border border-gray-600/40 transition-all flex items-center justify-center gap-1">
                  <FaBan size={12} /> Suspend
                </button>
              )}
              {(p.status === "REJECTED" || p.status === "SUSPENDED") && (
                <button onClick={() => updateStatus(p.id, "APPROVED")} className="flex-1 py-2 rounded-lg bg-neon-green/20 text-neon-green hover:bg-neon-green hover:text-white text-sm font-bold border border-neon-green/30 transition-all flex items-center justify-center gap-1">
                  <FaCheck size={12} /> Re-Approve
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-2 py-16 text-center bg-dark-card/30 rounded-2xl border border-white/5">
            <FaBuilding className="text-4xl mx-auto mb-3 opacity-20 text-white" />
            <p className="text-gray-500">No parking lots in this category.</p>
          </div>
        )}
      </div>

      {/* DETAIL MODAL — reads live from 'selected' which is always derived fresh */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedId(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-card border border-white/10 rounded-2xl p-8 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selected.name}</h3>
                  <span className={`mt-1 inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${STATUS_STYLES[selected.status]}`}>
                    {selected.status}
                  </span>
                </div>
                <button onClick={() => setSelectedId(null)} className="text-gray-400 hover:text-white"><FaTimes /></button>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { label: "Owner",        value: selected.owner },
                  { label: "Owner Email",  value: selected.ownerEmail },
                  { label: "Location",     value: selected.location },
                  { label: "Total Slots",  value: selected.slots },
                  { label: "Price / Hour", value: selected.pricePerHr },
                  { label: "Submitted On", value: selected.submitted },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-gray-400 text-sm">{item.label}</span>
                    <span className="text-white font-semibold text-sm">{item.value}</span>
                  </div>
                ))}
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-gray-400 text-sm mb-1">Description</p>
                  <p className="text-white text-sm">{selected.description}</p>
                </div>
              </div>

              <div className="flex gap-3">
                {selected.status === "PENDING" && (
                  <>
                    <button onClick={() => updateStatus(selected.id, "APPROVED")} className="flex-1 py-3 rounded-xl bg-neon-green text-black font-bold hover:bg-green-400 transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)]">Approve</button>
                    <button onClick={() => updateStatus(selected.id, "REJECTED")} className="flex-1 py-3 rounded-xl bg-neon-red text-white font-bold hover:bg-red-400 transition-all">Reject</button>
                  </>
                )}
                {selected.status === "APPROVED" && (
                  <button onClick={() => updateStatus(selected.id, "SUSPENDED")} className="flex-1 py-3 rounded-xl bg-gray-600 text-white font-bold hover:bg-gray-500 transition-all">Suspend</button>
                )}
                {(selected.status === "REJECTED" || selected.status === "SUSPENDED") && (
                  <button onClick={() => updateStatus(selected.id, "APPROVED")} className="flex-1 py-3 rounded-xl bg-neon-green text-black font-bold hover:bg-green-400 transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)]">Re-Approve</button>
                )}
                <button onClick={() => setSelectedId(null)} className="flex-1 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 border border-white/10 transition-all">Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}