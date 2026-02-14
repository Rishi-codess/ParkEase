import DashboardLayout from "../../components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { FaBuilding, FaPlus, FaCar, FaMoneyBillWave, FaClock, FaEdit, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";
import StatCard from "../../components/dashboard/StatCard";
import RevenueChart from "../../components/dashboard/RevenueChart";

function OwnerDashboard() {
  const navigate = useNavigate();

  const parkings = [
    {
      id: 1,
      name: "City Mall Parking",
      location: "City Center, Block A",
      totalSlots: 10,
      occupied: 8,
      revenue: "$450",
      occupancyRate: 80,
      peakHours: "4 PM - 7 PM"
    },
    {
      id: 2,
      name: "Hospital Parking",
      location: "Medical District",
      totalSlots: 6,
      occupied: 2,
      revenue: "$120",
      occupancyRate: 33,
      peakHours: "9 AM - 11 AM"
    },
  ];

  return (
    <DashboardLayout role="OWNER">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Owner Dashboard</h2>
          <p className="text-gray-400">Manage your parking lots and earnings</p>
        </div>
        <button
          className="px-6 py-3 bg-neon-green hover:bg-green-400 text-black font-bold rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all flex items-center gap-2"
        >
          <FaPlus /> Add Parking
        </button>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Parkings" value="2" icon={<FaBuilding />} color="blue" trend={0} />
        <StatCard title="Total Slots" value="16" icon={<FaCar />} color="purple" trend={12} />
        <StatCard title="Today's Revenue" value="$570" icon={<FaMoneyBillWave />} color="green" trend={24} />
        <StatCard title="Active Bookings" value="10" icon={<FaClock />} color="red" />
      </div>

      {/* REVENUE GRAPH SECTION */}
      <div className="mb-10">
        <RevenueChart />
      </div>

      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 rounded-full bg-neon-blue"></span>
        My Parking Locations
      </h3>

      {/* ENHANCED PARKING CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {parkings.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ y: -5 }}
            className="bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 group relative overflow-hidden flex flex-col justify-between"
          >
            {/* Background Glow */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-neon-purple/10 rounded-full blur-[40px] group-hover:bg-neon-purple/20 transition-all"></div>

            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-white relative z-10">{p.name}</h4>
                  <p className="text-gray-400 text-sm flex items-center gap-1 mt-1"><FaBuilding className="text-neon-blue" /> {p.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Revenue Today</p>
                  <p className="text-xl font-bold text-neon-green">{p.revenue}</p>
                </div>
              </div>

              {/* VISUAL OCCUPANCY BAR */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Occupancy</span>
                  <span className={`font-bold ${p.occupancyRate > 75 ? "text-neon-red" : "text-neon-blue"}`}>{p.occupancyRate}%</span>
                </div>
                <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full ${p.occupancyRate > 75 ? "bg-neon-red shadow-[0_0_10px_#ef4444]" : "bg-neon-blue shadow-[0_0_10px_#3b82f6]"}`}
                    style={{ width: `${p.occupancyRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-neon-purple font-bold text-lg">{p.totalSlots}</p>
                  <p className="text-[10px] text-gray-400 uppercase">Total Slots</p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-white font-bold text-lg">{p.occupied}</p>
                  <p className="text-[10px] text-gray-400 uppercase">Active</p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-orange-400 font-bold text-sm mt-1">{p.peakHours}</p>
                  <p className="text-[10px] text-gray-400 uppercase mt-0.5">Peak Time</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto">
              <button
                onClick={() => navigate("/owner/slots")}
                className="py-2.5 rounded-lg bg-white/5 hover:bg-neon-blue/20 text-white border border-white/10 hover:border-neon-blue/50 transition-all font-bold flex items-center justify-center gap-2 text-sm"
              >
                <FaEdit /> Manage Slots
              </button>
              <button
                onClick={() => navigate("/owner/bookings")}
                className="py-2.5 rounded-lg bg-neon-purple/20 hover:bg-neon-purple/40 text-neon-purple border border-neon-purple/30 hover:border-neon-purple/50 transition-all font-bold flex items-center justify-center gap-2 text-sm"
              >
                <FaEye /> View Bookings
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default OwnerDashboard;
