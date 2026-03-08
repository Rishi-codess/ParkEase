import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  FaUser, FaBell, FaLock, FaCar, FaSave,
  FaCheckCircle, FaCamera, FaToggleOn, FaToggleOff,
  FaTrash, FaExclamationTriangle,
} from "react-icons/fa";

const TABS = [
  { id: "profile",       label: "Profile",        icon: FaUser   },
  { id: "notifications", label: "Notifications",  icon: FaBell   },
  { id: "security",      label: "Security",       icon: FaLock   },
  { id: "vehicles",      label: "My Vehicles",    icon: FaCar    },
];

function Toggle({ enabled, onChange, label }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <span className="text-gray-300 text-sm">{label}</span>
      <button onClick={() => onChange(!enabled)} className="transition-colors">
        {enabled
          ? <FaToggleOn  className="text-neon-blue text-2xl" />
          : <FaToggleOff className="text-gray-600 text-2xl" />}
      </button>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 mb-6">
      <h4 className="text-white font-bold mb-5">{title}</h4>
      {children}
    </div>
  );
}

export default function Settingspage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved,     setSaved]     = useState(false);

  // Profile state
  const [name,  setName]  = useState("Rishi Kumar");
  const [email, setEmail] = useState("rishi@email.com");
  const [phone, setPhone] = useState("9876543210");
  const [city,  setCity]  = useState("Chennai");

  // Notification toggles
  const [notifs, setNotifs] = useState({
    bookingConfirm:  true,
    expiryReminder:  true,
    penaltyAlerts:   true,
    promotions:      false,
    smsAlerts:       false,
  });

  // Security
  const [curPwd, setCurPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [conPwd, setConPwd] = useState("");

  // Vehicles
  const [vehicles, setVehicles] = useState([
    { id: 1, number: "TN 01 AB 1234", type: "Car",  primary: true  },
    { id: 2, number: "TN 05 CD 5678", type: "Bike", primary: false },
  ]);
  const [newVehicle, setNewVehicle] = useState("");
  const [newVType,   setNewVType]   = useState("Car");
  const [deleteId,   setDeleteId]   = useState(null);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addVehicle = () => {
    if (!newVehicle.trim()) return;
    setVehicles(v => [...v, { id: Date.now(), number: newVehicle.trim().toUpperCase(), type: newVType, primary: false }]);
    setNewVehicle(""); setNewVType("Car");
  };

  const removeVehicle = (id) => { setVehicles(v => v.filter(x => x.id !== id)); setDeleteId(null); };
  const makePrimary   = (id) => setVehicles(v => v.map(x => ({ ...x, primary: x.id === id })));

  const setNotif = (key) => (val) => setNotifs(n => ({ ...n, [key]: val }));

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50 focus:bg-neon-blue/5 transition-all text-sm";

  return (
    <DashboardLayout role="USER">
      {/* Saved toast */}
      <AnimatePresence>
        {saved && (
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
            className="fixed top-6 right-6 z-50 bg-neon-green/20 border border-neon-green/40 rounded-xl px-5 py-3 flex items-center gap-2 text-neon-green font-bold text-sm shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <FaCheckCircle /> Changes saved!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-card border border-neon-red/30 rounded-2xl p-8 max-w-xs w-full text-center">
              <FaExclamationTriangle className="text-neon-red text-3xl mx-auto mb-3" />
              <h3 className="text-white font-bold mb-2">Remove Vehicle?</h3>
              <p className="text-gray-400 text-sm mb-6">This vehicle will be removed from your account.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 border border-white/10 transition-all">Cancel</button>
                <button onClick={() => removeVehicle(deleteId)} className="flex-1 py-3 rounded-xl bg-neon-red text-white font-bold hover:bg-red-500 transition-all">Remove</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mb-8">
        <h2 className="text-3xl font-black text-white mb-1">Settings</h2>
        <p className="text-gray-400 text-sm">Manage your account preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar tabs */}
        <div className="lg:w-56 shrink-0">
          <div className="bg-dark-card/60 border border-white/5 rounded-2xl p-2 space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === id ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* PROFILE */}
          {activeTab === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <Card title="Profile Photo">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-purple/40 to-neon-blue/40 border-2 border-neon-purple/30 flex items-center justify-center text-3xl font-black text-white">
                      {name[0]}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-neon-blue rounded-full flex items-center justify-center border-2 border-dark-bg hover:bg-blue-500 transition-colors">
                      <FaCamera size={10} className="text-white" />
                    </button>
                  </div>
                  <div>
                    <p className="text-white font-bold">{name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{email}</p>
                    <p className="text-gray-600 text-xs mt-0.5">Joined Jan 2026</p>
                  </div>
                </div>
              </Card>

              <Card title="Personal Information">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Full Name</label>
                      <input value={name} onChange={e => setName(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Phone</label>
                      <input value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Email</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">City</label>
                    <input value={city} onChange={e => setCity(e.target.value)} className={inputCls} />
                  </div>
                  <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-neon-blue text-white rounded-xl font-bold hover:bg-blue-500 transition-all text-sm">
                    <FaSave /> Save Changes
                  </button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <motion.div key="notifs" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <Card title="Push Notifications">
                <Toggle enabled={notifs.bookingConfirm} onChange={setNotif("bookingConfirm")} label="Booking confirmations" />
                <Toggle enabled={notifs.expiryReminder} onChange={setNotif("expiryReminder")} label="Expiry reminders (15 min before)" />
                <Toggle enabled={notifs.penaltyAlerts}  onChange={setNotif("penaltyAlerts")}  label="Overtime penalty alerts" />
                <Toggle enabled={notifs.promotions}     onChange={setNotif("promotions")}     label="Promotions & offers" />
              </Card>
              <Card title="SMS Alerts">
                <Toggle enabled={notifs.smsAlerts} onChange={setNotif("smsAlerts")} label="SMS booking updates (₹0.50/msg)" />
              </Card>
              <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-neon-blue text-white rounded-xl font-bold hover:bg-blue-500 transition-all text-sm">
                <FaSave /> Save Preferences
              </button>
            </motion.div>
          )}

          {/* SECURITY */}
          {activeTab === "security" && (
            <motion.div key="security" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <Card title="Change Password">
                <div className="space-y-4">
                  {[
                    { label: "Current Password", val: curPwd, set: setCurPwd },
                    { label: "New Password",      val: newPwd, set: setNewPwd },
                    { label: "Confirm Password",  val: conPwd, set: setConPwd },
                  ].map(({ label, val, set }) => (
                    <div key={label}>
                      <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">{label}</label>
                      <input type="password" value={val} onChange={e => set(e.target.value)} placeholder="••••••••" className={inputCls} />
                    </div>
                  ))}
                  {newPwd && conPwd && newPwd !== conPwd && (
                    <p className="text-neon-red text-xs flex items-center gap-1"><FaExclamationTriangle size={10} /> Passwords do not match</p>
                  )}
                  <button onClick={handleSave}
                    disabled={!curPwd || !newPwd || !conPwd || newPwd !== conPwd}
                    className="flex items-center gap-2 px-6 py-3 bg-neon-blue text-white rounded-xl font-bold hover:bg-blue-500 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                    <FaLock /> Update Password
                  </button>
                </div>
              </Card>
              <Card title="Active Sessions">
                <div className="space-y-3">
                  {[
                    { device: "Chrome · Windows", location: "Chennai, IN", current: true  },
                    { device: "Safari · iPhone",  location: "Chennai, IN", current: false },
                  ].map(s => (
                    <div key={s.device} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <div>
                        <p className="text-white text-sm font-semibold">{s.device}</p>
                        <p className="text-gray-500 text-xs">{s.location}</p>
                      </div>
                      {s.current
                        ? <span className="px-2.5 py-1 bg-neon-green/20 text-neon-green rounded-full text-xs font-bold border border-neon-green/30">Current</span>
                        : <button className="px-3 py-1 text-xs text-neon-red hover:bg-neon-red/20 rounded-lg transition-all font-bold">Revoke</button>}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* VEHICLES */}
          {activeTab === "vehicles" && (
            <motion.div key="vehicles" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <Card title="Registered Vehicles">
                <div className="space-y-3 mb-5">
                  {vehicles.map(v => (
                    <div key={v.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${v.primary ? "bg-neon-blue/10 border-neon-blue/30" : "bg-white/5 border-white/5"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${v.primary ? "bg-neon-blue/20" : "bg-white/10"}`}>
                          <FaCar className={v.primary ? "text-neon-blue" : "text-gray-400"} />
                        </div>
                        <div>
                          <p className="text-white font-mono font-bold text-sm">{v.number}</p>
                          <p className="text-gray-500 text-xs">{v.type}{v.primary ? " · Primary" : ""}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!v.primary && (
                          <button onClick={() => makePrimary(v.id)} className="px-2.5 py-1 text-xs bg-white/5 text-gray-400 hover:text-white rounded-lg border border-white/10 transition-all font-bold">Set Primary</button>
                        )}
                        {!v.primary && (
                          <button onClick={() => setDeleteId(v.id)} className="p-2 text-gray-500 hover:text-neon-red hover:bg-neon-red/10 rounded-lg transition-all">
                            <FaTrash size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-5">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Add New Vehicle</p>
                  <div className="flex gap-3">
                    <select value={newVType} onChange={e => setNewVType(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm outline-none focus:border-neon-blue/50 shrink-0">
                      <option>Car</option>
                      <option>Bike</option>
                      <option>SUV</option>
                    </select>
                    <input value={newVehicle} onChange={e => setNewVehicle(e.target.value)} placeholder="TN 01 AB 1234"
                      className={`${inputCls} flex-1`} />
                    <button onClick={addVehicle} disabled={!newVehicle.trim()}
                      className="px-4 py-3 bg-neon-blue text-white rounded-xl font-bold text-sm hover:bg-blue-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap">
                      Add
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}