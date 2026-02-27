import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  FaArrowLeft, FaCar, FaMotorcycle, FaTruck, FaCarSide,
  FaEdit, FaTimes, FaSave, FaBan, FaCheck,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const STATUSES = ["AVAILABLE", "OCCUPIED", "RESERVED", "MAINTENANCE"];

const vehicleIcon = (type) => {
  switch (type) {
    case "CAR": return <FaCar />;
    case "BIKE": return <FaMotorcycle />;
    case "LARGE": return <FaTruck />;
    case "SMALL": return <FaCarSide />;
    default: return <FaCar />;
  }
};

const getStatusColor = (status, disabled) => {
  if (disabled) return "bg-gray-800/50 border-gray-700 text-gray-600";
  switch (status) {
    case "AVAILABLE": return "bg-neon-green/10 border-neon-green/30 text-neon-green";
    case "OCCUPIED": return "bg-neon-red/10 border-neon-red/30 text-neon-red";
    case "RESERVED": return "bg-yellow-500/10 border-yellow-500/30 text-yellow-500";
    case "MAINTENANCE": return "bg-gray-500/10 border-gray-500/30 text-gray-400";
    default: return "bg-white/5 border-white/10 text-gray-400";
  }
};

const getStatusBadgeColor = (status) => {
  switch (status) {
    case "AVAILABLE": return "bg-neon-green/20 text-neon-green border-neon-green/30";
    case "OCCUPIED": return "bg-neon-red/20 text-neon-red border-neon-red/30";
    case "RESERVED": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
    case "MAINTENANCE": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    default: return "bg-white/10 text-gray-400 border-white/10";
  }
};

