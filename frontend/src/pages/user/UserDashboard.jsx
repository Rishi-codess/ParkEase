import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { FaMapMarkerAlt, FaCar, FaHeart, FaRegHeart, FaClock, FaHistory } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([1]);

  // User Profile State
  const [profile, setProfile] = useState({
    name: "Rishi",
    email: "rishi@example.com",
    phone: "+91 9876543210",
    role: "USER"
  });

  const handleSaveProfile = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  const parkings = [
    { id: 1, name: "City Mall Parking", distance: "0.5 km", slots: 5, predictedFree: 8, trend: "up" },
    { id: 2, name: "Hospital Parking", distance: "1.2 km", slots: 2, predictedFree: 0, trend: "down" },
    { id: 3, name: "Railway Parking", distance: "2 km", slots: 8, predictedFree: 5, trend: "stable" },
    { id: 4, name: "Airport Terminal 1", distance: "5 km", slots: 15, predictedFree: 12, trend: "up" },
    { id: 5, name: "Downtown Plaza", distance: "1.8 km", slots: 0, predictedFree: 2, trend: "up" },
  ];

  const filtered = parkings.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
      toast.info("Removed from favorites");
    } else {
      setFavorites([...favorites, id]);
      toast.success("Added to favorites");
    }
  };

  return (
    <DashboardLayout
      role="USER"
      onSearch={setSearch}
      searchTerm={search}
      userInfo={profile}
      onSaveProfile={handleSaveProfile}
    >
      <ToastContainer theme="dark" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: Listings */}
        <div className="lg:col-span-2 space-y-6">



          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-3xl font-bold text-white">Find Parking</h2>
              <p className="text-gray-400">Nearest spots available for you</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ y: -5 }}
                className={`group relative bg-dark-card/60 backdrop-blur-xl rounded-xl p-6 border transition-all ${p.slots > 0 ? "border-white/5 hover:border-neon-blue/30" : "border-neon-red/30 opacity-80"}`}
              >
                {/* FAVORITE BUTTON */}
                <button
                  onClick={(e) => toggleFavorite(p.id, e)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-neon-red transition-colors z-10"
                >
                  {favorites.includes(p.id) ? <FaHeart className="text-neon-red text-xl" /> : <FaRegHeart className="text-xl" />}
                </button>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">{p.name}</h3>
                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                      <FaMapMarkerAlt className="text-neon-blue" /> {p.distance}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-xs font-bold ${p.slots > 0 ? "bg-neon-green/20 text-neon-green" : "bg-neon-red/20 text-neon-red"}`}>
                    {p.slots > 0 ? `${p.slots} Slots` : "FULL"}
                  </div>
                </div>

                {/* PREDICTIVE INSIGHT */}
                <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    <span className="text-neon-purple">🔮 AI Prediction:</span>
                    {p.predictedFree > 0 ? (
                      <span>Expect <span className="text-white font-bold">~{p.predictedFree} spots</span> free in 30 mins</span>
                    ) : (
                      <span>High occupancy expected soon</span>
                    )}
                  </p>
                </div>

                <button
                  disabled={p.slots === 0}
                  onClick={() => navigate("/user/slots")}
                  className={`mt-4 w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${p.slots > 0
                    ? "bg-neon-blue hover:bg-neon-purple text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  <FaCar /> {p.slots > 0 ? "Book Now" : "Unavailable"}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Map & Active Reservation */}
        <div className="space-y-8">

          {/* PEAK TRAFFIC WIDGET */}
          <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-500/20 rounded-lg text-orange-400">
                <FaClock className="text-xl" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Peak Traffic</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  High demand expected <span className="text-orange-400 font-bold">5-7 PM</span>.
                  <br />
                  Plan ahead for City Mall.
                </p>
              </div>
            </div>
          </div>

          {/* MINI MAP WIDGET */}
          <div className="bg-dark-card/60 backdrop-blur-xl border border-white/10 rounded-2xl h-64 relative overflow-hidden group">

            {/* Tech Map Background */}
            <div className="absolute inset-0 bg-[#0f172a]">
              {/* Grid Pattern */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

              {/* Abstract Streets */}
              <div className="absolute top-1/2 left-0 w-full h-12 bg-gray-800/40 -translate-y-1/2 border-y border-white/5 transform -skew-y-3"></div>
              <div className="absolute top-0 left-1/3 w-16 h-full bg-gray-800/40 -translate-x-1/2 border-x border-white/5 transform skew-x-12"></div>

              {/* Radar/Pulse Effect */}
              <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-neon-blue/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent pointer-events-none"></div>

            <div className="relative z-10 h-full flex flex-col justify-end p-6">
              <h4 className="text-xl font-bold text-white mb-1">Nearby Parking</h4>
              <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
                Live Updates Active
              </p>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-md border border-white/10 transition-all text-sm font-bold flex items-center justify-center gap-2 group/btn">
                <FaMapMarkerAlt className="group-hover/btn:text-neon-blue transition-colors" /> Open Map View
              </button>
            </div>

            {/* Live Markers */}
            <div className="absolute top-[40%] left-[35%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group/marker">
              <div className="relative">
                <div className="w-4 h-4 bg-neon-green rounded-full shadow-[0_0_15px_#22c55e] z-10 relative border-2 border-white"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-neon-green rounded-full animate-ping opacity-75"></div>
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-dark-card px-2 py-1 rounded text-[10px] font-bold text-white border border-white/10 whitespace-nowrap shadow-xl opacity-0 scale-90 group-hover/marker:opacity-100 group-hover/marker:scale-100 transition-all">
                City Mall (5)
              </div>
            </div>

            <div className="absolute top-[30%] right-[30%] cursor-pointer group/marker">
              <div className="relative">
                <div className="w-3 h-3 bg-neon-red rounded-full shadow-[0_0_15px_#ef4444] z-10 relative border-2 border-dark-card"></div>
              </div>
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-dark-card px-2 py-1 rounded text-[10px] text-gray-400 border border-white/10 whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity">
                Town Square (Full)
              </div>
            </div>

            <div className="absolute bottom-[40%] right-[20%] cursor-pointer group/marker">
              <div className="relative">
                <div className="w-3 h-3 bg-orange-400 rounded-full shadow-[0_0_10px_orange] z-10 relative border-2 border-dark-card"></div>
              </div>
            </div>
          </div>

          {/* ACTIVE RESERVATION */}
          <div className="bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 border border-white/10 rounded-2xl p-6 h-fit sticky top-24">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
              Active Reservation
            </h4>
            <div className="bg-dark-bg/60 rounded-xl p-4 border border-white/5">
              <p className="text-gray-400 text-xs mb-1">City Mall Parking</p>
              <p className="text-xl font-bold text-white">Slot #A-14</p>
              <div className="mt-3 flex justify-between items-center text-sm">
                <span className="text-neon-blue">02:30 PM</span>
                <span className="text-gray-500">to</span>
                <span className="text-neon-blue">05:30 PM</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <h5 className="text-white font-bold mb-3">Quick Actions</h5>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => navigate("/user/bookings")} className="p-3 bg-dark-card rounded-lg border border-white/5 hover:border-neon-purple transition-all text-xs text-gray-300 flex flex-col items-center gap-2">
                  <FaHistory className="text-lg mb-1 text-neon-blue" />
                  History
                </button>
                <button className="p-3 bg-dark-card rounded-lg border border-white/5 hover:border-neon-purple transition-all text-xs text-gray-300 flex flex-col items-center gap-2">
                  <FaCar className="text-lg mb-1 text-neon-green" />
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}