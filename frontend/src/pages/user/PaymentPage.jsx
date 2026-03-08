import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
    FaMobileAlt, FaCreditCard, FaWallet, FaLock,
    FaCheckCircle, FaArrowLeft, FaShieldAlt,
    FaParking, FaClock, FaRupeeSign,
} from "react-icons/fa";

const PAYMENT_TABS = [
    { id: "upi",    label: "UPI",    icon: FaMobileAlt  },
    { id: "card",   label: "Card",   icon: FaCreditCard },
    { id: "wallet", label: "Wallet", icon: FaWallet, disabled: true },
];

export default function PaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state    = location.state || {};
    const intent   = state.intent || "book";

    const booking = {
        slotId:          state.slotId          || "N/A",
        parkingName:     state.parkingName     || "Unknown Parking",
        duration:        state.duration        || 1,
        ratePerHour:     state.ratePerHour     || 50,
        totalAmount:     state.totalAmount     || 50,
        bookedAt:        state.bookedAt        || new Date().toISOString(),
        currentDuration: state.currentDuration || 1,
        currentPaid:     state.currentPaid     || 0,
        baseAmount:      state.baseAmount      || state.totalAmount || 50,
        penaltyAmount:   state.penaltyAmount   || 0,
    };

    const [activeTab,    setActiveTab]    = useState("upi");
    const [upiId,        setUpiId]        = useState("");
    const [cardNumber,   setCardNumber]   = useState("");
    const [expiry,       setExpiry]       = useState("");
    const [cvv,          setCvv]          = useState("");
    const [cardName,     setCardName]     = useState("");
    const [processing,   setProcessing]   = useState(false);
    const [success,      setSuccess]      = useState(false);
    const [selectedExt,  setSelectedExt]  = useState(1);

    const extensionAmount = intent === "extend" ? selectedExt * booking.ratePerHour : 0;
    const payableAmount   = intent === "extend" ? extensionAmount : booking.totalAmount;

    const formatCard   = (v) => v.replace(/\D/g,"").slice(0,16).replace(/(\d{4})/g,"$1 ").trim();
    const formatExpiry = (v) => { const c = v.replace(/\D/g,"").slice(0,4); return c.length >= 3 ? c.slice(0,2)+"/"+c.slice(2) : c; };

    const handlePayment = () => {
        if (activeTab === "upi" && !upiId.includes("@")) { toast.error("Enter a valid UPI ID (e.g. name@upi)"); return; }
        if (activeTab === "card") {
            if (cardNumber.replace(/\s/g,"").length < 16) { toast.error("Enter a valid 16-digit card number"); return; }
            if (!expiry || expiry.length < 5)             { toast.error("Enter a valid expiry date"); return; }
            if (!cvv    || cvv.length < 3)                { toast.error("Enter a valid CVV"); return; }
        }
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setSuccess(true);
            setTimeout(() => {
                if (intent === "extend") {
                    navigate("/user/active-parking", { state: { ...booking, duration: booking.currentDuration + selectedExt, totalAmount: booking.currentPaid + extensionAmount } });
                } else if (intent === "final") {
                    localStorage.removeItem("parkease_account_status");
                    localStorage.removeItem("parkease_outstanding");
                    navigate("/user/payments", { replace: true });
                } else {
                    navigate("/user/active-parking", { state: { ...booking, bookedAt: new Date().toISOString() } });
                }
            }, 1500);
        }, 2500);
    };

    return (
        <DashboardLayout role="USER">
            <ToastContainer theme="dark" />

            <AnimatePresence>
                {success && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark-bg/95 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                            className="w-24 h-24 rounded-full bg-neon-green/20 border-2 border-neon-green flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.5)]">
                            <FaCheckCircle className="text-neon-green text-5xl" />
                        </motion.div>
                        <h2 className="text-3xl font-black text-white mb-2">Payment Successful!</h2>
                        <p className="text-gray-400">
                            {intent === "extend" && "Parking extended! Returning to your session..."}
                            {intent === "final"  && "Dues cleared! Your account is now active."}
                            {intent === "book"   && "Redirecting to Active Parking..."}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-5xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group">
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Payment Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-[#0f1629] border border-white/10 rounded-2xl overflow-hidden">
                            <div className="h-1 w-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue" />
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-white mb-1">Complete Payment</h2>
                                <p className="text-gray-400 text-sm mb-7 flex items-center gap-2">
                                    <FaShieldAlt className="text-neon-green" /> Secured by 256-bit SSL encryption
                                </p>

                                {/* Tabs */}
                                <div className="flex gap-1 bg-white/5 p-1 rounded-xl mb-8 border border-white/10">
                                    {PAYMENT_TABS.map(({ id, label, icon: Icon, disabled }) => (
                                        <button key={id} disabled={disabled} onClick={() => !disabled && setActiveTab(id)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${disabled ? "text-gray-600 cursor-not-allowed" : activeTab === id ? "bg-neon-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                                            <Icon /> {label}
                                            {disabled && <span className="text-[9px] bg-gray-700 px-1.5 py-0.5 rounded-full text-gray-500 ml-1">SOON</span>}
                                        </button>
                                    ))}
                                </div>

                                <AnimatePresence mode="wait">
                                    {activeTab === "upi" && (
                                        <motion.div key="upi" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-5">
                                            <div>
                                                <label className="block text-gray-300 text-sm font-semibold mb-2">UPI ID</label>
                                                <div className="relative">
                                                    <FaMobileAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                                    <input type="text" placeholder="yourname@paytm / @gpay" value={upiId} onChange={e => setUpiId(e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50 focus:bg-neon-blue/5 transition-all" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center p-6 bg-white/5 rounded-xl border border-white/10 border-dashed">
                                                <div className="w-28 h-28 bg-white rounded-lg flex items-center justify-center mb-3">
                                                    <div className="grid grid-cols-7 gap-px p-2 w-full h-full">
                                                        {Array.from({ length: 49 }).map((_, i) => (
                                                            <div key={i} className={`rounded-[1px] ${[0,1,2,3,4,5,6,7,13,14,20,21,27,28,35,41,42,43,44,45,46,47,48,8,15,22,29,36,12,19,26,33,40,10,11,17,18,24,25,31,32,37,38,39].includes(i) ? "bg-[#1a1a2e]" : "bg-white"}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-gray-500 text-xs text-center">Scan with any UPI app · <span className="text-gray-600">Test Mode</span></p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === "card" && (
                                        <motion.div key="card" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-5">
                                            <div className="relative h-44 rounded-2xl bg-gradient-to-br from-neon-blue/30 via-neon-purple/30 to-neon-blue/10 border border-white/10 p-6 overflow-hidden">
                                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="w-10 h-7 rounded bg-yellow-400/70 border border-yellow-300/30" />
                                                    <FaCreditCard className="text-white/30 text-2xl" />
                                                </div>
                                                <p className="font-mono text-white text-xl tracking-[0.2em] mb-3">{cardNumber || "•••• •••• •••• ••••"}</p>
                                                <div className="flex justify-between items-end">
                                                    <div><p className="text-gray-500 text-[10px] uppercase">Card Holder</p><p className="text-white text-sm font-bold">{cardName || "YOUR NAME"}</p></div>
                                                    <div><p className="text-gray-500 text-[10px] uppercase">Expires</p><p className="text-white text-sm font-bold">{expiry || "MM/YY"}</p></div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-gray-300 text-sm font-semibold mb-2">Card Number</label>
                                                <input type="text" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={e => setCardNumber(formatCard(e.target.value))}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50 transition-all font-mono tracking-wider" />
                                            </div>
                                            <div>
                                                <label className="block text-gray-300 text-sm font-semibold mb-2">Cardholder Name</label>
                                                <input type="text" placeholder="As on card" value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50 transition-all" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-gray-300 text-sm font-semibold mb-2">Expiry</label>
                                                    <input type="text" placeholder="MM/YY" value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50 transition-all font-mono" />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-300 text-sm font-semibold mb-2">CVV</label>
                                                    <input type="password" placeholder="•••" maxLength={4} value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g,""))}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50 transition-all font-mono" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button onClick={handlePayment} disabled={processing}
                                    className={`w-full mt-8 py-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 transition-all ${processing ? "bg-gray-700 cursor-not-allowed text-gray-400" : "bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] active:scale-[0.98]"}`}>
                                    {processing
                                        ? <><div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin" /> Processing...</>
                                        : <><FaLock /> Pay ₹{payableAmount} Securely</>}
                                </button>
                                {processing && <p className="text-center text-xs text-neon-blue mt-3 animate-pulse">Please do not close this window...</p>}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#0f1629] border border-white/10 rounded-2xl overflow-hidden sticky top-24">
                            <div className="h-1 w-full bg-gradient-to-r from-neon-green to-neon-blue" />
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-white mb-5">Order Summary</h3>
                                <div className="space-y-4 mb-6">
                                    <SRow icon={<FaParking className="text-neon-blue" />}            label="Parking"  value={booking.parkingName} />
                                    <SRow icon={<span className="text-neon-purple text-xs font-bold">#</span>} label="Slot" value={<span className="font-mono text-neon-purple font-bold">#{booking.slotId}</span>} />
                                    <SRow icon={<FaClock className="text-yellow-400" />}              label="Duration" value={`${booking.duration}h`} />
                                    <SRow icon={<FaRupeeSign className="text-gray-400" />}            label="Rate"     value={`₹${booking.ratePerHour}/hr`} />
                                </div>
                                <div className="border-t border-white/10 pt-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300 font-semibold">Total</span>
                                        <span className="text-3xl font-black text-neon-green">₹{payableAmount}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {["256-bit SSL encrypted", "Razorpay secured · Test Mode", "Instant booking confirmation"].map(t => (
                                        <div key={t} className="flex items-center gap-2 text-xs text-gray-500">
                                            <FaCheckCircle className="text-neon-green/70 shrink-0" /> {t}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function SRow({ icon, label, value }) {
    return (
        <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-gray-500 text-sm">{icon}{label}</span>
            <span className="text-white text-sm font-semibold">{value}</span>
        </div>
    );
}