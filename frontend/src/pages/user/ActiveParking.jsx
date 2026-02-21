import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
    FaCheckCircle, FaParking, FaClock, FaRupeeSign,
    FaLock, FaCalendarAlt, FaExclamationTriangle,
    FaPlus, FaStop, FaSkullCrossbones,
} from "react-icons/fa";

const FALLBACK_BOOKED_AT = new Date().toISOString();
const PENALTY_PER_INTERVAL = 10;      // ₹10
const PENALTY_INTERVAL_MS = 15 * 60 * 1000; // 15 min

function useCountdown(targetTimeMs) {
    const [timeLeft, setTimeLeft] = useState(0);
    useEffect(() => {
        const update = () => setTimeLeft(Math.max(0, targetTimeMs - Date.now()));
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, [targetTimeMs]);
    const hours = Math.floor(timeLeft / 3600000);
    const mins = Math.floor((timeLeft % 3600000) / 60000);
    const secs = Math.floor((timeLeft % 60000) / 1000);
    return { hours, mins, secs, expired: timeLeft === 0 };
}

export default function ActiveParking() {
    const navigate = useNavigate();
    const location = useLocation();

    const booking = useMemo(() => location.state || {
        slotId: "A-01",
        parkingName: "City Mall Parking",
        duration: 1,
        totalAmount: 50,
        ratePerHour: 50,
        bookedAt: FALLBACK_BOOKED_AT,
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Total duration may grow when user extends parking
    const [totalDuration] = useState(booking.duration || 1);
    const [totalPaid] = useState(booking.totalAmount || 50);

    const bookedAt = useMemo(() => new Date(booking.bookedAt), [booking.bookedAt]);
    const expiresAtMs = useMemo(
        () => bookedAt.getTime() + totalDuration * 3600000,
        [bookedAt, totalDuration]
    );

    const { hours, mins, secs, expired } = useCountdown(expiresAtMs);

    // ── Overtime / penalty tracking ──────────────────────────────────────────
    const overtimeStartRef = useRef(null);
    const [penaltyAmount, setPenaltyAmount] = useState(0);
    const [overtimeDisplay, setOvertimeDisplay] = useState({ h: 0, m: 0, s: 0 });

    useEffect(() => {
        if (!expired) { overtimeStartRef.current = null; return; }
        if (!overtimeStartRef.current) overtimeStartRef.current = Date.now();

        const id = setInterval(() => {
            const overMs = Date.now() - overtimeStartRef.current;
            const intervals = Math.floor(overMs / PENALTY_INTERVAL_MS);
            setPenaltyAmount(intervals * PENALTY_PER_INTERVAL);
            setOvertimeDisplay({
                h: Math.floor(overMs / 3600000),
                m: Math.floor((overMs % 3600000) / 60000),
                s: Math.floor((overMs % 60000) / 1000),
            });
        }, 1000);
        return () => clearInterval(id);
    }, [expired]);

    // ── Helpers ──────────────────────────────────────────────────────────────
    const fmt = (d) =>
        d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

    const timerColor = expired ? "text-neon-red" : hours === 0 && mins < 15 ? "text-yellow-400" : "text-neon-green";

    // ── Actions ──────────────────────────────────────────────────────────────
    const handleExtend = () => {
        navigate("/user/payment", {
            state: {
                intent: "extend",
                slotId: booking.slotId,
                parkingName: booking.parkingName,
                ratePerHour: booking.ratePerHour || 50,
                currentDuration: totalDuration,
                currentPaid: totalPaid,
                bookedAt: booking.bookedAt,
            },
        });
    };

    const handleEndParking = () => {
        navigate("/user/final-bill", {
            state: {
                booking: { ...booking, duration: totalDuration },
                baseAmount: totalPaid,
                penaltyAmount,
                overtimeDisplay,
            },
        });
    };

    const slotBadge = expired
        ? { label: "OVERDUE", cls: "bg-neon-red/20 text-neon-red border-neon-red/30" }
        : { label: "LOCKED", cls: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" };

    return (
        <DashboardLayout role="USER">
            <div className="max-w-2xl mx-auto">

                {/* ── Success Banner ─────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-gradient-to-r from-neon-green/20 to-neon-blue/10 border border-neon-green/30 rounded-2xl p-6 mb-8 overflow-hidden flex items-center gap-5"
                >
                    <div className="absolute inset-0 opacity-5"
                        style={{ backgroundImage: "radial-gradient(circle, #22c55e 1px, transparent 1px)", backgroundSize: "18px 18px" }}
                    />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="w-14 h-14 rounded-full bg-neon-green/20 border-2 border-neon-green flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(34,197,94,0.4)]"
                    >
                        <FaCheckCircle className="text-neon-green text-3xl" />
                    </motion.div>
                    <div>
                        <h1 className="text-2xl font-black text-white">Booking Confirmed!</h1>
                        <p className="text-neon-green/80 text-sm mt-0.5">
                            Payment successful · Slot is now locked for you
                        </p>
                    </div>
                </motion.div>

                {/* ── Overtime / Penalty Banner ──────────────────────── */}
                <AnimatePresence>
                    {expired && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6 bg-neon-red/10 border border-neon-red/40 rounded-2xl p-5 flex items-center gap-4"
                        >
                            <FaSkullCrossbones className="text-neon-red text-2xl shrink-0 animate-pulse" />
                            <div className="flex-1">
                                <p className="text-neon-red font-black text-sm uppercase tracking-wide mb-1">
                                    Parking Time Exceeded — Penalty Running
                                </p>
                                <p className="text-gray-400 text-xs">
                                    ₹{PENALTY_PER_INTERVAL} penalty per 15 minutes of overtime.
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-white text-sm font-mono">
                                        Overtime: {String(overtimeDisplay.h).padStart(2, "0")}:{String(overtimeDisplay.m).padStart(2, "0")}:{String(overtimeDisplay.s).padStart(2, "0")}
                                    </span>
                                    <span className="px-3 py-1 bg-neon-red/20 rounded-full text-neon-red font-black text-sm border border-neon-red/30">
                                        Penalty: ₹{penaltyAmount}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Session Card ───────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-[#0f1629] border border-white/10 rounded-2xl overflow-hidden mb-6"
                >
                    <div className="h-1 w-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue" />
                    <div className="p-7">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-white">Active Parking Session</h2>
                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${slotBadge.cls}`}>
                                <FaLock size={10} />
                                {slotBadge.label}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <InfoTile icon={<FaParking className="text-neon-blue text-xl" />} label="Parking" value={booking.parkingName} />
                            <InfoTile
                                icon={<span className="text-neon-purple font-black text-lg">#</span>}
                                label="Slot ID"
                                value={<span className="font-mono text-neon-purple font-black">{booking.slotId}</span>}
                            />
                            <InfoTile icon={<FaCalendarAlt className="text-gray-400 text-lg" />} label="Started At" value={fmt(bookedAt)} />
                            <InfoTile icon={<FaClock className="text-yellow-400 text-lg" />} label="Expires At" value={fmt(new Date(expiresAtMs))} />
                            <InfoTile
                                icon={<FaRupeeSign className="text-neon-green text-lg" />}
                                label="Total Paid"
                                value={<span className="text-neon-green font-black">₹{totalPaid}</span>}
                            />
                            <InfoTile icon={<FaClock className="text-neon-blue text-lg" />} label="Duration" value={`${totalDuration}h`} />
                        </div>

                        {/* ── Live Timer ─────────────────────────────── */}
                        <div className={`rounded-xl p-5 text-center border ${expired ? "bg-neon-red/5 border-neon-red/30" : "bg-black/30 border-white/10"}`}>
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">
                                {expired ? "Session Expired" : "Time Remaining"}
                            </p>
                            <div className={`text-5xl font-black font-mono ${timerColor} transition-colors`}>
                                {String(hours).padStart(2, "0")}:
                                {String(mins).padStart(2, "0")}:
                                {String(secs).padStart(2, "0")}
                            </div>
                            {!expired && (
                                <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full rounded-full ${hours === 0 && mins < 15 ? "bg-yellow-400" : "bg-neon-green"}`}
                                        initial={{ width: "100%" }}
                                        animate={{
                                            width: `${Math.max(0, ((expiresAtMs - Date.now()) / (totalDuration * 3600000)) * 100).toFixed(1)}%`,
                                        }}
                                        transition={{ duration: 1 }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* ── Action Buttons ─────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="grid grid-cols-2 gap-4"
                >
                    {/* Extend Parking */}
                    <button
                        onClick={handleExtend}
                        className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white border border-neon-blue/40 bg-neon-blue/10 hover:bg-neon-blue/20 hover:border-neon-blue/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all"
                    >
                        <FaPlus /> Extend Parking
                    </button>

                    {/* End Parking */}
                    <button
                        onClick={handleEndParking}
                        className={`flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${expired
                            ? "bg-neon-red text-white hover:bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse"
                            : "bg-gradient-to-r from-neon-red/80 to-neon-red text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                            }`}
                    >
                        <FaStop /> End Parking
                    </button>
                </motion.div>

                {/* Penalty tip when timer is low */}
                {!expired && hours === 0 && mins < 15 && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 text-center text-xs text-yellow-400/70 flex items-center justify-center gap-1"
                    >
                        <FaExclamationTriangle size={10} />
                        Extend now to avoid ₹{PENALTY_PER_INTERVAL}/15 min overtime penalty
                    </motion.p>
                )}
            </div>
        </DashboardLayout>
    );
}

function InfoTile({ icon, label, value }) {
    return (
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-1">
                {icon}
                <p className="text-gray-500 text-xs uppercase tracking-wide">{label}</p>
            </div>
            <p className="text-white font-bold">{value}</p>
        </div>
    );
}
