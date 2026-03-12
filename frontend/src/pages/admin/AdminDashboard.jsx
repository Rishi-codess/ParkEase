import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FaBell,
  FaCar,
  FaCarSide,
  FaEye,
  FaExclamationCircle,
  FaMapMarkerAlt,
  FaMotorcycle,
  FaTimes,
  FaTrash,
  FaTruck,
  FaUser,
  FaUserShield,
  FaUsers,
} from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ParkingDetailsModal from "./ParkingDetailsModal";

const NAV_MAP = {
  "ghost-slots": "ghostSlots",
  dashboard: "dashboard",
  users: "users",
  parkings: "parkings",
  bookings: "bookings",
  revenue: "revenue",
};

const PARKING_STATUS_TABS = ["ALL", "PENDING", "APPROVED", "REJECTED", "SUSPENDED"];
const BOOKING_TABS = ["ALL", "ACTIVE", "COMPLETED", "CANCELLED"];
const TRANSACTION_TABS = ["ALL", "SUCCESS", "REFUNDED", "FAILED"];

const USERS_SEED = [
  {
    id: 1,
    name: "Rishi Kumar",
    email: "rishi@email.com",
    phone: "9876543210",
    role: "USER",
    joined: "Jan 12, 2026",
    status: "ACTIVE",
    blockReason: "",
  },
  {
    id: 2,
    name: "Amit Shah",
    email: "amit@email.com",
    phone: "9123456789",
    role: "OWNER",
    joined: "Dec 5, 2025",
    status: "ACTIVE",
    blockReason: "",
  },
  {
    id: 3,
    name: "Neha Singh",
    email: "neha@email.com",
    phone: "9988776655",
    role: "USER",
    joined: "Nov 20, 2025",
    status: "BLOCKED",
    blockReason: "No-show and abusive behavior reported.",
  },
  {
    id: 4,
    name: "Suresh Patel",
    email: "suresh@email.com",
    phone: "9112233445",
    role: "USER",
    joined: "Feb 1, 2026",
    status: "ACTIVE",
    blockReason: "",
  },
  {
    id: 5,
    name: "Priya Menon",
    email: "priya@email.com",
    phone: "9654321876",
    role: "OWNER",
    joined: "Oct 15, 2025",
    status: "ACTIVE",
    blockReason: "",
  },
  {
    id: 6,
    name: "Karan Dev",
    email: "karan@email.com",
    phone: "9009988776",
    role: "USER",
    joined: "Feb 10, 2026",
    status: "ACTIVE",
    blockReason: "",
  },
];

const buildSlots = (prefix, types) => {
  const slots = [];
  const statuses = ["OCCUPIED", "AVAILABLE", "RESERVED", "MAINTENANCE"];
  types.forEach(({ type, count, cost }) => {
    for (let i = 1; i <= count; i++) {
      slots.push({
        slotId: `${prefix}-${type.charAt(0)}${String(i).padStart(2, "0")}`,
        vehicleType: type,
        status: statuses[Math.floor(Math.random() * 3.2) | 0], // weighted toward first 3
        costPerHour: cost,
      });
    }
  });
  // Pin some slots to specific statuses for demo variety
  if (slots.length > 2) slots[0].status = "OCCUPIED";
  if (slots.length > 3) slots[slots.length - 1].status = "MAINTENANCE";
  return slots;
};

const PARKINGS_SEED = [
  {
    id: 101,
    name: "City Mall Parking",
    location: "City Center, Block A",
    owner: "Amit Shah",
    ownerEmail: "amit@email.com",
    submitted: "Jan 15, 2026",
    status: "APPROVED",
    pricePerHour: 50,
    totalEarnings: 12400,
    slots: buildSlots("CM", [
      { type: "CAR", count: 6, cost: 50 },
      { type: "BIKE", count: 4, cost: 20 },
      { type: "LARGE", count: 2, cost: 100 },
      { type: "SMALL", count: 2, cost: 30 },
    ]),
  },
  {
    id: 102,
    name: "Hospital Parking",
    location: "Medical District, Gate 2",
    owner: "Priya Menon",
    ownerEmail: "priya@email.com",
    submitted: "Oct 20, 2025",
    status: "APPROVED",
    pricePerHour: 30,
    totalEarnings: 8750,
    slots: buildSlots("HP", [
      { type: "CAR", count: 4, cost: 30 },
      { type: "BIKE", count: 3, cost: 15 },
      { type: "SMALL", count: 2, cost: 20 },
    ]),
  },
  {
    id: 103,
    name: "Phoenix Mall Basement",
    location: "Phoenix Complex, Basement",
    owner: "Rahul Sharma",
    ownerEmail: "rahul@email.com",
    submitted: "Feb 20, 2026",
    status: "PENDING",
    pricePerHour: 80,
    totalEarnings: 0,
    slots: buildSlots("PX", [
      { type: "CAR", count: 10, cost: 80 },
      { type: "BIKE", count: 6, cost: 30 },
      { type: "LARGE", count: 4, cost: 150 },
    ]),
  },
  {
    id: 104,
    name: "Station Road Parking",
    location: "Railway Station Sq.",
    owner: "Deepa Nair",
    ownerEmail: "deepa@email.com",
    submitted: "Feb 22, 2026",
    status: "PENDING",
    pricePerHour: 40,
    totalEarnings: 0,
    slots: buildSlots("SR", [
      { type: "CAR", count: 8, cost: 40 },
      { type: "BIKE", count: 5, cost: 15 },
      { type: "SMALL", count: 2, cost: 25 },
    ]),
  },
  {
    id: 105,
    name: "Airport Overflow",
    location: "Terminal 1",
    owner: "Aman Verma",
    ownerEmail: "aman@email.com",
    submitted: "Feb 9, 2026",
    status: "REJECTED",
    pricePerHour: 90,
    totalEarnings: 0,
    slots: buildSlots("AP", [
      { type: "CAR", count: 5, cost: 90 },
      { type: "LARGE", count: 4, cost: 180 },
      { type: "BIKE", count: 3, cost: 40 },
    ]),
  },
];