export default function ManageParkingSlots() {
  const navigate = useNavigate();
  const { parkingId } = useParams();
  const [parking, setParking] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [editingSlot, setEditingSlot] = useState(null);
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    const parkings = JSON.parse(localStorage.getItem("ownerParkings") || "[]");
    const found = parkings.find((p) => p.id === parkingId);
    if (found) {
      setParking(found);
      setSlots(found.slots || []);
    }
  }, [parkingId]);

  const saveSlots = (updatedSlots) => {
    setSlots(updatedSlots);
    const parkings = JSON.parse(localStorage.getItem("ownerParkings") || "[]");
    const idx = parkings.findIndex((p) => p.id === parkingId);
    if (idx !== -1) {
      parkings[idx].slots = updatedSlots;
      // Recalculate stats
      const occupied = updatedSlots.filter((s) => s.status === "OCCUPIED" && !s.disabled).length;
      const active = updatedSlots.filter((s) => !s.disabled).length;
      parkings[idx].occupied = occupied;
      parkings[idx].totalSlots = updatedSlots.length;
      parkings[idx].occupancyRate = active > 0 ? Math.round((occupied / active) * 100) : 0;
      localStorage.setItem("ownerParkings", JSON.stringify(parkings));
    }
  };

  const handleStatusChange = (slotId, newStatus) => {
    const updated = slots.map((s) =>
      s.slotId === slotId ? { ...s, status: newStatus } : s
    );
    saveSlots(updated);
    if (selectedSlot?.slotId === slotId) {
      setSelectedSlot({ ...selectedSlot, status: newStatus });
    }
  };

  const handleToggleDisable = (slotId) => {
    const updated = slots.map((s) =>
      s.slotId === slotId ? { ...s, disabled: !s.disabled, status: s.disabled ? "AVAILABLE" : "MAINTENANCE" } : s
    );
    saveSlots(updated);
    const updatedSlot = updated.find((s) => s.slotId === slotId);
    if (selectedSlot?.slotId === slotId) {
      setSelectedSlot(updatedSlot);
    }
  };

  const handleEditSave = () => {
    if (!editingSlot) return;
    const updated = slots.map((s) =>
      s.slotId === editingSlot.slotId ? { ...editingSlot } : s
    );
    saveSlots(updated);
    setSelectedSlot(editingSlot);
    setEditingSlot(null);
  };

  // Get unique vehicle types from slots
  const vehicleTypes = [...new Set(slots.map((s) => s.vehicleType))];

  const filteredSlots = slots.filter((s) => {
    const matchType = filterType === "ALL" || s.vehicleType === filterType;
    const matchStatus = filterStatus === "ALL" || s.status === filterStatus;
    return matchType && matchStatus;
  });

  if (!parking) {
    return (
      <DashboardLayout role="OWNER">
        <div className="flex flex-col items-center justify-center py-32">
          <p className="text-gray-400 text-lg mb-4">Parking lot not found.</p>
          <button
            onClick={() => navigate("/owner/dashboard")}
            className="px-6 py-3 bg-neon-blue hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="OWNER">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/owner/dashboard")}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-all"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">{parking.name}</h2>
            <p className="text-gray-400 text-sm">{parking.location} &bull; {slots.length} Total Slots</p>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-dark-card border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-neon-blue"
          >
            <option value="ALL">All Types</option>
            {vehicleTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Status Filter */}
          <div className="bg-dark-card border border-white/10 rounded-lg p-1 flex">
            {["ALL", ...STATUSES].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  filterStatus === s
                    ? "bg-neon-purple text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-6 text-sm text-gray-400 flex-wrap">
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-neon-green"></span> Available</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-neon-red"></span> Occupied</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-yellow-500"></span> Reserved</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-gray-600"></span> Maintenance</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-gray-800 border border-gray-700"></span> Disabled</div>
      </div>

      <div className="flex gap-6 relative">
        {/* Slot Grid */}
        <div className="flex-1">
          {vehicleTypes.map((type) => {
            const typeSlots = filteredSlots.filter((s) => s.vehicleType === type);
            if (typeSlots.length === 0 && filterType !== "ALL" && filterType !== type) return null;
            if (typeSlots.length === 0) return null;

            return (
              <div key={type} className="mb-8">
                <div className="bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2 opacity-80">
                    {vehicleIcon(type)}
                    <span>{type} Slots</span>
                    <span className="text-xs text-gray-500 ml-2">({typeSlots.length} slots)</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {typeSlots.map((slot) => (
                      <motion.div
                        key={slot.slotId}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => { setSelectedSlot(slot); setEditingSlot(null); }}
                        className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all relative ${getStatusColor(slot.status, slot.disabled)} ${
                          selectedSlot?.slotId === slot.slotId ? "ring-2 ring-white scale-105 z-10" : ""
                        }`}
                      >
                        <span className="text-sm font-bold font-mono">{slot.slotId}</span>
                        <div className="mt-1 text-lg">{vehicleIcon(slot.vehicleType)}</div>
                        <span className="text-[9px] mt-1 uppercase tracking-wider opacity-70">
                          ₹{slot.costPerHour}/hr
                        </span>
                        {slot.disabled && (
                          <div className="absolute top-1 right-1">
                            <FaBan className="text-gray-600 text-xs" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredSlots.length === 0 && (
            <div className="text-center py-20 bg-dark-card/30 rounded-xl border border-white/5 border-dashed">
              <p className="text-gray-500 text-lg">No slots match the selected filters.</p>
            </div>
          )}
        </div>

        {/* Details Panel */}
        <AnimatePresence>
          {selectedSlot && (
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className="w-1/3 min-w-[300px] h-fit sticky top-24"
            >
              <div className="bg-dark-card border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <button
                  onClick={() => { setSelectedSlot(null); setEditingSlot(null); }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <FaTimes />
                </button>

                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 ${getStatusColor(selectedSlot.status, selectedSlot.disabled)}`}>
                  {vehicleIcon(selectedSlot.vehicleType)}
                </div>

                <h3 className="text-3xl font-bold text-white mb-1 font-mono">{selectedSlot.slotId}</h3>
                <span className={`px-3 py-1 rounded text-xs font-bold border ${getStatusBadgeColor(selectedSlot.status)}`}>
                  {selectedSlot.disabled ? "DISABLED" : selectedSlot.status}
                </span>

                {/* Details */}
                <div className="mt-6 space-y-3">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-gray-400 text-xs uppercase">Vehicle Type</p>
                    <p className="text-white font-bold">{selectedSlot.vehicleTypeLabel || selectedSlot.vehicleType}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-gray-400 text-xs uppercase">Price</p>
                    {editingSlot ? (
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={editingSlot.costPerHour}
                        onChange={(e) => setEditingSlot({ ...editingSlot, costPerHour: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-dark-bg border border-white/10 rounded-lg p-2 text-white mt-1 outline-none focus:border-neon-blue"
                      />
                    ) : (
                      <p className="text-neon-green font-bold text-lg">₹{selectedSlot.costPerHour}/hr</p>
                    )}
                  </div>

                  {/* Status Dropdown */}
                  {!selectedSlot.disabled && (
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-gray-400 text-xs uppercase mb-2">Change Status</p>
                      <div className="grid grid-cols-2 gap-2">
                        {STATUSES.map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(selectedSlot.slotId, status)}
                            className={`px-2 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                              selectedSlot.status === status
                                ? getStatusBadgeColor(status) + " ring-1 ring-white/20"
                                : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {editingSlot ? (
                    <>
                      <button
                        onClick={() => setEditingSlot(null)}
                        className="py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all text-sm font-bold flex items-center justify-center gap-2"
                      >
                        <FaTimes /> Cancel
                      </button>
                      <button
                        onClick={handleEditSave}
                        className="py-2.5 rounded-lg bg-neon-green/20 hover:bg-neon-green/30 text-neon-green border border-neon-green/30 transition-all text-sm font-bold flex items-center justify-center gap-2"
                      >
                        <FaSave /> Save
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingSlot({ ...selectedSlot })}
                        className="py-2.5 rounded-lg bg-white/5 hover:bg-neon-blue/20 text-white border border-white/10 hover:border-neon-blue/50 transition-all text-sm font-bold flex items-center justify-center gap-2"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleToggleDisable(selectedSlot.slotId)}
                        className={`py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all border ${
                          selectedSlot.disabled
                            ? "bg-neon-green/10 hover:bg-neon-green/20 text-neon-green border-neon-green/20"
                            : "bg-neon-red/10 hover:bg-neon-red/20 text-neon-red border-neon-red/20"
                        }`}
                      >
                        {selectedSlot.disabled ? <><FaCheck /> Enable</> : <><FaBan /> Disable</>}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
