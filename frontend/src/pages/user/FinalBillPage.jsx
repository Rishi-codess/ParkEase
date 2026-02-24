import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
    FaRupeeSign, FaExclamationTriangle, FaCreditCard,
    FaParking, FaSkullCrossbones, FaArrowLeft,
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
        // Mark account as PAYMENT_PENDING in localStorage
        localStorage.setItem("parkease_account_status", "PAYMENT_PENDING");
        localStorage.setItem("parkease_outstanding", String(totalPayable));
        navigate("/user/payments", { replace: true });
    };

    return (
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
                    Choosing "Pay Later" will block future bookings until dues are cleared.
                    Your slot will be released automatically.
                </p>
            </div>
        </DashboardLayout>
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