const BOOKINGS_SEED = [
  {
    id: "BK-001",
    user: "Rishi Kumar",
    parking: "City Mall Parking",
    location: "City Center",
    slot: "A-14",
    date: "Feb 14, 2026",
    duration: "3 hrs",
    amount: "₹1500",
    status: "COMPLETED",
  },
  {
    id: "BK-002",
    user: "Suresh Patel",
    parking: "Hospital Parking",
    location: "Medical District",
    slot: "B-05",
    date: "Feb 12, 2026",
    duration: "1.5 hrs",
    amount: "₹850",
    status: "COMPLETED",
  },
  {
    id: "BK-003",
    user: "Karan Dev",
    parking: "Airport Terminal 1",
    location: "Airport Rd",
    slot: "T1-45",
    date: "Feb 10, 2026",
    duration: "5 days",
    amount: "₹12000",
    status: "CANCELLED",
  },
  {
    id: "BK-004",
    user: "Rishi Kumar",
    parking: "Railway Station",
    location: "Station Square",
    slot: "C-22",
    date: "Feb 24, 2026",
    duration: "Ongoing",
    amount: "Running",
    status: "ACTIVE",
  },
  {
    id: "BK-005",
    user: "Neha Singh",
    parking: "City Mall Parking",
    location: "City Center",
    slot: "A-07",
    date: "Feb 23, 2026",
    duration: "2 hrs",
    amount: "₹1000",
    status: "COMPLETED",
  },
  {
    id: "BK-006",
    user: "Karan Dev",
    parking: "Hospital Parking",
    location: "Medical District",
    slot: "B-11",
    date: "Feb 24, 2026",
    duration: "Ongoing",
    amount: "Running",
    status: "ACTIVE",
  },
];

const WEEKLY_REVENUE = [18, 32, 15, 41, 27, 36, 22];

const OWNER_PAYOUTS = [
  { owner: "Amit Shah", parking: "City Mall Parking", gross: "₹4500", commission: "₹450", net: "₹4050" },
  { owner: "Priya Menon", parking: "Hospital Parking", gross: "₹1450", commission: "₹145", net: "₹1305" },
];

const TRANSACTIONS_SEED = [
  { id: "TXN001", user: "Rishi Kumar", parking: "City Mall Parking", amount: "₹1500", commission: "₹150", ownerGets: "₹1350", date: "Feb 14, 2026", status: "SUCCESS" },
  { id: "TXN002", user: "Suresh Patel", parking: "Hospital Parking", amount: "₹850", commission: "₹85", ownerGets: "₹765", date: "Feb 12, 2026", status: "SUCCESS" },
  { id: "TXN003", user: "Karan Dev", parking: "Airport Terminal 1", amount: "₹12000", commission: "₹1200", ownerGets: "₹10800", date: "Feb 10, 2026", status: "REFUNDED" },
  { id: "TXN004", user: "Neha Singh", parking: "City Mall Parking", amount: "₹1000", commission: "₹100", ownerGets: "₹900", date: "Feb 23, 2026", status: "SUCCESS" },
  { id: "TXN005", user: "Suresh Patel", parking: "City Mall Parking", amount: "₹2000", commission: "₹200", ownerGets: "₹1800", date: "Feb 21, 2026", status: "SUCCESS" },
  { id: "TXN006", user: "Rishi Kumar", parking: "Hospital Parking", amount: "₹600", commission: "₹60", ownerGets: "₹540", date: "Feb 8, 2026", status: "FAILED" },
];

const GHOST_ACTIVE_SEED = [
  {
    id: "B-02",
    parking: "Hospital Parking",
    bookedBy: "Karan Dev",
    bookedAt: "10:15 AM",
    owner: "Priya Menon",
    elapsed: 92,
  },
  {
    id: "A-11",
    parking: "City Mall Parking",
    bookedBy: "Suresh Patel",
    bookedAt: "1:00 PM",
    owner: "Amit Shah",
    elapsed: 18,
  },
];

const GHOST_RELEASED_SEED = [
  { slot: "A-04", parking: "City Mall Parking", bookedBy: "Rishi Kumar", originallyAt: "2:30 PM", releasedAt: "06:43 PM" },
  { slot: "C-17", parking: "Railway Station", bookedBy: "Asha Roy", originallyAt: "11:25 AM", releasedAt: "01:01 PM" },
];

const COMPLAINTS_SEED = [
  { id: "CMP-99", source: "User", issue: "Incorrect payout split", severity: "HIGH", status: "OPEN" },
  { id: "CMP-100", source: "Owner", issue: "Parking listing delay", severity: "MEDIUM", status: "IN_REVIEW" },
  { id: "CMP-101", source: "User", issue: "Ghost booking auto-release failed", severity: "HIGH", status: "RESOLVED" },
];

