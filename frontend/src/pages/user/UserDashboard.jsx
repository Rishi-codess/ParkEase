import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { FaMapMarkerAlt, FaCar, FaHeart, FaRegHeart, FaClock, FaHistory, FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { parkingsAPI, dashboardAPI, getUserName } from "../../api/api";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [search, setSearch]       = useState("");
  const [favorites, setFavorites] = useState([]);
  const [parkings, setParkings]   = useState([]);
  const [stats, setStats]         = useState(null);
  const [loading, setLoading]     = useState(true);

  const name = getUserName() || "User";
  const profile = { name, role: "USER" };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [parkData, statsData] = await Promise.all([
          parkingsAPI.getAll(),
          dashboardAPI.getStats(),
        ]);
        setParkings(parkData || []);
        setStats(statsData);
      } catch (err) {
        toast.error("Failed to load parking data: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = parkings.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
      toast.info("Removed from favorites");
    } else {
      setFavorites([...favorites, id]);
      toast.success("Added to favorites");
    }
  };

  return (
    <>
      <ToastContainer theme="dark" position="top-right" autoClose={3000} style={{ zIndex: 9999, top: "5rem", right: "1rem" }} />
      <DashboardLayout role="USER" onSearch={setSearch} searchTerm={search} userInfo={profile}>

        {/* Active Booking Banner */}
        {stats?.activeBooking && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate("/user/active-parking")}
            className="mb-6 flex items-center justify-between gap-4 p-4 bg-neon-green/10 border border-neon-green/30 rounded-2xl cursor-pointer hover:bg-neon-green/15 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse" />
              <div>
                <p className="text-neon-green font-black text-sm">Active Parking Session</p>
                <p className="text-gray-400 text-xs">
                  {stats.activeBooking.parkingName} · Slot {stats.activeBooking.slotCode} · {stats.activeBooking.vehicleNumber}
                </p>
              </div>
            </div>
            <span className="px-4 py-2 bg-neon-green text-black rounded-xl font-bold text-sm hover:bg-green-400 transition-all whitespace-nowrap">
              View Session →
            </span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: Listings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-3xl font-bold text-white">Find Parking</h2>
                <p className="text-gray-400">Nearest spots available for you</p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <FaSpinner className="text-neon-blue text-4xl animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 bg-dark-card/30 rounded-2xl border border-white/5 border-dashed">
                <p className="text-gray-500 text-lg">No parking lots found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((p) => (
                  <motion.div
                    key={p.id}
                    whileHover={{ y: -5 }}
                    className={`group relative bg-dark-card/60 backdrop-blur-xl rounded-xl p-6 border transition-all ${
                      p.availableSlots > 0 ? "border-white/5 hover:border-neon-blue/30" : "border-neon-red/30 opacity-80"
                    }`}
                  >
                    {/* Favorite */}
                    <button
                      onClick={(e) => toggleFavorite(p.id, e)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-neon-red transition-colors z-10"
                    >
                      {favorites.includes(p.id) ? <FaHeart className="text-neon-red text-xl" /> : <FaRegHeart className="text-xl" />}
                    </button>

                    <div className="flex justify-between items-start">
                      <div className="pr-8">
                        <h3 className="text-lg font-bold text-white">{p.name}</h3>
                        <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                          <FaMapMarkerAlt className="text-neon-blue" /> {p.location}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                        p.availableSlots > 0 ? "bg-neon-green/20 text-neon-green" : "bg-neon-red/20 text-neon-red"
                      }`}>
                        {p.availableSlots > 0 ? `${p.availableSlots} Free` : "FULL"}
                      </div>
                    </div>

                    {/* Slot summary */}
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                        <p className="text-neon-green font-bold text-sm">{p.availableSlots}</p>
                        <p className="text-[10px] text-gray-500 uppercase">Free</p>
                      </div>
                      <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                        <p className="text-neon-red font-bold text-sm">{p.occupiedSlots}</p>
                        <p className="text-[10px] text-gray-500 uppercase">Occupied</p>
                      </div>
                      <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                        <p className="text-neon-purple font-bold text-sm">{p.totalSlots}</p>
                        <p className="text-[10px] text-gray-500 uppercase">Total</p>
                      </div>
                    </div>

                    {/* Price & vehicles */}
                    <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        <span className="text-neon-purple">₹{p.minCostPerHour}</span>
                        {p.minCostPerHour !== p.maxCostPerHour && <span className="text-gray-600"> – ₹{p.maxCostPerHour}</span>}
                        <span className="text-gray-500">/hr</span>
                      </p>
                      <div className="flex gap-1">
                        {(p.vehicleTypes || []).map(vt => (
                          <span key={vt} className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-gray-400 border border-white/5">{vt}</span>
                        ))}
                      </div>
                    </div>

                    {p.description && (
                      <p className="mt-2 text-xs text-gray-500 italic line-clamp-1">{p.description}</p>
                    )}

                    <button
                      disabled={p.availableSlots === 0}
                      onClick={() => navigate(`/user/slots/${p.id}`)}
                      className={`mt-4 w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                        p.availableSlots > 0
                          ? "bg-neon-blue hover:bg-neon-purple text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <FaCar /> {p.availableSlots > 0 ? "Book Now" : "Unavailable"}
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Stats & Map */}
          <div className="space-y-6">

            {/* Stats */}
            {stats && (
              <div className="bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                <h4 className="text-white font-bold mb-4">My Stats</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Total Bookings", value: stats.totalBookings,     color: "text-neon-blue" },
                    { label: "Active",         value: stats.activeBookings,    color: "text-neon-green" },
                    { label: "Completed",      value: stats.completedBookings, color: "text-neon-purple" },
                    { label: "Total Spent",    value: `₹${stats.totalAmountSpent?.toFixed(0)}`, color: "text-yellow-400" },
                  ].map(s => (
                    <div key={s.label} className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                      <p className={`font-black text-lg ${s.color}`}>{s.value}</p>
                      <p className="text-gray-500 text-[10px] uppercase">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Peak Traffic */}
            <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-500/20 rounded-lg text-orange-400">
                  <FaClock className="text-xl" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Peak Traffic</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    High demand expected <span className="text-orange-400 font-bold">5–7 PM</span>.<br />Book in advance!
                  </p>
                </div>
              </div>
            </div>

            {/* Mini Map Widget */}
            <div className="bg-dark-card/60 backdrop-blur-xl border border-white/10 rounded-2xl h-64 relative overflow-hidden">
              <div className="absolute inset-0 bg-[#0f172a]">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                <div className="absolute top-1/2 left-0 w-full h-12 bg-gray-800/40 -translate-y-1/2 border-y border-white/5 transform -skew-y-3" />
                <div className="absolute top-0 left-1/3 w-16 h-full bg-gray-800/40 -translate-x-1/2 border-x border-white/5 transform skew-x-12" />
                <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-neon-blue/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10 h-full flex flex-col justify-end p-6">
                <h4 className="text-xl font-bold text-white mb-1">Nearby Parking</h4>
                <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" /> Live Updates Active
                </p>
                <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-md border border-white/10 transition-all text-sm font-bold flex items-center justify-center gap-2">
                  <FaMapMarkerAlt /> Open Map View
                </button>
              </div>
              <div className="absolute top-[40%] left-[35%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group/marker">
                <div className="relative">
                  <div className="w-4 h-4 bg-neon-green rounded-full shadow-[0_0_15px_#22c55e] z-10 relative border-2 border-white" />
                  <div className="absolute top-0 left-0 w-full h-full bg-neon-green rounded-full animate-ping opacity-75" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 border border-white/10 rounded-2xl p-6">
              <h4 className="text-white font-bold mb-4">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => navigate("/user/bookings")} className="p-3 bg-dark-card/60 rounded-lg border border-white/5 hover:border-neon-purple transition-all text-xs text-gray-300 flex flex-col items-center gap-2">
                  <FaHistory className="text-lg text-neon-blue" /> History
                </button>
                <button onClick={() => navigate("/user/active-parking")} className="p-3 bg-dark-card/60 rounded-lg border border-white/5 hover:border-neon-green transition-all text-xs text-gray-300 flex flex-col items-center gap-2">
                  <FaCar className="text-lg text-neon-green" /> Active
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}