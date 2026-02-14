import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaUserEdit, FaSave, FaSignOutAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function ProfileModal({ isOpen, onClose, user, onSave, onLogout }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(user || {});

    useEffect(() => {
        setFormData(user || {});
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onSave(formData);
        setIsEditing(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* BACKDROP */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end"
                    >
                        {/* MODAL SLIDE-OVER */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md h-full bg-dark-card border-l border-white/10 shadow-2xl p-8 overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-white">My Profile</h2>
                                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                                    <FaTimes />
                                </button>
                            </div>

                            {/* AVATAR SECTION */}
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue p-[3px] mb-4 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                                    <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center overflow-hidden">
                                        <span className="text-4xl font-bold text-white">{formData.name?.charAt(0)}</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{formData.name}</h3>
                                <span className="px-3 py-1 rounded-full bg-neon-purple/20 text-neon-purple text-xs font-bold border border-neon-purple/30">
                                    Premium Member
                                </span>
                            </div>

                            {/* FORM FIELDS */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase tracking-widest font-bold ml-1">Full Name</label>
                                    <div className="relative">
                                        <input
                                            name="name"
                                            disabled={!isEditing}
                                            value={formData.name || ""}
                                            onChange={handleChange}
                                            className={`w-full bg-dark-bg/50 border rounded-xl px-4 py-3 text-white outline-none transition-all ${isEditing ? "border-neon-blue focus:ring-1 focus:ring-neon-blue" : "border-white/10 text-gray-400"}`}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase tracking-widest font-bold ml-1">Email Address</label>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            name="email"
                                            disabled={!isEditing}
                                            value={formData.email || ""}
                                            onChange={handleChange}
                                            className={`w-full bg-dark-bg/50 border rounded-xl pl-11 pr-4 py-3 text-white outline-none transition-all ${isEditing ? "border-neon-blue focus:ring-1 focus:ring-neon-blue" : "border-white/10 text-gray-400"}`}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase tracking-widest font-bold ml-1">Phone Number</label>
                                    <div className="relative">
                                        <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            name="phone"
                                            disabled={!isEditing}
                                            value={formData.phone || ""}
                                            onChange={handleChange}
                                            className={`w-full bg-dark-bg/50 border rounded-xl pl-11 pr-4 py-3 text-white outline-none transition-all ${isEditing ? "border-neon-blue focus:ring-1 focus:ring-neon-blue" : "border-white/10 text-gray-400"}`}
                                        />
                                    </div>
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="pt-6 space-y-3">
                                    {isEditing ? (
                                        <button
                                            onClick={handleSave}
                                            className="w-full py-3.5 rounded-xl bg-neon-green text-black font-bold flex items-center justify-center gap-2 hover:bg-green-400 transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                                        >
                                            <FaSave /> Save Changes
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="w-full py-3.5 rounded-xl bg-white/5 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 border border-white/10 transition-all"
                                        >
                                            <FaUserEdit /> Edit Profile
                                        </button>
                                    )}

                                    <button
                                        onClick={onLogout}
                                        className="w-full py-3.5 rounded-xl bg-neon-red/10 text-neon-red font-bold flex items-center justify-center gap-2 hover:bg-neon-red/20 border border-neon-red/20 transition-all"
                                    >
                                        <FaSignOutAlt /> Sign Out
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