function cardBase(extra = "") {
  return `bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-2xl ${extra}`;
}

function statusPill(value) {
  const map = {
    ACTIVE: "bg-neon-blue/20 text-neon-blue",
    COMPLETED: "bg-neon-green/20 text-neon-green",
    SUCCESS: "bg-neon-green/20 text-neon-green",
    APPROVED: "bg-neon-green/20 text-neon-green",
    BLOCKED: "bg-neon-red/20 text-neon-red",
    REJECTED: "bg-neon-red/20 text-neon-red",
    CANCELLED: "bg-neon-red/20 text-neon-red",
    FAILED: "bg-neon-red/20 text-neon-red",
    REFUNDED: "bg-yellow-500/20 text-yellow-300",
    PENDING: "bg-yellow-500/20 text-yellow-300",
    SUSPENDED: "bg-gray-500/20 text-gray-300",
    OPEN: "bg-neon-red/20 text-neon-red",
    IN_REVIEW: "bg-yellow-500/20 text-yellow-300",
    RESOLVED: "bg-neon-green/20 text-neon-green",
  };

  return `inline-flex items-center rounded-xl px-3 py-1 text-xs font-semibold tracking-wide ${map[value] || "bg-white/10 text-gray-300"}`;
}

function AvatarBadge({ name }) {
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-blue/80 to-neon-purple/80 text-white text-sm font-bold flex items-center justify-center shrink-0">
      {name.charAt(0)}
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h1 className="text-5xl sm:text-4xl font-bold text-white leading-tight">{title}</h1>
      <p className="text-gray-400 text-lg mt-2">{subtitle}</p>
    </div>
  );
}

