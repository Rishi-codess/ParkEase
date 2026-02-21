import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { FaCar, FaLock, FaBan } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import BookingSummaryModal from "../../components/common/BookingSummaryModal";


// Mock parking context — in production this comes from navigation state or API
const PARKING_NAME = "City Mall Parking";

export default function ParkingSlots() {
  const navigate = useNavigate();
  const [slots] = useState(
    Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      status: i % 5 === 0 ? "RESERVED" : i % 3 === 0 ? "BOOKED" : "AVAILABLE",
    }))
  );

  const [selectedSlot, setSelectedSlot] = useState(null);

  // Debt / account block
  const [accountStatus, setAccountStatus] = useState("ACTIVE");
  const [outstanding, setOutstanding] = useState(0);
  const isBlocked = accountStatus === "PAYMENT_PENDING" || accountStatus === "SUSPENDED";

  useEffect(() => {
    const status = localStorage.getItem("parkease_account_status") || "ACTIVE";
    const owed = Number(localStorage.getItem("parkease_outstanding") || 0);
    setAccountStatus(status);
    setOutstanding(owed);
  }, []);

  const getSlotStyles = (status) => {
    if (isBlocked) return "bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed opacity-50";
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
    if (isBlocked) {
      toast.error("Clear your outstanding dues to make new bookings.");
      return;
    }
    if (slot.status === "AVAILABLE") {
      setSelectedSlot(slot);
    }
  };

  return (
    <DashboardLayout role="USER" title="Select Slot">
      <ToastContainer theme="dark" />

      <div className="flex flex-col h-full">

        {/* ── Account Block Banner ─────────────────────── */}
        {isBlocked && (
          <div className="mb-6 flex items-center gap-4 p-4 bg-neon-red/10 border border-neon-red/30 rounded-2xl">
            <FaBan className="text-neon-red text-xl shrink-0" />
            <div className="flex-1">
              <p className="text-neon-red font-black text-sm">
                {accountStatus === "SUSPENDED" ? "Account Suspended" : "Bookings Blocked — Payment Pending"}
              </p>
              <p className="text-gray-400 text-xs mt-0.5">
                Clear ₹{outstanding} outstanding dues to unlock new bookings.
              </p>
            </div>
            <button
              onClick={() => navigate("/user/payments")}
              className="px-4 py-2 bg-neon-red text-white rounded-xl font-bold text-sm hover:bg-red-500 transition-all whitespace-nowrap"
            >
              Pay ₹{outstanding}
            </button>
          </div>
        )}

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
