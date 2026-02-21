import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import ParkingGrid from "../../components/dashboard/ParkingGrid";
import OccupancyChart from "../../components/dashboard/OccupancyChart";
import { FaUsers, FaExclamationTriangle, FaCar, FaMoneyBillWave } from "react-icons/fa";

function AdminDashboard() {
  const [users, setUsers] = useState([
    { id: 1, name: "Rishi", role: "USER", status: "ACTIVE" },
    { id: 2, name: "Amit", role: "OWNER", status: "ACTIVE" },
    { id: 3, name: "Neha", role: "USER", status: "BLOCKED" },
    { id: 4, name: "Suresh", role: "USER", status: "ACTIVE" },
    { id: 5, name: "Priya", role: "OWNER", status: "ACTIVE" },
  ]);

  const ghostSlots = [
    { id: 1, parking: "City Mall", slot: 4 },
    { id: 2, parking: "Hospital", slot: 2 },
  ];

  // Mock Data for Grid and Chart
  const slots = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    occupied: Math.random() > 0.6 // Random occupancy
  }));
  const occupiedCount = slots.filter(s => s.occupied).length;

  const toggleStatus = (id) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "ACTIVE" ? "BLOCKED" : "ACTIVE" }
          : u
      )
    );
  };

  return (
    <DashboardLayout
      role="ADMIN"
      userInfo={{ name: "Administrator", role: "ADMIN" }}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h2>
        <p className="text-gray-400">Welcome back, Administrator</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={users.length} icon={<FaUsers />} color="blue" trend={12} />
        <StatCard title="Ghost Slots" value={ghostSlots.length} icon={<FaExclamationTriangle />} color="red" trend={-5} />
        <StatCard title="Occupancy" value={`${Math.round((occupiedCount / 20) * 100)}%`} icon={<FaCar />} color="purple" trend={8} />
        <StatCard title="Revenue" value="$1,240" icon={<FaMoneyBillWave />} color="green" trend={24} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* PARKING GRID (Span 2 cols) */}
        <div className="lg:col-span-2">
          <ParkingGrid slots={slots} />
        </div>

        {/* OCCUPANCY CHART (Span 1 col) */}
        <div className="lg:col-span-1 h-full">
          <OccupancyChart occupied={occupiedCount} total={20} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* USER MANAGEMENT */}
        <div className="bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">User Management</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 border-b border-white/10">
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">Role</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 text-white font-medium">{u.name}</td>
                    <td className="py-3 px-2 text-gray-400 text-sm">{u.role}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${u.status === "ACTIVE" ? "bg-neon-green/20 text-neon-green" : "bg-neon-red/20 text-neon-red"}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${u.status === "ACTIVE" ? "bg-neon-red/20 text-neon-red hover:bg-neon-red hover:text-white" : "bg-neon-green/20 text-neon-green hover:bg-neon-green hover:text-white"}`}
                      >
                        {u.status === "ACTIVE" ? "Block" : "Unblock"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* GHOST SLOT MONITOR */}
        <div className="bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 h-fit">
          <h3 className="text-xl font-bold text-white mb-4">Ghost Slot Monitor</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 border-b border-white/10">
                  <th className="py-3 px-2">Parking</th>
                  <th className="py-3 px-2">Slot</th>
                  <th className="py-3 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {ghostSlots.map((g) => (
                  <tr key={g.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 text-white">{g.parking}</td>
                    <td className="py-3 px-2 text-neon-purple font-mono font-bold">#{g.slot}</td>
                    <td className="py-3 px-2 text-right text-neon-red font-bold animate-pulse">
                      Ghost Signal
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
