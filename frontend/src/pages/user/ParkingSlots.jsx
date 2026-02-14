import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { FaCar, FaCheckCircle, FaCreditCard, FaLock, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

export default function ParkingSlots() {
  // Mock Data: Initial Slot States
  const [slots, setSlots] = useState(
    Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      status: i % 5 === 0 ? "RESERVED" : i % 3 === 0 ? "BOOKED" : "AVAILABLE", // Randomize initial states
    }))
  );

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Helper to get slot styles
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
      setShowPaymentModal(true);
    }
  };

  const handleBooking = () => {
    setProcessingPayment(true);

    // Simulate Payment Processing
    setTimeout(() => {
      setSlots((prev) =>
        prev.map((s) =>
          s.id === selectedSlot.id ? { ...s, status: "BOOKED" } : s
        )
      );
      setProcessingPayment(false);
      setShowPaymentModal(false);
      setSelectedSlot(null);
      toast.success(`Slot #${selectedSlot.id} booked successfully!`);
    }, 2000);
  };

  return (
    <DashboardLayout role="USER" title="Select Slot">
      <ToastContainer theme="dark" />

      <div className="flex flex-col h-full">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-white">Select a Spot</h2>
            <p className="text-gray-400">Green slots are available for booking.</p>
          </div>

          {/* Legend */}
          <div className="flex gap-4 bg-dark-card/50 p-3 rounded-lg border border-white/5">
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="w-3 h-3 rounded-full bg-neon-green shadow-[0_0_5px_rgba(34,197,94,0.8)]"></span> Available
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.8)]"></span> Reserved
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="w-3 h-3 rounded-full bg-neon-red shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span> Booked
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

      {/* Booking Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedSlot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => !processingPayment && setShowPaymentModal(false)}
            ></motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-dark-card border border-white/10 p-8 rounded-2xl shadow-2xl max-w-sm w-full z-10"
            >
              <button
                onClick={() => setShowPaymentModal(false)}
                disabled={processingPayment}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>

              <h3 className="text-2xl font-bold text-white mb-2">Book Slot #{selectedSlot.id}</h3>
              <p className="text-gray-400 mb-6">Complete payment to reserve this spot.</p>

              <div className="bg-dark-bg/50 p-4 rounded-xl mb-6 border border-white/5 flex justify-between items-center">
                <span className="text-gray-300">Price (1 hr)</span>
                <span className="text-2xl font-bold text-neon-green">$5.00</span>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleBooking}
                  disabled={processingPayment}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${processingPayment
                      ? "bg-gray-600 cursor-not-allowed text-gray-300"
                      : "bg-gradient-to-r from-neon-blue to-neon-purple hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] text-white"
                    }`}
                >
                  {processingPayment ? (
                    <>Processing...</>
                  ) : (
                    <><FaCreditCard /> Pay & Book</>
                  )}
                </button>
              </div>

              {processingPayment && (
                <div className="mt-4 text-center text-sm text-neon-blue animate-pulse">
                  Securely processing your payment...
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
