import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { FaCalendarAlt, FaCheckCircle, FaClock, FaMapMarkerAlt, FaCar } from "react-icons/fa";
import { motion } from "framer-motion";

export default function BookingHistory() {
  const [activeTab, setActiveTab] = useState("ALL");

  const bookings = [
    {
      id: 1,
      parking: "City Mall Parking",
      slot: "A-14",
      date: "Feb 14, 2026",
      duration: "3 hrs",
      amount: "$15.00",
      status: "COMPLETED",
      location: "Downtown, Block 4"
    },
    {
      id: 2,
      parking: "Hospital Parking",
      slot: "B-05",
      date: "Feb 12, 2026",
      duration: "1.5 hrs",
      amount: "$8.50",
      status: "COMPLETED",
      location: "Medical Center, Gate 2"
    },
    {
      id: 3,
      parking: "Airport Terminal 1",
      slot: "T1-45",
      date: "Feb 10, 2026",
      duration: "5 days",
      amount: "$120.00",
      status: "CANCELLED",
      location: "Airport Rd, Terminal 1"
    },
    {
      id: 4,
      parking: "Railway Station",
      slot: "C-22",
      date: "Feb 15, 2026", // Today
      duration: "Ongoing",
      amount: "Running",
      status: "ACTIVE",
      location: "Station Square"
    },
  ];

  const filteredBookings = activeTab === "ALL"
    ? bookings
    : bookings.filter(b => b.status === activeTab);

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED": return "bg-neon-green/20 text-neon-green border-neon-green/30";
      case "ACTIVE": return "bg-neon-blue/20 text-neon-blue border-neon-blue/30 animate-pulse";
      case "CANCELLED": return "bg-neon-red/20 text-neon-red border-neon-red/30";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <DashboardLayout role="USER">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Booking History</h2>
          <p className="text-gray-400">Track your past and current parking sessions</p>
        </div>

        {/* MOCK TABS */}
        <div className="bg-dark-card/60 backdrop-blur-xl border border-white/10 rounded-lg p-1 flex">
          {["ALL", "ACTIVE", "COMPLETED", "CANCELLED"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === tab
                  ? "bg-neon-blue text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-dark-card/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">Parking Location</th>
                <th className="py-4 px-6 font-semibold">Slot Info</th>
                <th className="py-4 px-6 font-semibold">Date & Time</th>
                <th className="py-4 px-6 font-semibold">Amount</th>
                <th className="py-4 px-6 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBookings.map((b) => (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={b.id}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-neon-blue group-hover:bg-neon-blue/10 transition-colors">
                        <FaCar />
                      </div>
                      <div>
                        <p className="font-bold text-white">{b.parking}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <FaMapMarkerAlt /> {b.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-neon-purple font-bold bg-neon-purple/10 px-2 py-1 rounded border border-neon-purple/20">
                      {b.slot}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <p className="text-white font-medium flex items-center gap-2"><FaCalendarAlt className="text-gray-500" /> {b.date}</p>
                      <p className="text-gray-500 text-xs flex items-center gap-2 mt-1"><FaClock className="text-gray-500" /> {b.duration}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold text-white">
                    {b.amount}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(b.status)} inline-flex items-center gap-1`}>
                      {b.status === "COMPLETED" && <FaCheckCircle />}
                      {b.status}
                    </span>
                  </td>
                </motion.tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500">
                    No bookings found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
