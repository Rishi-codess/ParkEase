import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { FaUsers, FaSearch, FaTrash, FaTimes, FaUserShield, FaUserAlt, FaStore } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [users, setUsers] = useState([
    { id: 1, name: "Rishi Kumar",  email: "rishi@email.com",  phone: "9876543210", role: "USER",  status: "ACTIVE",  joined: "Jan 12, 2026", bookings: 8, spent: "$124" },
    { id: 2, name: "Amit Shah",    email: "amit@email.com",   phone: "9123456789", role: "OWNER", status: "ACTIVE",  joined: "Dec 5, 2025",  bookings: 0, spent: "$0",  parkings: 2 },
    { id: 3, name: "Neha Singh",   email: "neha@email.com",   phone: "9988776655", role: "USER",  status: "BLOCKED", joined: "Nov 20, 2025", bookings: 3, spent: "$45" },
    { id: 4, name: "Suresh Patel", email: "suresh@email.com", phone: "9112233445", role: "USER",  status: "ACTIVE",  joined: "Feb 1, 2026",  bookings: 1, spent: "$12" },
    { id: 5, name: "Priya Menon",  email: "priya@email.com",  phone: "9654321876", role: "OWNER", status: "ACTIVE",  joined: "Oct 15, 2025", bookings: 0, spent: "$0",  parkings: 1 },
    { id: 6, name: "Karan Dev",    email: "karan@email.com",  phone: "9009988776", role: "USER",  status: "ACTIVE",  joined: "Feb 10, 2026", bookings: 5, spent: "$67" },
  ]);

  // Derive these from users array so drawer always reads latest state — no stale closures
  const selectedUser      = users.find(u => u.id === selectedUserId) || null;
  const deleteConfirmUser = users.find(u => u.id === deleteConfirmId) || null;

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === "ACTIVE" ? "BLOCKED" : "ACTIVE" } : u
    ));
  };

  const changeRole = (id, newRole) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    setDeleteConfirmId(null);
    setSelectedUserId(null); // also close the detail drawer
  };

  const filtered = users.filter(u => {
    const matchSearch   = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole     = filterRole === "ALL"   || u.role   === filterRole;
    const matchStatus   = filterStatus === "ALL" || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const getRoleIcon = (role) => {
    if (role === "ADMIN") return <FaUserShield className="text-neon-purple" />;
    if (role === "OWNER") return <FaStore      className="text-neon-blue"   />;
    return <FaUserAlt className="text-gray-400" />;
  };

  return (
    <DashboardLayout role="ADMIN" userInfo={{ name: "Administrator", role: "ADMIN" }}>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">User Management</h2>
          <p className="text-gray-400">Manage all registered users and owners</p>
        </div>
        <div className="flex items-center gap-2 bg-dark-card/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-400">
          <FaUsers className="text-neon-blue" />
          <span className="text-white font-bold">{users.length}</span> total users
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px] relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-dark-card/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-neon-blue outline-none text-sm"
          />
        </div>
        <select value={filterRole}   onChange={e => setFilterRole(e.target.value)}   className="bg-dark-card/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-neon-blue">
          <option value="ALL">All Roles</option>
          <option value="USER">User</option>
          <option value="OWNER">Owner</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-dark-card/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-neon-blue">
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="BLOCKED">Blocked</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Contact</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Joined</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(u => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setSelectedUserId(u.id)}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-purple/30 to-neon-blue/30 border border-white/10 flex items-center justify-center font-bold text-white text-sm shrink-0">
                        {u.name[0]}
                      </div>
                      <span className="text-white font-semibold">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-gray-300 text-sm">{u.email}</p>
                    <p className="text-gray-500 text-xs">{u.phone}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm">
                      {getRoleIcon(u.role)}
                      <span className="text-gray-300">{u.role}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-400 text-sm">{u.joined}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.status === "ACTIVE" ? "bg-neon-green/20 text-neon-green" : "bg-neon-red/20 text-neon-red"}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${u.status === "ACTIVE" ? "bg-neon-red/20 text-neon-red hover:bg-neon-red hover:text-white" : "bg-neon-green/20 text-neon-green hover:bg-neon-green hover:text-white"}`}
                      >
                        {u.status === "ACTIVE" ? "Block" : "Unblock"}
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(u.id)}
                        className="p-2 rounded-lg bg-white/5 text-gray-500 hover:bg-neon-red/20 hover:text-neon-red transition-all"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="6" className="py-12 text-center text-gray-500">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* USER DETAIL DRAWER */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end" onClick={() => setSelectedUserId(null)}>
            <motion.div
              initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full max-w-sm bg-dark-card border-l border-white/10 h-full overflow-y-auto p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">User Details</h3>
                <button onClick={() => setSelectedUserId(null)} className="text-gray-400 hover:text-white"><FaTimes /></button>
              </div>

              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-purple/40 to-neon-blue/40 border-2 border-neon-purple/30 flex items-center justify-center text-3xl font-bold text-white mx-auto mb-3">
                  {selectedUser.name[0]}
                </div>
                <h4 className="text-xl font-bold text-white">{selectedUser.name}</h4>
                <p className="text-gray-400 text-sm">{selectedUser.email}</p>
                <span className={`mt-2 inline-block px-2 py-1 rounded text-xs font-bold ${selectedUser.status === "ACTIVE" ? "bg-neon-green/20 text-neon-green" : "bg-neon-red/20 text-neon-red"}`}>
                  {selectedUser.status}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { label: "Phone",          value: selectedUser.phone    },
                  { label: "Joined",         value: selectedUser.joined   },
                  { label: "Total Bookings", value: selectedUser.bookings },
                  { label: "Total Spent",    value: selectedUser.spent    },
                  ...(selectedUser.parkings ? [{ label: "Parking Lots", value: selectedUser.parkings }] : []),
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-gray-400 text-sm">{item.label}</span>
                    <span className="text-white font-semibold text-sm">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Change Role</p>
                <div className="grid grid-cols-2 gap-2">
                  {["USER", "OWNER"].map(role => (
                    <button
                      key={role}
                      onClick={() => changeRole(selectedUser.id, role)}
                      className={`py-2 rounded-lg text-sm font-bold border transition-all flex items-center justify-center gap-2 ${selectedUser.role === role ? "bg-neon-purple/20 border-neon-purple/50 text-neon-purple" : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"}`}
                    >
                      {getRoleIcon(role)} {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => toggleStatus(selectedUser.id)}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all border ${selectedUser.status === "ACTIVE" ? "bg-neon-red/20 text-neon-red hover:bg-neon-red hover:text-white border-neon-red/30" : "bg-neon-green/20 text-neon-green hover:bg-neon-green hover:text-white border-neon-green/30"}`}
                >
                  {selectedUser.status === "ACTIVE" ? "Block User" : "Unblock User"}
                </button>
                <button
                  onClick={() => setDeleteConfirmId(selectedUser.id)}
                  className="py-2.5 rounded-xl text-sm font-bold bg-white/5 text-gray-400 hover:bg-neon-red/20 hover:text-neon-red border border-white/10 transition-all"
                >
                  Delete User
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM MODAL — z-[60] sits above the drawer */}
      <AnimatePresence>
        {deleteConfirmUser && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-card border border-neon-red/30 rounded-2xl p-8 max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 rounded-full bg-neon-red/20 flex items-center justify-center mx-auto mb-4">
                <FaTrash className="text-neon-red text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete User?</h3>
              <p className="text-gray-400 text-sm mb-6">
                Are you sure you want to delete <span className="text-white font-bold">{deleteConfirmUser.name}</span>? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 border border-white/10 transition-all">Cancel</button>
                <button onClick={() => deleteUser(deleteConfirmUser.id)} className="flex-1 py-3 rounded-xl bg-neon-red text-white font-bold hover:bg-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}