function AdminDashboard() {
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(USERS_SEED);
  const [parkings, setParkings] = useState(PARKINGS_SEED);
  const [transactions] = useState(TRANSACTIONS_SEED);
  const [ghostActive, setGhostActive] = useState(GHOST_ACTIVE_SEED);
  const [ghostReleased, setGhostReleased] = useState(GHOST_RELEASED_SEED);

  const [parkingTab, setParkingTab] = useState("ALL");
  const [bookingTab, setBookingTab] = useState("ALL");
  const [txnTab, setTxnTab] = useState("ALL");
  const [blockTarget, setBlockTarget] = useState(null);
  const [blockReason, setBlockReason] = useState("");

  // Parking space selector for live status
  const approvedParkings = useMemo(() => parkings.filter((p) => p.status === "APPROVED"), [parkings]);
  const [selectedParkingId, setSelectedParkingId] = useState(() => approvedParkings[0]?.id || null);
  const [viewParkingId, setViewParkingId] = useState(null);

  const currentPage = useMemo(() => {
    const segment = location.pathname.split("/").filter(Boolean).pop() || "dashboard";
    return NAV_MAP[segment] || "dashboard";
  }, [location.pathname]);

  // Vehicle icon helper
  const vIcon = (type) => {
    switch (type) {
      case "CAR": return <FaCar />;
      case "BIKE": return <FaMotorcycle />;
      case "LARGE": return <FaTruck />;
      case "SMALL": return <FaCarSide />;
      default: return <FaCar />;
    }
  };

  // Parking-aware slot data
  const selectedParking = useMemo(
    () => parkings.find((p) => p.id === selectedParkingId) || approvedParkings[0],
    [parkings, selectedParkingId, approvedParkings]
  );
  const selectedSlots = selectedParking?.slots || [];
  const slotStats = useMemo(() => {
    const total = selectedSlots.length;
    const occupied = selectedSlots.filter((s) => s.status === "OCCUPIED").length;
    const available = selectedSlots.filter((s) => s.status === "AVAILABLE").length;
    const reserved = selectedSlots.filter((s) => s.status === "RESERVED").length;
    const maintenance = selectedSlots.filter((s) => s.status === "MAINTENANCE").length;
    const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;
    return { total, occupied, available, reserved, maintenance, occupancyRate };
  }, [selectedSlots]);
  const slotVehicleTypes = useMemo(() => [...new Set(selectedSlots.map((s) => s.vehicleType))], [selectedSlots]);

  // Occupancy donut gradient
  const donutGradient = useMemo(() => {
    const t = slotStats.total || 1;
    let offset = 0;
    const segs = [
      { pct: (slotStats.occupied / t) * 100, color: "#ef4444" },
      { pct: (slotStats.available / t) * 100, color: "#22c55e" },
      { pct: (slotStats.reserved / t) * 100, color: "#eab308" },
      { pct: (slotStats.maintenance / t) * 100, color: "#6b7280" },
    ];
    const parts = segs.map((s) => {
      const str = `${s.color} ${offset}% ${offset + s.pct}%`;
      offset += s.pct;
      return str;
    });
    return `conic-gradient(${parts.join(", ")})`;
  }, [slotStats]);

  // Slot status color helper
  const slotStatusColor = (status) => {
    switch (status) {
      case "OCCUPIED": return "bg-neon-red/15 border-neon-red/25 text-neon-red";
      case "AVAILABLE": return "bg-neon-green/15 border-neon-green/25 text-neon-green";
      case "RESERVED": return "bg-yellow-500/15 border-yellow-500/25 text-yellow-400";
      case "MAINTENANCE": return "bg-gray-500/15 border-gray-500/25 text-gray-400";
      default: return "bg-white/5 border-white/10 text-gray-400";
    }
  };

  // Total platform revenue (₹)
  const totalRevenue = useMemo(() => parkings.reduce((sum, p) => sum + (p.totalEarnings || 0), 0), [parkings]);

  const filteredUsers = users.filter((user) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    return [user.name, user.email, user.phone, user.role].join(" ").toLowerCase().includes(query);
  });

  const filteredParkings = parkings.filter((parking) => {
    const matchesTab = parkingTab === "ALL" || parking.status === parkingTab;
    const matchesSearch = !searchTerm.trim() || [parking.name, parking.location, parking.owner].join(" ").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const filteredBookings = BOOKINGS_SEED.filter((booking) => {
    const matchesTab = bookingTab === "ALL" || booking.status === bookingTab;
    const matchesSearch = !searchTerm.trim() || [booking.user, booking.parking, booking.slot].join(" ").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesTab = txnTab === "ALL" || transaction.status === txnTab;
    const matchesSearch = !searchTerm.trim() || [transaction.id, transaction.user, transaction.parking].join(" ").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const ownerAccounts = users.filter((user) => user.role === "OWNER");
  const pendingParkingCount = parkings.filter((parking) => parking.status === "PENDING").length;

  const updateParkingStatus = (id, status) => {
    setParkings((prev) => prev.map((parking) => (parking.id === id ? { ...parking, status } : parking)));
  };

  const startBlocking = (user) => {
    setBlockTarget(user);
    setBlockReason("");
  };

  const confirmBlock = () => {
    if (!blockTarget || !blockReason.trim()) return;
    setUsers((prev) =>
      prev.map((user) =>
        user.id === blockTarget.id
          ? { ...user, status: "BLOCKED", blockReason: blockReason.trim() }
          : user
      )
    );
    setBlockTarget(null);
    setBlockReason("");
  };

  const unblockUser = (id) => {
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, status: "ACTIVE", blockReason: "" } : user)));
  };

  const forceReleaseGhost = (slotId) => {
    const target = ghostActive.find((ghost) => ghost.id === slotId);
    if (!target) return;

    setGhostActive((prev) => prev.filter((ghost) => ghost.id !== slotId));
    setGhostReleased((prev) => [
      {
        slot: target.id,
        parking: target.parking,
        bookedBy: target.bookedBy,
        originallyAt: target.bookedAt,
        releasedAt: "Now",
      },
      ...prev,
    ]);
  };

  const renderDashboard = () => (
    <>
      <SectionTitle title="Dashboard" subtitle="Real-time monitoring and analytics" />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
        <div className={`${cardBase("p-5")}`}>
          <p className="text-gray-300 uppercase tracking-wide text-sm">Total Slots</p>
          <h3 className="text-5xl font-bold mt-2">{slotStats.total}</h3>
          <p className="text-gray-400 mt-1">{selectedParking?.name || "—"}</p>
        </div>
        <div className={`${cardBase("p-5 bg-gradient-to-r from-neon-red/15 to-transparent")}`}>
          <p className="text-gray-300 uppercase tracking-wide text-sm">Occupied</p>
          <h3 className="text-5xl font-bold mt-2 text-neon-red">{slotStats.occupied}</h3>
          <p className="text-neon-red/70 mt-1">{slotStats.occupancyRate}% occupancy</p>
        </div>
        <div className={`${cardBase("p-5 bg-gradient-to-r from-neon-green/15 to-transparent")}`}>
          <p className="text-gray-300 uppercase tracking-wide text-sm">Available</p>
          <h3 className="text-5xl font-bold mt-2 text-neon-green">{slotStats.available}</h3>
          <p className="text-neon-green/70 mt-1">open for booking</p>
        </div>
        <div className={`${cardBase("p-5 bg-gradient-to-r from-yellow-500/15 to-transparent")}`}>
          <p className="text-gray-300 uppercase tracking-wide text-sm">Reserved</p>
          <h3 className="text-5xl font-bold mt-2 text-yellow-400">{slotStats.reserved}</h3>
          <p className="text-yellow-400/70 mt-1">pre-booked</p>
        </div>
        <div className={`${cardBase("p-5 bg-gradient-to-r from-neon-purple/15 to-transparent")}`}>
          <p className="text-gray-300 uppercase tracking-wide text-sm">Revenue</p>
          <h3 className="text-5xl font-bold mt-2">₹{totalRevenue.toLocaleString()}</h3>
          <p className="text-neon-green mt-1">platform total</p>
        </div>
      </div>

      {/* Live Parking Status + Occupancy */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <section className={`${cardBase("xl:col-span-2 p-6")}`}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <h3 className="text-2xl font-bold text-white">Live Parking Status</h3>
            <div className="flex items-center gap-3">
              {/* Parking Space Selector */}
              <select
                value={selectedParkingId || ""}
                onChange={(e) => setSelectedParkingId(Number(e.target.value))}
                className="bg-dark-bg border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-neon-blue/40 min-w-[200px]"
              >
                {approvedParkings.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {/* Real-time indicator */}
              <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                Live
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-4">
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-neon-red" />Occupied</span>
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-neon-green" />Available</span>
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />Reserved</span>
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-gray-500" />Maintenance</span>
          </div>

          {/* Slot grid grouped by vehicle type */}
          {slotVehicleTypes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No slots configured.</div>
          ) : (
            slotVehicleTypes.map((type) => {
              const typeSlots = selectedSlots.filter((s) => s.vehicleType === type);
              return (
                <div key={type} className="mb-4">
                  <h4 className="text-white/70 font-bold text-sm mb-2 flex items-center gap-2 uppercase tracking-wider">
                    <span className="text-base">{vIcon(type)}</span>
                    {type}
                    <span className="text-xs text-gray-500 font-normal">({typeSlots.length})</span>
                  </h4>
                  <div className="grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-10 gap-2 mb-2">
                    {typeSlots.map((slot) => (
                      <div
                        key={slot.slotId}
                        className={`h-14 rounded-lg border flex flex-col items-center justify-center transition-all ${slotStatusColor(slot.status)}`}
                      >
                        <span className="text-[10px] font-mono opacity-80">{slot.slotId}</span>
                        <span className="text-sm mt-0.5">{vIcon(slot.vehicleType)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* Occupancy Donut */}
        <section className={`${cardBase("p-6")}`}>
          <h3 className="text-2xl font-bold mb-6">Occupancy</h3>
          <div className="flex items-center justify-center py-4">
            <div
              className="w-52 h-52 rounded-full relative"
              style={{ background: donutGradient }}
            >
              <div className="absolute inset-4 rounded-full bg-dark-bg border border-white/10 flex flex-col items-center justify-center">
                <span className="text-4xl font-black">{slotStats.occupancyRate}%</span>
                <span className="text-gray-400 text-sm">occupied</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-gray-300">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-neon-red" /> Occupied ({slotStats.occupied})</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-neon-green" /> Available ({slotStats.available})</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Reserved ({slotStats.reserved})</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-500" /> Maintenance ({slotStats.maintenance})</div>
          </div>
        </section>
      </div>

      {/* Bottom 3 panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className={`${cardBase("p-6")}`}>
          <h3 className="text-xl font-bold mb-4">Owner Management</h3>
          <div className="space-y-3">
            {ownerAccounts.map((owner) => (
              <div key={owner.id} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AvatarBadge name={owner.name} />
                  <div>
                    <p className="font-semibold text-white">{owner.name}</p>
                    <p className="text-xs text-gray-400">{owner.email}</p>
                  </div>
                </div>
                <span className={statusPill(owner.status)}>{owner.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={`${cardBase("p-6")}`}>
          <h3 className="text-xl font-bold mb-4">Complaint Management</h3>
          <div className="space-y-3">
            {COMPLAINTS_SEED.map((complaint) => (
              <div key={complaint.id} className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-300">{complaint.id}</p>
                  <span className={statusPill(complaint.status)}>{complaint.status}</span>
                </div>
                <p className="text-white font-semibold">{complaint.issue}</p>
                <p className="text-xs text-gray-400 mt-1">{complaint.source} complaint - severity {complaint.severity}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={`${cardBase("p-6")}`}>
          <h3 className="text-xl font-bold mb-4">Parking Analytics Insights</h3>
          <div className="space-y-3">
            <div className="bg-neon-blue/10 border border-neon-blue/20 rounded-xl p-3">
              <p className="text-white font-semibold">Peak Entry Window</p>
              <p className="text-gray-300 text-sm">12:00 PM to 2:00 PM generates 31% of daily traffic.</p>
            </div>
            <div className="bg-neon-green/10 border border-neon-green/20 rounded-xl p-3">
              <p className="text-white font-semibold">Best Performing Lot</p>
              <p className="text-gray-300 text-sm">City Mall Parking conversion is up by 18% this week.</p>
            </div>
            <div className="bg-neon-red/10 border border-neon-red/20 rounded-xl p-3">
              <p className="text-white font-semibold">Alert</p>
              <p className="text-gray-300 text-sm">Ghost slot frequency increased by 2.1% in Hospital Parking.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );

  const renderUsers = () => (
    <>
      <SectionTitle title="Users" subtitle="Manage all registered users and owners" />

      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
          <FaUsers className="text-neon-blue" />
          <span className="text-neon-blue font-semibold">{users.length}</span>
          <span className="text-gray-300">total users</span>
        </div>
        <div className="flex gap-2">
          <button className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white">All Roles</button>
          <button className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white">All Status</button>
        </div>
      </div>

      <section className={`${cardBase("p-0 overflow-hidden")}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1020px]">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left p-4">User</th>
                <th className="text-left p-4">Contact</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Joined</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <AvatarBadge name={user.name} />
                      <p className="font-semibold text-white">{user.name}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-white">{user.email}</p>
                    <p className="text-xs text-gray-400">{user.phone}</p>
                    {user.blockReason && <p className="text-xs text-neon-red mt-1">Reason: {user.blockReason}</p>}
                  </td>
                  <td className="p-4 text-gray-200 font-semibold flex items-center gap-2">
                    {user.role === "OWNER" ? <FaUserShield className="text-neon-blue" /> : <FaUser className="text-gray-300" />} {user.role}
                  </td>
                  <td className="p-4 text-gray-300">{user.joined}</td>
                  <td className="p-4"><span className={statusPill(user.status)}>{user.status}</span></td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      {user.status === "ACTIVE" ? (
                        <button onClick={() => startBlocking(user)} className="px-3 py-1.5 rounded-xl bg-neon-red/20 text-neon-red hover:bg-neon-red/30 text-sm font-semibold">Block</button>
                      ) : (
                        <button onClick={() => unblockUser(user.id)} className="px-3 py-1.5 rounded-xl bg-neon-green/20 text-neon-green hover:bg-neon-green/30 text-sm font-semibold">Unblock</button>
                      )}
                      <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );

  const renderParkings = () => (
    <>
      <SectionTitle title="Parkings" subtitle="Review and approve owner-submitted parking lots" />

      <div className="mb-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-yellow-300 font-semibold">
        • {pendingParkingCount} parking lots awaiting your approval
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {PARKING_STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setParkingTab(tab)}
            className={`px-4 py-2 rounded-xl border text-sm font-semibold ${parkingTab === tab ? "bg-neon-blue/30 border-neon-blue/40 text-neon-blue" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"}`}
          >
            {tab}
            <span className="ml-2 text-xs text-gray-400">{tab === "ALL" ? parkings.length : parkings.filter((p) => p.status === tab).length}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {filteredParkings.map((parking) => (
          <article key={parking.id} className={`${cardBase("p-5")}`}>
            <div className="flex justify-between items-start gap-3">
              <div>
                <h3 className="text-3xl font-bold">{parking.name}</h3>
                <p className="text-gray-400 mt-1 flex items-center gap-2"><FaMapMarkerAlt className="text-neon-blue" />{parking.location}</p>
              </div>
              <span className={statusPill(parking.status)}>{parking.status}</span>
            </div>

            <div className="grid grid-cols-4 gap-3 mt-4 text-center">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <p className="text-neon-purple text-3xl font-bold">{(parking.slots || []).length}</p>
                <p className="text-xs text-gray-400">Slots</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <p className="text-neon-green text-3xl font-bold">₹{parking.pricePerHour}</p>
                <p className="text-xs text-gray-400">Per Hour</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <p className="text-neon-blue text-2xl font-bold">{parking.owner}</p>
                <p className="text-xs text-gray-400">Owner</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <p className="text-yellow-400 text-3xl font-bold">₹{(parking.totalEarnings || 0).toLocaleString()}</p>
                <p className="text-xs text-gray-400">Earnings</p>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-3">Submitted: {parking.submitted}</p>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <button onClick={() => setViewParkingId(parking.id)} className="py-2 rounded-xl bg-white/5 border border-white/10 text-gray-200 font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                <FaEye /> View
              </button>
              {parking.status === "PENDING" ? (
                <>
                  <button onClick={() => updateParkingStatus(parking.id, "APPROVED")} className="py-2 rounded-xl bg-neon-green/20 text-neon-green font-semibold">Approve</button>
                  <button onClick={() => updateParkingStatus(parking.id, "REJECTED")} className="py-2 rounded-xl bg-neon-red/20 text-neon-red font-semibold">Reject</button>
                </>
              ) : (
                <button onClick={() => updateParkingStatus(parking.id, "SUSPENDED")} className="col-span-2 py-2 rounded-xl bg-white/10 text-gray-200 font-semibold">Suspend</button>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );

  const renderBookings = () => {
    const active = BOOKINGS_SEED.filter((booking) => booking.status === "ACTIVE").length;
    const completed = BOOKINGS_SEED.filter((booking) => booking.status === "COMPLETED").length;
    const cancelled = BOOKINGS_SEED.filter((booking) => booking.status === "CANCELLED").length;

    return (
      <>
        <SectionTitle title="All Bookings" subtitle="Platform-wide booking overview" />

        <div className="flex flex-wrap justify-end gap-3 mb-4">
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center min-w-20"><p className="text-neon-blue text-4xl font-bold">{active}</p><p className="text-xs text-gray-400">Active</p></div>
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center min-w-20"><p className="text-neon-green text-4xl font-bold">{completed}</p><p className="text-xs text-gray-400">Completed</p></div>
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center min-w-20"><p className="text-neon-red text-4xl font-bold">{cancelled}</p><p className="text-xs text-gray-400">Cancelled</p></div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {BOOKING_TABS.map((tab) => (
            <button key={tab} onClick={() => setBookingTab(tab)} className={`px-4 py-2 rounded-xl border text-sm font-semibold ${bookingTab === tab ? "bg-neon-blue/30 border-neon-blue/40 text-neon-blue" : "bg-white/5 border-white/10 text-gray-300"}`}>
              {tab}
            </button>
          ))}
        </div>

        <section className={`${cardBase("p-0 overflow-hidden")}`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1060px]">
              <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wide">
                <tr>
                  <th className="p-4 text-left">User</th>
                  <th className="p-4 text-left">Parking Location</th>
                  <th className="p-4 text-left">Slot</th>
                  <th className="p-4 text-left">Date & Duration</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                    <td className="p-4 text-white font-semibold">{booking.user}</td>
                    <td className="p-4">
                      <p className="text-white">{booking.parking}</p>
                      <p className="text-xs text-gray-400">{booking.location}</p>
                    </td>
                    <td className="p-4"><span className="bg-neon-purple/20 text-neon-purple px-2 py-1 rounded-lg text-sm font-semibold">{booking.slot}</span></td>
                    <td className="p-4">
                      <p className="text-white">{booking.date}</p>
                      <p className="text-xs text-gray-400">{booking.duration}</p>
                    </td>
                    <td className="p-4 text-white font-semibold">{booking.amount}</td>
                    <td className="p-4"><span className={statusPill(booking.status)}>{booking.status}</span></td>
                    <td className="p-4 text-right">
                      {booking.status === "ACTIVE" ? (
                        <button className="px-3 py-1.5 rounded-xl bg-neon-red/20 text-neon-red text-sm font-semibold">Force Cancel</button>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  };

  const renderRevenue = () => (
    <>
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <SectionTitle title="Revenue & Payments" subtitle="Platform earnings, commissions and transactions" />
        <button className="inline-flex items-center gap-2 rounded-xl bg-neon-blue/20 border border-neon-blue/30 px-4 py-2 text-neon-blue font-semibold"><FiDownload /> Export CSV</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className={`${cardBase("p-5 bg-gradient-to-r from-neon-green/15 to-transparent")}`}>
          <p className="text-gray-300 uppercase text-sm">Total Revenue</p>
          <h3 className="text-5xl font-bold mt-2">₹{totalRevenue.toLocaleString()}</h3>
          <p className="text-neon-green mt-1">+24% vs last week</p>
        </div>
        <div className={`${cardBase("p-5 bg-gradient-to-r from-neon-purple/15 to-transparent")}`}>
          <p className="text-gray-300 uppercase text-sm">Platform Commission (10%)</p>
          <h3 className="text-5xl font-bold mt-2">₹{Math.round(totalRevenue * 0.1).toLocaleString()}</h3>
          <p className="text-neon-green mt-1">+18% vs last week</p>
        </div>
        <div className={`${cardBase("p-5 bg-gradient-to-r from-neon-red/15 to-transparent")}`}>
          <p className="text-gray-300 uppercase text-sm">Total Refunds</p>
          <h3 className="text-5xl font-bold mt-2">₹12,000</h3>
        </div>
      </div>

      <section className={`${cardBase("p-6 mb-6")}`}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-2xl font-bold">Revenue Trends</h3>
            <p className="text-gray-400">Daily earnings for this week</p>
          </div>
          <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300">This Week</button>
        </div>
        <div className="h-52 flex items-end gap-8 px-4 border-t border-white/5 pt-6">
          {WEEKLY_REVENUE.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center justify-end gap-2">
              <div className="w-6 rounded-t-lg bg-gradient-to-b from-neon-blue to-neon-purple" style={{ height: `${value * 3}px` }} />
              <span className="text-xs text-gray-400">{["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"][index]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={`${cardBase("p-0 overflow-hidden mb-6")}`}>
        <div className="p-5 border-b border-white/5"><h3 className="text-3xl font-bold">Owner Payout Breakdown</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wide">
              <tr>
                <th className="p-4 text-left">Owner</th>
                <th className="p-4 text-left">Parking</th>
                <th className="p-4 text-left">Gross Revenue</th>
                <th className="p-4 text-left">Commission (10%)</th>
                <th className="p-4 text-right">Net Payout</th>
              </tr>
            </thead>
            <tbody>
              {OWNER_PAYOUTS.map((row) => (
                <tr key={row.owner} className="border-t border-white/5">
                  <td className="p-4 text-white font-semibold">{row.owner}</td>
                  <td className="p-4 text-gray-300">{row.parking}</td>
                  <td className="p-4 text-white font-semibold">{row.gross}</td>
                  <td className="p-4 text-neon-red font-semibold">{row.commission}</td>
                  <td className="p-4 text-right text-neon-green font-semibold">{row.net}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={`${cardBase("p-0 overflow-hidden")}`}>
        <div className="p-5 border-b border-white/5 flex flex-wrap justify-between items-center gap-3">
          <h3 className="text-3xl font-bold">All Transactions</h3>
          <div className="flex flex-wrap gap-2">
            {TRANSACTION_TABS.map((tab) => (
              <button key={tab} onClick={() => setTxnTab(tab)} className={`px-3 py-1.5 rounded-xl border text-sm font-semibold ${txnTab === tab ? "bg-neon-blue/30 border-neon-blue/40 text-neon-blue" : "bg-white/5 border-white/10 text-gray-300"}`}>{tab}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1160px]">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wide">
              <tr>
                <th className="p-4 text-left">TXN ID</th>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Parking</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Commission</th>
                <th className="p-4 text-left">Owner Gets</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-t border-white/5">
                  <td className="p-4 text-gray-300">{transaction.id}</td>
                  <td className="p-4 text-white">{transaction.user}</td>
                  <td className="p-4 text-gray-300">{transaction.parking}</td>
                  <td className="p-4 text-white font-semibold">{transaction.amount}</td>
                  <td className="p-4 text-neon-red">{transaction.commission}</td>
                  <td className="p-4 text-neon-green">{transaction.ownerGets}</td>
                  <td className="p-4 text-gray-300">{transaction.date}</td>
                  <td className="p-4 text-right"><span className={statusPill(transaction.status)}>{transaction.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );

  const renderGhostSlots = () => (
    <>
      <SectionTitle title="Ghost Slots" subtitle="Slots booked but with no check-in past the threshold" />

      <div className="flex flex-wrap justify-between gap-3 mb-4">
        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-neon-red flex items-center gap-2"><FaBell /> {ghostActive.length} Active Ghosts</div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-neon-green">{ghostReleased.length} Released</div>
      </div>

      <div className="mb-5 rounded-2xl border border-neon-blue/20 bg-neon-blue/10 px-4 py-3 text-gray-200">
        <FaExclamationCircle className="inline-block mr-2 text-neon-blue" />
        Ghost slots are bookings where the user has not checked in for <strong>30+ minutes</strong> after their start time. Force-release frees the slot for other users immediately.
      </div>

      <h3 className="text-3xl font-bold mb-4 flex items-center gap-2"><span className="w-2 h-8 bg-neon-red rounded-full" />Active Ghost Signals</h3>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-6">
        {ghostActive.map((ghost) => (
          <article key={ghost.id} className={`${cardBase("p-5")}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 uppercase text-sm">Ghost Signal</p>
                <h3 className="text-5xl font-black">#{ghost.id}</h3>
              </div>
              <span className={statusPill("OPEN")}>GHOST</span>
            </div>
            <dl className="grid grid-cols-2 gap-y-2 mt-4 text-sm">
              <dt className="text-gray-400">Parking</dt><dd className="text-white text-right">{ghost.parking}</dd>
              <dt className="text-gray-400">Booked By</dt><dd className="text-neon-blue text-right">{ghost.bookedBy}</dd>
              <dt className="text-gray-400">Booked At</dt><dd className="text-white text-right">{ghost.bookedAt}</dd>
              <dt className="text-gray-400">Owner</dt><dd className="text-gray-200 text-right">{ghost.owner}</dd>
            </dl>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-400">Time Elapsed</span><span className="text-yellow-300">{ghost.elapsed} min</span></div>
              <div className="h-2 rounded-full bg-dark-bg border border-white/10 overflow-hidden">
                <div className={`${ghost.elapsed > 30 ? "bg-neon-red" : "bg-yellow-400"} h-full`} style={{ width: `${Math.min(100, (ghost.elapsed / 100) * 100)}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-1">Threshold: 30 min</p>
            </div>
            <button onClick={() => forceReleaseGhost(ghost.id)} className="mt-5 w-full rounded-xl bg-neon-red/20 text-neon-red py-2.5 font-semibold">Force Release Slot</button>
          </article>
        ))}
      </div>

      <section className={`${cardBase("p-0 overflow-hidden")}`}>
        <div className="p-5 border-b border-white/5"><h3 className="text-3xl font-bold flex items-center gap-2"><span className="w-2 h-8 bg-neon-green rounded-full" />Recently Released</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wide">
              <tr>
                <th className="p-4 text-left">Slot</th>
                <th className="p-4 text-left">Parking</th>
                <th className="p-4 text-left">Booked By</th>
                <th className="p-4 text-left">Originally At</th>
                <th className="p-4 text-right">Released At</th>
              </tr>
            </thead>
            <tbody>
              {ghostReleased.map((row, idx) => (
                <tr key={`${row.slot}-${idx}`} className="border-t border-white/5">
                  <td className="p-4 text-neon-green font-bold">#{row.slot}</td>
                  <td className="p-4 text-white">{row.parking}</td>
                  <td className="p-4 text-gray-300">{row.bookedBy}</td>
                  <td className="p-4 text-gray-300">{row.originallyAt}</td>
                  <td className="p-4 text-right"><span className="px-3 py-1.5 rounded-xl bg-neon-green/20 text-neon-green font-semibold">{row.releasedAt}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );

  const pageContent = {
    dashboard: renderDashboard(),
    users: renderUsers(),
    parkings: renderParkings(),
    bookings: renderBookings(),
    revenue: renderRevenue(),
    ghostSlots: renderGhostSlots(),
  };

  return (
    <DashboardLayout
      role="ADMIN"
      onSearch={setSearchTerm}
      searchTerm={searchTerm}
      userInfo={{ name: "Administrator", role: "ADMIN" }}
    >
      <div className="space-y-1">{pageContent[currentPage]}</div>

      {blockTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${cardBase("w-full max-w-md p-6")}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-2xl font-bold">Block {blockTarget.name}</h3>
              <button onClick={() => setBlockTarget(null)} className="text-gray-400 hover:text-white"><FaTimes /></button>
            </div>
            <p className="text-gray-400 text-sm mb-3">Please provide a reason to log this moderation action.</p>
            <textarea
              value={blockReason}
              onChange={(event) => setBlockReason(event.target.value)}
              placeholder="Enter blocking reason..."
              className="w-full h-28 rounded-xl bg-dark-bg border border-white/10 p-3 text-white placeholder-gray-500 outline-none focus:border-neon-blue/40"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setBlockTarget(null)} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300">Cancel</button>
              <button
                onClick={confirmBlock}
                disabled={!blockReason.trim()}
                className="px-4 py-2 rounded-xl bg-neon-red/25 text-neon-red disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Parking Details Modal */}
      {viewParkingId && (
        <ParkingDetailsModal
          parking={parkings.find((p) => p.id === viewParkingId)}
          complaints={COMPLAINTS_SEED}
          onClose={() => setViewParkingId(null)}
          onStatusChange={(id, status) => {
            updateParkingStatus(id, status);
            setViewParkingId(null);
          }}
        />
      )}
    </DashboardLayout>
  );
}

export default AdminDashboard;
