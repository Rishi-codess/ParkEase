import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
    FaRupeeSign, FaClock, FaParking, FaCheckCircle,
    FaExclamationTriangle, FaBan, FaHistory, FaPlus,
    FaStop, FaShieldAlt, FaTimesCircle,
} from "react-icons/fa";

// ── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_HISTORY = [
    { id: 1, parkingName: "City Mall Parking", slot: "A-14", amount: 100, date: "21 Feb 2026", status: "PAID" },
    { id: 2, parkingName: "Hospital Parking", slot: "B-03", amount: 150, date: "19 Feb 2026", status: "PAID" },
    { id: 3, parkingName: "Railway Parking", slot: "C-07", amount: 50, date: "17 Feb 2026", status: "PAID" },
    { id: 4, parkingName: "Airport Terminal 1", slot: "D-22", amount: 200, date: "14 Feb 2026", status: "PENDING" },
];

const MOCK_ACTIVE = {
    slotId: "A-14",
    parkingName: "City Mall Parking",
    timeLeft: "01:24:37",
    expiresAt: "04:30 PM",
};

// Status badge helper
function StatusBadge({ status }) {
    const map = {
        PAID: "bg-neon-green/20 text-neon-green border-neon-green/30",
        PENDING: "bg-neon-red/20 text-neon-red border-neon-red/30",
        ACTIVE: "bg-neon-green/20 text-neon-green border-neon-green/30",
        PAYMENT_PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        SUSPENDED: "bg-neon-red/20 text-neon-red border-neon-red/30",
        OVERDUE: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${map[status] || map.PENDING}`}>
            {status}
        </span>
    );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, icon, children }) {
    return (
        <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-neon-blue">{icon}</span>
                {title}
            </h3>
            {children}
        </div>
    );
}

export default function PaymentsDashboard() {
    const navigate = useNavigate();

    // Read account status from localStorage (set by FinalBillPage Pay Later)
    const [accountStatus, setAccountStatus] = useState("ACTIVE");
    const [outstanding, setOutstanding] = useState(0);

    useEffect(() => {
        const status = localStorage.getItem("parkease_account_status") || "ACTIVE";
        const owed = Number(localStorage.getItem("parkease_outstanding") || 0);
        setAccountStatus(status);
        setOutstanding(owed);
    }, []);

    const clearDues = () => {
        navigate("/user/payment", {
            state: {
                intent: "final",
                slotId: "DUES",
                parkingName: "Outstanding Dues",
                duration: 0,
                totalAmount: outstanding,
            },
        });
    };

    const isBlocked = accountStatus === "PAYMENT_PENDING" || accountStatus === "SUSPENDED";

    return (
        <DashboardLayout role="USER">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-black text-white mb-1">Payments</h2>
                    <p className="text-gray-400 text-sm">Your parking financial overview</p>
                </div>

                {/* ── Account Status Banner ─────────────────────────── */}
                <AnimatePresence>
                    {isBlocked && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`mb-8 p-5 rounded-2xl border flex items-start gap-4 ${accountStatus === "SUSPENDED"
                                    ? "bg-neon-red/10 border-neon-red/40"
                                    : "bg-yellow-500/10 border-yellow-500/30"
                                }`}
                        >
                            <FaBan className={`text-2xl shrink-0 mt-0.5 ${accountStatus === "SUSPENDED" ? "text-neon-red" : "text-yellow-400"}`} />
                            <div className="flex-1">
                                <p className={`font-black text-sm uppercase tracking-wide ${accountStatus === "SUSPENDED" ? "text-neon-red" : "text-yellow-400"}`}>
                                    {accountStatus === "SUSPENDED" ? "Account Suspended" : "Payment Pending — Bookings Blocked"}
                                </p>
                                <p className="text-gray-400 text-xs mt-1">
                                    {accountStatus === "SUSPENDED"
                                        ? "Your account has been suspended due to 48h+ unpaid dues. Clear dues to restore access."
                                        : "You have an outstanding payment of ₹" + outstanding + ". Clear dues to make new bookings."}
                                </p>
                            </div>
                            <button
                                onClick={clearDues}
                                className="px-4 py-2 bg-neon-blue text-white rounded-xl font-bold text-sm hover:bg-blue-500 transition-all whitespace-nowrap"
                            >
                                Pay ₹{outstanding}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Section D: Account Status ─────────────────────── */}
                <Section title="Account Status" icon={<FaShieldAlt />}>
                    <div className="bg-dark-card/60 border border-white/5 rounded-2xl p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isBlocked ? "bg-neon-red/20 border border-neon-red/30" : "bg-neon-green/20 border border-neon-green/30"
                                }`}>
                                {isBlocked
                                    ? <FaTimesCircle className="text-neon-red text-xl" />
                                    : <FaCheckCircle className="text-neon-green text-xl" />
                                }
                            </div>
                            <div>
                                <p className="text-white font-bold">Account Status</p>
                                <p className="text-gray-500 text-xs mt-0.5">
                                    {isBlocked ? "Future bookings are blocked" : "All features available"}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <StatusBadge status={accountStatus} />
                            {outstanding > 0 && (
                                <p className="text-neon-red font-black text-sm mt-1">₹{outstanding} due</p>
                            )}
                        </div>
                    </div>
                </Section>

                {/* ── Section B: Active Parking ─────────────────────── */}
                <Section title="Active Parking" icon={<FaClock />}>
                    <div className="bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 border border-neon-blue/20 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-neon-blue/20 border border-neon-blue/30 flex items-center justify-center">
                                    <FaParking className="text-neon-blue" />
                                </div>
                                <div>
                                    <p className="text-white font-bold">{MOCK_ACTIVE.parkingName}</p>
                                    <p className="text-gray-400 text-xs">
                                        Slot #{MOCK_ACTIVE.slotId} · Expires {MOCK_ACTIVE.expiresAt}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                                <span className="text-neon-green font-mono font-black text-sm">{MOCK_ACTIVE.timeLeft}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => navigate("/user/active-parking")}
                                className="py-3 rounded-xl font-bold text-white border border-neon-blue/40 bg-neon-blue/10 hover:bg-neon-blue/20 transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                <FaPlus size={12} /> Extend Parking
                            </button>
                            <button
                                onClick={() => navigate("/user/active-parking")}
                                className="py-3 rounded-xl font-bold text-neon-red border border-neon-red/30 bg-neon-red/10 hover:bg-neon-red/20 transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                <FaStop size={12} /> End Parking
                            </button>
                        </div>
                    </div>
                </Section>

                {/* ── Section C: Pending Dues ───────────────────────── */}
                {outstanding > 0 && (
                    <Section title="Pending Dues" icon={<FaExclamationTriangle />}>
                        <div className="bg-neon-red/5 border border-neon-red/20 rounded-2xl p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-neon-red/20 border border-neon-red/30 flex items-center justify-center">
                                    <FaRupeeSign className="text-neon-red" />
                                </div>
                                <div>
                                    <p className="text-white font-bold">Outstanding Dues</p>
                                    <p className="text-gray-400 text-xs">Includes base + overtime penalty</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-neon-red font-black text-xl">₹{outstanding}</span>
                                <button
                                    onClick={clearDues}
                                    className="px-4 py-2 bg-neon-red text-white rounded-xl font-bold text-sm hover:bg-red-500 transition-all"
                                >
                                    Pay Now
                                </button>
                            </div>
                        </div>
                    </Section>
                )}

                {/* ── Section A: Payment History ────────────────────── */}
                <Section title="Payment History" icon={<FaHistory />}>
                    <div className="space-y-3">
                        {MOCK_HISTORY.map((item) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ x: 4 }}
                                className="bg-dark-card/60 border border-white/5 rounded-2xl p-5 flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.status === "PAID"
                                            ? "bg-neon-green/10 border-neon-green/30"
                                            : "bg-neon-red/10 border-neon-red/30"
                                        }`}>
                                        {item.status === "PAID"
                                            ? <FaCheckCircle className="text-neon-green" />
                                            : <FaExclamationTriangle className="text-neon-red" />
                                        }
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm">{item.parkingName}</p>
                                        <p className="text-gray-500 text-xs mt-0.5">
                                            Slot #{item.slot} · {item.date}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <StatusBadge status={item.status} />
                                    <span className={`font-black ${item.status === "PAID" ? "text-neon-green" : "text-neon-red"}`}>
                                        ₹{item.amount}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Section>
            </div>
        </DashboardLayout>
    );
}
