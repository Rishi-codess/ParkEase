import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { FaSearch, FaClock, FaCar, FaUser, FaTimesCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function OwnerBookings() {
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const bookings = [
    {
      id: "BK-2024-001",
      user: "Rishi",
      vehicle: "MP09 AB 1234",
      parking: "City Mall Parking",
      slot: "A-14",
      startTime: "2:30 PM",
      endTime: "5:30 PM",
      date: "Feb 14, 2026",
      amount: "$15.00",
      status: "ACTIVE",
      type: "Car"
    },
    {
      id: "BK-2024-002",
      user: "Amit",
      vehicle: "MH12 CD 5678",
      parking: "City Mall Parking",
      slot: "B-22",
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      date: "Feb 14, 2026",
      amount: "$10.00",
      status: "COMPLETED",
      type: "Bike"
    },
    {
      id: "BK-2024-003",
      user: "Neha",
      vehicle: "KA01 EF 9012",
      parking: "Hospital Parking",
      slot: "H-05",
      startTime: "09:00 AM",
      endTime: "06:00 PM",
      date: "Feb 13, 2026",
      amount: "$45.00",
      status: "COMPLETED",
      type: "Car"
    },
    {
      id: "BK-2024-004",
      user: "Suresh",
      vehicle: "DL04 GH 3456",
      parking: "City Mall Parking",
      slot: "A-01",
      startTime: "1:00 PM",
      endTime: "2:00 PM",
      date: "Feb 12, 2026",
      amount: "$5.00",
      status: "CANCELLED",
      type: "Car"
    },
  ];

  const filteredBookings = bookings.filter(b => {
    const matchesFilter = filter === "ALL" || b.status === filter;
    const matchesSearch = b.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED": return "bg-neon-green/10 text-neon-green border-neon-green/20";
      case "ACTIVE": return "bg-neon-blue/10 text-neon-blue border-neon-blue/20 animate-pulse";
      case "CANCELLED": return "bg-neon-red/10 text-neon-red border-neon-red/20";
      default: return "bg-gray-500/10 text-gray-400";
    }
  };

  return (
    <DashboardLayout role="OWNER">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Booking Management</h2>
          <p className="text-gray-400">Track and manage all customer reservations</p>
        </div>

        <div className="flex gap-3">
          {/* SEARCH */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by User, ID or Vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-dark-card border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-neon-purple w-64"
            />
          </div>

          {/* FILTER BUTTONS */}
          <div className="bg-dark-card border border-white/10 rounded-lg p-1 flex">
            {["ALL", "ACTIVE", "COMPLETED", "CANCELLED"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filter === f
                  ? "bg-neon-purple text-white shadow-neon-purple"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BOOKING CARDS LIST */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredBookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors"
            >
              {/* Status Indicator Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${booking.status === 'ACTIVE' ? 'bg-neon-blue' :
                booking.status === 'COMPLETED' ? 'bg-neon-green' : 'bg-neon-red'
                }`}></div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-6 pl-4">

                {/* LEFT: User & Vehicle */}
                <div className="flex items-center gap-4 w-full md:w-1/3">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl text-gray-400 border border-white/5">
                    <FaUser />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      {booking.user}
                      <span className="text-xs font-mono text-gray-500 bg-black/30 px-2 py-0.5 rounded border border-white/5">{booking.id}</span>
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                      <span className="flex items-center gap-1"><FaCar className="text-neon-purple" /> {booking.vehicle}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                      <span className="text-gray-500">{booking.type}</span>
                    </div>
                  </div>
                </div>

                {/* MIDDLE: Time & Location */}
                <div className="w-full md:w-1/3 border-l border-white/5 pl-6">
                  <p className="text-white font-bold flex items-center gap-2">
                    <FaClock className="text-neon-blue" />
                    {booking.startTime} - {booking.endTime}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">{booking.date}</p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{booking.parking} • Slot {booking.slot}</p>
                </div>

                {/* RIGHT: Status & Actions */}
                <div className="w-full md:w-1/3 flex items-center justify-between md:justify-end gap-6 border-l border-white/5 pl-6">
                  <div className="text-right">
                    <p className="text-xl font-bold text-neon-green">{booking.amount}</p>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(booking.status)} uppercase tracking-wider`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {booking.status === "ACTIVE" && (
                      <button className="p-2 rounded-lg bg-neon-red/10 text-neon-red hover:bg-neon-red hover:text-white border border-neon-red/20 transition-all" title="End Booking">
                        <FaTimesCircle />
                      </button>
                    )}
                    <button className="p-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10 transition-all" title="View Details">
                      <FaSearch />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredBookings.length === 0 && (
          <div className="text-center py-20 bg-dark-card/30 rounded-xl border border-white/5 border-dashed">
            <p className="text-gray-500 text-lg">No bookings found matching your filters.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
