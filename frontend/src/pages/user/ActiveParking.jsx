import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
    FaCheckCircle,
    FaParking,
    FaClock,
    FaRupeeSign,
    FaHistory,
    FaLock,
    FaMapMarkerAlt,
    FaCalendarAlt,
} from "react-icons/fa";

// Stable fallback timestamp — created once at module load, not on every render
const FALLBACK_BOOKED_AT = new Date().toISOString();

function useCountdown(targetTimeMs) {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const update = () => {
            const diff = Math.max(0, targetTimeMs - Date.now());
            setTimeLeft(diff);
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, [targetTimeMs]); // targetTimeMs is a number — stable across renders

    const hours = Math.floor(timeLeft / 3600000);
    const mins = Math.floor((timeLeft % 3600000) / 60000);
    const secs = Math.floor((timeLeft % 60000) / 1000);
    return { hours, mins, secs, expired: timeLeft === 0 };
}

export default function ActiveParking() {
    const navigate = useNavigate();
    const location = useLocation();

    // useMemo ensures the fallback object (with its Date) is stable across renders
    const booking = useMemo(() => location.state || {
        slotId: "A-01",
        parkingName: "City Mall Parking",
        duration: 1,
        totalAmount: 50,
        bookedAt: FALLBACK_BOOKED_AT,
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // intentionally empty deps — location.state is set once on navigation

    const bookedAt = useMemo(() => new Date(booking.bookedAt), [booking.bookedAt]);
    // Pass a stable number (ms) rather than a Date object to avoid referential inequality
    const expiresAtMs = useMemo(
        () => bookedAt.getTime() + booking.duration * 60 * 60 * 1000,
        [bookedAt, booking.duration]
    );
    const { hours, mins, secs, expired } = useCountdown(expiresAtMs);

    const fmt = (d) =>
        d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

    const timerColor = expired
        ? "text-neon-red"
        : hours === 0 && mins < 15
            ? "text-yellow-400"
            : "text-neon-green";

    return (
        <DashboardLayout role="USER">
            <div className="max-w-2xl mx-auto">
                {/* Success Banner */}
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

                {/* Slot Status Card */}
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
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                <FaLock size={10} />
                                LOCKED
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <InfoTile
                                icon={<FaParking className="text-neon-blue text-xl" />}
                                label="Parking"
                                value={booking.parkingName}
                            />
                            <InfoTile
                                icon={<span className="text-neon-purple font-black text-lg">#</span>}
                                label="Slot ID"
                                value={
                                    <span className="font-mono text-neon-purple font-black">
                                        {booking.slotId}
                                    </span>
                                }
                            />
                            <InfoTile
                                icon={<FaCalendarAlt className="text-gray-400 text-lg" />}
                                label="Started At"
                                value={fmt(bookedAt)}
                            />
                            <InfoTile
                                icon={<FaClock className="text-yellow-400 text-lg" />}
                                label="Expires At"
                                value={fmt(new Date(expiresAtMs))}
                            />
                            <InfoTile
                                icon={<FaRupeeSign className="text-neon-green text-lg" />}
                                label="Amount Paid"
                                value={
                                    <span className="text-neon-green font-black">
                                        ₹{booking.totalAmount}
                                    </span>
                                }
                            />
                            <InfoTile
                                icon={<FaClock className="text-neon-blue text-lg" />}
                                label="Duration"
                                value={`${booking.duration} hour${booking.duration > 1 ? "s" : ""}`}
                            />
                        </div>

                        {/* Live Countdown Timer */}
                        <div className="bg-black/30 border border-white/10 rounded-xl p-5 text-center">
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
                                        className={`h-full rounded-full ${hours === 0 && mins < 15 ? "bg-yellow-400" : "bg-neon-green"
                                            }`}
                                        initial={{ width: "100%" }}
                                        animate={{
                                            width: `${(
                                                ((expiresAtMs - Date.now()) / (booking.duration * 3600000)) *
                                                100
                                            ).toFixed(1)}%`,
                                        }}
                                        transition={{ duration: 1 }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="grid grid-cols-2 gap-4"
                >
                    <button
                        onClick={() => navigate("/user/bookings")}
                        className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-gray-300 border border-white/10 hover:border-white/30 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <FaHistory />
                        View History
                    </button>
                    <button
                        onClick={() => navigate("/user/dashboard")}
                        className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-neon-blue to-neon-purple hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all"
                    >
                        <FaMapMarkerAlt />
                        Find More Parking
                    </button>
                </motion.div>
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
