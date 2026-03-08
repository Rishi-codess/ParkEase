import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  FaCheckCircle, FaRupeeSign, FaClock, FaParking,
  FaExclamationTriangle, FaDownload, FaHome,
} from "react-icons/fa";

export default function FinalBillPage() {
  const { state } = useLocation();
  const navigate  = useNavigate();

  const booking       = state?.booking       || {};
  const baseAmount    = state?.baseAmount    || 0;
  const penaltyAmount = state?.penaltyAmount || 0;
  const totalDue      = baseAmount + penaltyAmount;

  const now = new Date();
  const receiptNo = `PE-${Date.now().toString().slice(-8)}`;

  const rows = [
    { label: "Parking",      value: booking.parkingName || "N/A" },
    { label: "Slot",         value: <span className="font-mono text-neon-purple font-bold">#{booking.slotId || "N/A"}</span> },
    { label: "Duration",     value: `${booking.duration || 0}h` },
    { label: "Date",         value: now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
    { label: "Time",         value: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) },
    { label: "Receipt No",   value: <span className="font-mono text-xs text-gray-400">{receiptNo}</span> },
  ];

  return (
    <DashboardLayout role="USER">
      <div className="max-w-lg mx-auto">
        {/* Success banner */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-20 h-20 rounded-full bg-neon-green/20 border-2 border-neon-green flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
            <FaCheckCircle className="text-neon-green text-4xl" />
          </motion.div>
          <h2 className="text-3xl font-black text-white">Parking Ended</h2>
          <p className="text-gray-400 mt-1">Here's your final bill</p>
        </motion.div>

        {/* Bill card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-[#0f1629] border border-white/10 rounded-2xl overflow-hidden mb-6">
          <div className="h-1 w-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green" />
          <div className="p-7">
            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <FaParking className="text-neon-blue" /> Session Summary
            </h3>

            <div className="space-y-3 mb-6">
              {rows.map(r => (
                <div key={r.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-gray-400 text-sm">{r.label}</span>
                  <span className="text-white font-semibold text-sm">{r.value}</span>
                </div>
              ))}
            </div>

            {/* Amount breakdown */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 flex items-center gap-2"><FaRupeeSign size={11} /> Base Amount</span>
                <span className="text-white font-bold">₹{baseAmount}</span>
              </div>

              {penaltyAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-neon-red flex items-center gap-2"><FaExclamationTriangle size={11} /> Overtime Penalty</span>
                  <span className="text-neon-red font-bold">+₹{penaltyAmount}</span>
                </div>
              )}

              <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                <span className="text-white font-bold flex items-center gap-2"><FaClock size={12} /> Total Due</span>
                <span className="text-3xl font-black text-neon-green">₹{totalDue}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          className="grid grid-cols-2 gap-4">
          <button onClick={() => navigate("/user/payment", {
              state: { intent: "final", slotId: booking.slotId, parkingName: booking.parkingName, duration: 0, totalAmount: totalDue }
            })}
            className="py-4 rounded-xl font-bold text-white bg-gradient-to-r from-neon-blue to-neon-purple hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2">
            <FaRupeeSign /> Pay ₹{totalDue}
          </button>
          <button onClick={() => navigate("/user/dashboard")}
            className="py-4 rounded-xl font-bold text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2">
            <FaHome /> Go Home
          </button>
        </motion.div>

        <p className="text-center text-xs text-gray-600 mt-6 flex items-center justify-center gap-1">
          <FaDownload size={10} /> Receipt #{receiptNo}
        </p>
      </div>
    </DashboardLayout>
  );
}