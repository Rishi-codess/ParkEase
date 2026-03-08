import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import { FaUsers, FaParking, FaExclamationTriangle, FaMoneyBillWave, FaCar, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";

const TOTAL_SLOTS = 60;

const weeklyData = [
  { day: "Mon", usage: 40, revenue: 220 },
  { day: "Tue", usage: 55, revenue: 302 },
  { day: "Wed", usage: 60, revenue: 330 },
  { day: "Thu", usage: 75, revenue: 412 },
  { day: "Fri", usage: 85, revenue: 467 },
  { day: "Sat", usage: 90, revenue: 495 },
  { day: "Sun", usage: 50, revenue: 275 },
];

const recentActivity = [
  { id: 1, action: "Vehicle Entered", slot: "A-23", time: "2 min ago",  color: "text-neon-green" },
  { id: 2, action: "Vehicle Exited",  slot: "B-15", time: "5 min ago",  color: "text-neon-blue"  },
  { id: 3, action: "Payment Received",slot: "C-08", time: "8 min ago",  color: "text-neon-purple"},
  { id: 4, action: "Vehicle Entered", slot: "D-42", time: "12 min ago", color: "text-neon-green" },
  { id: 5, action: "Ghost Detected",  slot: "A-04", time: "18 min ago", color: "text-neon-red"   },
];

const PIE_COLORS = ["#ef4444", "#22c55e"];

const TOOLTIP_STYLE = {
  contentStyle: { backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 },
  labelStyle: { color: "#94a3b8" },
  itemStyle: { color: "#fff" },
};

export default function AdminDashboard() {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const init = Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
      id: i + 1,
      occupied: Math.random() > 0.5,
    }));
    setSlots(init);

    const id = setInterval(() => {
      setSlots(prev =>
        prev.map(s => Math.random() > 0.88 ? { ...s, occupied: !s.occupied } : s)
      );
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const occupied  = slots.filter(s => s.occupied).length;
  const available = TOTAL_SLOTS - occupied;
  const occupancy = TOTAL_SLOTS ? ((occupied / TOTAL_SLOTS) * 100).toFixed(1) : 0;
  const revenue   = (occupied * 5.5).toFixed(2);

  const pieData = [
    { name: "Occupied",  value: occupied  },
    { name: "Available", value: available },
  ];

  return (
    <DashboardLayout role="ADMIN" userInfo={{ name: "Administrator", role: "ADMIN" }}>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h2>
        <p className="text-gray-400">Real-time monitoring and analytics</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Slots"    value={TOTAL_SLOTS}    icon={<FaParking />}           color="blue"   trend={0}  />
        <StatCard title="Occupied"       value={occupied}       icon={<FaCar />}               color="red"    trend={12} />
        <StatCard title="Available"      value={available}      icon={<FaCheckCircle />}       color="green"  trend={-8} />
        <StatCard title="Revenue Today"  value={`$${revenue}`}  icon={<FaMoneyBillWave />}     color="purple" trend={15} />
      </div>

      {/* LIVE PARKING GRID + OCCUPANCY PIE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Live Grid */}
        <div className="lg:col-span-2 bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-6 rounded-full bg-neon-blue inline-block"></span>
              Live Parking Status
            </h3>
            <div className="flex gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-neon-green inline-block"></span>Available</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-neon-red inline-block"></span>Occupied</span>
            </div>
          </div>
          <div className="grid grid-cols-10 gap-1.5">
            {slots.map(slot => (
              <motion.div
                key={slot.id}
                animate={{ opacity: 1 }}
                className={`
                  aspect-square rounded-md flex items-center justify-center text-[9px] font-bold
                  transition-colors duration-500 cursor-default
                  ${slot.occupied
                    ? "bg-neon-red/20 border border-neon-red/40 text-neon-red"
                    : "bg-neon-green/15 border border-neon-green/30 text-neon-green"
                  }
                `}
                title={`Slot ${slot.id} — ${slot.occupied ? "Occupied" : "Available"}`}
              >
                {slot.id}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Occupancy Pie */}
        <div className="bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-6 rounded-full bg-neon-purple inline-block"></span>
            Occupancy
          </h3>
          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-white">{occupancy}%</span>
                <span className="text-xs text-gray-400">occupied</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="bg-neon-red/10 border border-neon-red/20 rounded-xl p-3 text-center">
              <p className="text-neon-red font-black text-xl">{occupied}</p>
              <p className="text-gray-500 text-xs">Occupied</p>
            </div>
            <div className="bg-neon-green/10 border border-neon-green/20 rounded-xl p-3 text-center">
              <p className="text-neon-green font-black text-xl">{available}</p>
              <p className="text-gray-500 text-xs">Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS + ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Bar Chart */}
        <div className="bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Weekly Usage</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#475569" tick={{ fontSize: 11 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="usage" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#475569" tick={{ fontSize: 11 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2.5}
                dot={{ fill: "#22c55e", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                <div className={`w-2 h-2 rounded-full ${a.color.replace("text-", "bg-")} shrink-0`}></div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${a.color}`}>{a.action}</p>
                  <p className="text-gray-500 text-xs">Slot {a.slot}</p>
                </div>
                <span className="text-gray-600 text-xs shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK LINKS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Manage Users",    href: "/admin/users",    color: "from-neon-blue/20 to-neon-blue/5",    border: "border-neon-blue/20",    icon: <FaUsers className="text-neon-blue text-2xl" />            },
          { label: "Manage Parkings", href: "/admin/parkings", color: "from-neon-purple/20 to-neon-purple/5", border: "border-neon-purple/20",  icon: <FaParking className="text-neon-purple text-2xl" />        },
          { label: "All Bookings",    href: "/admin/bookings", color: "from-neon-green/20 to-neon-green/5",   border: "border-neon-green/20",   icon: <FaCheckCircle className="text-neon-green text-2xl" />     },
          { label: "Ghost Slots",     href: "/admin/ghost",    color: "from-neon-red/20 to-neon-red/5",       border: "border-neon-red/20",     icon: <FaExclamationTriangle className="text-neon-red text-2xl animate-pulse" /> },
        ].map(item => (
          <motion.a
            key={item.label}
            href={item.href}
            whileHover={{ y: -4 }}
            className={`bg-gradient-to-br ${item.color} border ${item.border} rounded-2xl p-5 flex flex-col items-center gap-3 text-center cursor-pointer transition-all hover:shadow-lg`}
          >
            {item.icon}
            <span className="text-white font-bold text-sm">{item.label}</span>
          </motion.a>
        ))}
      </div>

    </DashboardLayout>
  );
}