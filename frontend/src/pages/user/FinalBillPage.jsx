import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
    FaRupeeSign, FaExclamationTriangle, FaCreditCard,
    FaParking, FaSkullCrossbones, FaArrowLeft, FaBan,
} from "react-icons/fa";

export default function FinalBillPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        booking = {},
        baseAmount = 50,
        penaltyAmount = 0,
        overtimeDisplay = { h: 0, m: 0, s: 0 },
    } = location.state || {};

    const totalPayable = baseAmount + penaltyAmount;
    const [showWarningModal, setShowWarningModal] = useState(false);

    const handlePayNow = () => {
        // Clear any outstanding debt flag first
        localStorage.removeItem("parkease_account_status");
        localStorage.removeItem("parkease_outstanding");

        navigate("/user/payment", {
            state: {
                intent: "final",
                slotId: booking.slotId || "A-01",
                parkingName: booking.parkingName || "City Mall Parking",
                duration: booking.duration || 1,
                baseAmount,
                penaltyAmount,
                totalAmount: totalPayable,
                ratePerHour: booking.ratePerHour || 50,
            },
        });
    };

    const handlePayLater = () => {
        // Get current warnings
        const warnings = JSON.parse(localStorage.getItem("parkease_warnings") || "[]");
        const warningCount = warnings.length;

        if (warningCount >= 5) {
            toast.error("Maximum warnings reached! Your account may be blocked by admin.");
        }

        // Show confirmation modal
        setShowWarningModal(true);
    };

    const confirmPayLater = () => {
        // Add warning
        const warnings = JSON.parse(localStorage.getItem("parkease_warnings") || "[]");
        const newWarning = {
            id: Date.now(),
            amount: penaltyAmount,
            parkingName: booking.parkingName,
            slotId: booking.slotId,
            date: new Date().toISOString(),
            status: "UNPAID",
        };
        warnings.push(newWarning);
        localStorage.setItem("parkease_warnings", JSON.stringify(warnings));

        // Mark account status
        localStorage.setItem("parkease_account_status", "PAYMENT_PENDING");
        localStorage.setItem("parkease_outstanding", String(penaltyAmount));

        // Clear active booking
        localStorage.removeItem("parkease_active_booking");

        // If 5+ warnings, mark for admin review
        if (warnings.length >= 5) {
            localStorage.setItem("parkease_account_blocked", "true");
            toast.error("Your account has been flagged for review due to multiple penalties!");
        } else {
            toast.warning(`Warning ${warnings.length}/5 added. Pay your dues to avoid account suspension.`);
        }

        setTimeout(() => navigate("/user/payments", { replace: true }), 2000);
    };

    return (
        <>
            <ToastContainer 
                theme="dark" 
                position="top-right"
                autoClose={3000}
                style={{
                    zIndex: 9999,
                    top: '5rem',
                    right: '1rem'
                }}
            />
            <DashboardLayout role="USER">
                <div className="max-w-lg mx-auto">
                {/* Header */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0f1629] border border-white/10 rounded-2xl overflow-hidden"
                >
                    <div className="h-1 w-full bg-gradient-to-r from-neon-red via-neon-purple to-neon-blue" />

                    <div className="p-7">
                        {/* Title */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-neon-purple/20 border border-neon-purple/30 flex items-center justify-center">
                                <FaRupeeSign className="text-neon-purple text-xl" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white">Final Bill</h2>
                                <p className="text-gray-400 text-sm">
                                    {booking.parkingName || "City Mall Parking"} · Slot #{booking.slotId || "A-01"}
                                </p>
                            </div>
                        </div>

                        {/* Bill Breakdown */}
                        <div className="space-y-3 mb-8">
                            {/* Base */}
                            <BillRow
                                icon={<FaParking className="text-neon-blue" />}
                                label={`Base Parking (${booking.duration || 1}h)`}
                                amount={baseAmount}
                                color="text-white"
                                badge={{ label: "PAID", color: "bg-neon-green/20 text-neon-green border-neon-green/30" }}
                            />

                            {/* Penalty */}
                            {penaltyAmount > 0 && (
                                <BillRow
                                    icon={<FaSkullCrossbones className="text-neon-red" />}
                                    label={
                                        <span>
                                            Overtime Penalty{" "}
                                            <span className="text-xs text-gray-500">
                                                ({overtimeDisplay.h}h {overtimeDisplay.m}m overtime · ₹10/15min)
                                            </span>
                                        </span>
                                    }
                                    amount={penaltyAmount}
                                    color="text-neon-red"
                                    badge={{ label: "DUE", color: "bg-neon-red/20 text-neon-red border-neon-red/30" }}
                                />
                            )}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-white/10 mb-6" />

                        {/* Total */}
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-gray-300 font-bold text-lg">Total Payable</span>
                            <div className="text-right">
                                <span className={`text-4xl font-black ${penaltyAmount > 0 ? "text-neon-red" : "text-neon-green"}`}>
                                    ₹{totalPayable}
                                </span>
                                {penaltyAmount > 0 && (
                                    <p className="text-xs text-gray-500 mt-0.5">includes ₹{penaltyAmount} penalty</p>
                                )}
                            </div>
                        </div>

                        {/* Penalty warning */}
                        {penaltyAmount > 0 && (
                            <div className="flex items-start gap-2 p-3 bg-neon-red/5 border border-neon-red/20 rounded-xl mb-6">
                                <FaExclamationTriangle className="text-neon-red shrink-0 mt-0.5" />
                                <p className="text-xs text-red-300/70">
                                    <span className="font-bold text-neon-red">Penalty applied.</span>{" "}
                                    Overtime penalties accumulate at ₹10 per 15 minutes.
                                    Pay immediately to release the slot.
                                </p>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handlePayNow}
                                className="w-full py-4 rounded-xl font-black text-white bg-gradient-to-r from-neon-blue to-neon-purple hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2 text-lg"
                            >
                                <FaCreditCard />
                                Pay ₹{totalPayable} Now
                            </button>

                            <button
                                onClick={handlePayLater}
                                className="w-full py-3 rounded-xl font-bold text-gray-500 border border-white/10 hover:border-white/20 hover:text-gray-300 transition-all text-sm"
                            >
                                Pay Later · Account will be marked
                                <span className="text-yellow-400 ml-1">PAYMENT_PENDING</span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Info note about Pay Later */}
                <p className="text-center text-xs text-gray-600 mt-4">
                    Choosing "Pay Later" will add a warning to your account. After 5 warnings, 
                    admin may block your account.
                </p>

                {/* Warning Modal */}
                <AnimatePresence>
                    {showWarningModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                                onClick={() => setShowWarningModal(false)}
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="relative bg-[#0f1629] border border-neon-red/40 rounded-2xl p-6 max-w-md w-full"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-neon-red/20 border-2 border-neon-red flex items-center justify-center">
                                        <FaBan className="text-neon-red text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-white">Warning Notice</h3>
                                        <p className="text-xs text-gray-400">Payment Postponed</p>
                                    </div>
                                </div>

                                <div className="bg-neon-red/10 border border-neon-red/30 rounded-xl p-4 mb-4">
                                    <p className="text-sm text-gray-300 mb-3">
                                        By choosing to pay later, you will receive:{" "}
                                    </p>
                                    <ul className="space-y-2 text-xs text-gray-400">
                                        <li className="flex items-start gap-2">
                                            <span className="text-neon-red mt-0.5">•</span>
                                            <span><strong className="text-yellow-400">Warning #{JSON.parse(localStorage.getItem("parkease_warnings") || "[]").length + 1}/5</strong> added to your account</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-neon-red mt-0.5">•</span>
                                            <span>Future bookings will be <strong className="text-neon-red">blocked</strong> until payment</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-neon-red mt-0.5">•</span>
                                            <span>After 5 warnings, <strong className="text-neon-red">admin may suspend your account</strong></span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowWarningModal(false)}
                                        className="flex-1 py-3 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmPayLater}
                                        className="flex-1 py-3 rounded-xl font-bold text-white bg-neon-red hover:bg-red-500 transition-all"
                                    >
                                        Accept Warning
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
        </>
    );
}

function BillRow({ icon, label, amount, color, badge }) {
    return (
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
            <div className="flex items-center gap-3">
                <span className="shrink-0">{icon}</span>
                <span className="text-gray-300 text-sm">{label}</span>
            </div>
            <div className="flex items-center gap-3">
                {badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${badge.color}`}>
                        {badge.label}
                    </span>
                )}
                <span className={`font-black ${color}`}>₹{amount}</span>
            </div>
        </div>
    );
}
