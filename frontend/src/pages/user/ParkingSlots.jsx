import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { FaCar, FaLock } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import BookingSummaryModal from "../../components/common/BookingSummaryModal";

// Mock parking context — in production this comes from navigation state or API
const PARKING_NAME = "City Mall Parking";

export default function ParkingSlots() {
  const [slots, setSlots] = useState(
    Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      status: i % 5 === 0 ? "RESERVED" : i % 3 === 0 ? "BOOKED" : "AVAILABLE",
    }))
  );

  const [selectedSlot, setSelectedSlot] = useState(null);

  const getSlotStyles = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-neon-green/10 border-neon-green/50 text-neon-green hover:bg-neon-green/20 hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] cursor-pointer";
      case "RESERVED":
        return "bg-yellow-500/10 border-yellow-500/50 text-yellow-500 cursor-not-allowed opacity-80";
      case "BOOKED":
        return "bg-neon-red/10 border-neon-red/50 text-neon-red cursor-not-allowed opacity-80";
      default:
        return "bg-gray-700 border-gray-600 text-gray-400";
    }
  };

  const handleSlotClick = (slot) => {
    if (slot.status === "AVAILABLE") {
      setSelectedSlot(slot);
    }
  };

  return (
    <DashboardLayout role="USER" title="Select Slot">
      <ToastContainer theme="dark" />

      <div className="flex flex-col h-full">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-white">Select a Spot</h2>
            <p className="text-gray-400">
              Green slots are available — click to book.
            </p>
          </div>

          {/* Legend */}
          <div className="flex gap-4 bg-dark-card/50 p-3 rounded-lg border border-white/5">
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="w-3 h-3 rounded-full bg-neon-green shadow-[0_0_5px_rgba(34,197,94,0.8)]" /> Available
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.8)]" /> Reserved
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="w-3 h-3 rounded-full bg-neon-red shadow-[0_0_5px_rgba(239,68,68,0.8)]" /> Booked
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 overflow-y-auto pb-20">
          {slots.map((s) => (
            <motion.div
              key={s.id}
              whileHover={s.status === "AVAILABLE" ? { scale: 1.05, y: -2 } : {}}
              onClick={() => handleSlotClick(s)}
              className={`
                relative h-24 rounded-xl border-2 flex flex-col items-center justify-center font-bold transition-all
                ${getSlotStyles(s.status)}
              `}
            >
              <span className="text-2xl mb-1">
                {s.status === "AVAILABLE" && <span className="text-sm font-normal">OPEN</span>}
                {s.status === "BOOKED" && <FaCar />}
                {s.status === "RESERVED" && <FaLock />}
              </span>
              <span className="absolute top-2 left-2 text-xs opacity-70">#{s.id}</span>
              <div className="absolute bottom-2 text-[10px] uppercase tracking-wider font-semibold">
                {s.status}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Summary Modal — opens before payment */}
      {selectedSlot && (
        <BookingSummaryModal
          slot={selectedSlot}
          parkingName={PARKING_NAME}
          onClose={() => setSelectedSlot(null)}
        />
      )}
    </DashboardLayout>
  );
}
