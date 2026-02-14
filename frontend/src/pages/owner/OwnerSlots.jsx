import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { FaPlus, FaCar, FaMotorcycle, FaTimes, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function OwnerSlots() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [slots, setSlots] = useState([
    { id: "A-01", type: "Car", status: "OCCUPIED", vehicle: "MP09 AB 1234", user: "Rishi", time: "2:30 PM", floor: "1" },
    { id: "A-02", type: "Car", status: "AVAILABLE", floor: "1" },
    { id: "A-03", type: "Car", status: "RESERVED", vehicle: "Future Booking", user: "Amit", time: "6:00 PM", floor: "1" },
    { id: "A-04", type: "Car", status: "AVAILABLE", floor: "1" },
    { id: "B-01", type: "Bike", status: "OCCUPIED", vehicle: "MH12 CD 5678", user: "Neha", time: "10:00 AM", floor: "2" },
    { id: "B-02", type: "Bike", status: "AVAILABLE", floor: "2" },
    { id: "B-03", type: "Bike", status: "AVAILABLE", floor: "2" },
    { id: "B-04", type: "Bike", status: "MAINTENANCE", floor: "2" },
  ]);

  const handleAddSlot = (e) => {
    e.preventDefault();
    // Mock addition
    const newSlot = {
      id: e.target.slotId.value,
      type: e.target.type.value,
      floor: e.target.floor.value,
      status: "AVAILABLE"
    };
    setSlots([...slots, newSlot]);
    setShowAddModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "AVAILABLE": return "bg-neon-green/20 border-neon-green/40 text-neon-green hover:bg-neon-green/30";
      case "OCCUPIED": return "bg-neon-red/20 border-neon-red/40 text-neon-red hover:bg-neon-red/30";
      case "RESERVED": return "bg-yellow-500/20 border-yellow-500/40 text-yellow-500 hover:bg-yellow-500/30";
      default: return "bg-gray-700/50 border-gray-600 text-gray-400";
    }
  };

  return (
    <DashboardLayout role="OWNER">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Slot Management</h2>
          <p className="text-gray-400">Visual overview of all parking slots</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-neon-blue hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all flex items-center gap-2"
        >
          <FaPlus /> Add New Slot
        </button>
      </div>

      <div className="flex gap-6 relative">

        {/* LEFT: SLOT GRID */}
        <div className="flex-1">
          {/* LEGEND */}
          <div className="flex gap-4 mb-6 text-sm text-gray-400">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-neon-green"></span> Available</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-neon-red"></span> Occupied</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-yellow-500"></span> Reserved</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-gray-600"></span> Maintenance</div>
          </div>

          {/* GRID */}
          <div className="bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-2xl p-8">
            <h3 className="text-white font-bold mb-4 opacity-70">Floor 1 (Cars)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              {slots.filter(s => s.floor === "1").map(slot => (
                <motion.div
                  layoutId={slot.id}
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all relative ${getStatusColor(slot.status)} ${selectedSlot?.id === slot.id ? "ring-2 ring-white scale-105 z-10" : ""}`}
                >
                  <span className="text-lg font-bold">{slot.id}</span>
                  <div className="mt-1">
                    {slot.type === "Car" ? <FaCar /> : <FaMotorcycle />}
                  </div>
                  {slot.status === "OCCUPIED" && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl backdrop-blur-[1px]">
                      <FaCar className="text-2xl text-white drop-shadow-lg" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <h3 className="text-white font-bold mb-4 opacity-70 border-t border-white/5 pt-4">Floor 2 (Bikes)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {slots.filter(s => s.floor === "2").map(slot => (
                <motion.div
                  layoutId={slot.id}
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all relative ${getStatusColor(slot.status)} ${selectedSlot?.id === slot.id ? "ring-2 ring-white scale-105 z-10" : ""}`}
                >
                  <span className="text-lg font-bold">{slot.id}</span>
                  <div className="mt-1">
                    {slot.type === "Car" ? <FaCar /> : <FaMotorcycle />}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: DETAILS PANEL (SLIDE IN) */}
        <AnimatePresence>
          {selectedSlot && (
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className="w-1/3 min-w-[300px] h-fit sticky top-24"
            >
              <div className="bg-dark-card border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <button onClick={() => setSelectedSlot(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><FaTimes /></button>

                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 ${getStatusColor(selectedSlot.status).replace("hover:", "")}`}>
                  {selectedSlot.type === "Car" ? <FaCar /> : <FaMotorcycle />}
                </div>

                <h3 className="text-3xl font-bold text-white mb-1">Slot {selectedSlot.id}</h3>
                <span className={`px-3 py-1 rounded text-xs font-bold border ${getStatusColor(selectedSlot.status).split(" ")[0]}`}>
                  {selectedSlot.status}
                </span>

                <div className="mt-8 space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-gray-400 text-xs uppercase uppercase">Floor</p>
                    <p className="text-white font-bold">{selectedSlot.floor === "1" ? "Ground Floor" : "1st Floor"}</p>
                  </div>

                  {selectedSlot.status === "OCCUPIED" && (
                    <>
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-gray-400 text-xs uppercase">Occupied By</p>
                        <p className="text-white font-bold">{selectedSlot.user}</p>
                        <p className="text-neon-blue text-sm">{selectedSlot.vehicle}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-gray-400 text-xs uppercase">Parked Since</p>
                        <p className="text-white font-bold">{selectedSlot.time}</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <button className="py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all text-sm font-bold flex items-center justify-center gap-2">
                    Maintenance
                  </button>
                  <button className="py-2 rounded-lg bg-neon-red/10 hover:bg-neon-red/20 text-neon-red border border-neon-red/20 transition-all text-sm font-bold flex items-center justify-center gap-2">
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ADD SLOT MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-card border border-white/10 rounded-2xl p-8 w-full max-w-md"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Add New Slot</h3>
              <form onSubmit={handleAddSlot} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Slot ID</label>
                  <input name="slotId" placeholder="e.g. A-10" required className="w-full bg-dark-bg border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Type</label>
                    <select name="type" className="w-full bg-dark-bg border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue outline-none">
                      <option value="Car">Car</option>
                      <option value="Bike">Bike</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Floor</label>
                    <select name="floor" className="w-full bg-dark-bg border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue outline-none">
                      <option value="1">Floor 1</option>
                      <option value="2">Floor 2</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all">Cancel</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl bg-neon-green hover:bg-green-400 text-black font-bold transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)]">Create Slot</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </DashboardLayout>
  );
}
