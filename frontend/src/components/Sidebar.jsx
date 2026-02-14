import { Link, useLocation } from "react-router-dom";
import {
    FaChartPie,
    FaCar,
    FaChartBar,
    FaCalendarAlt,
    FaCreditCard,
    FaCog,
    FaSignOutAlt
} from "react-icons/fa";

export default function Sidebar({ role }) {
    const location = useLocation();

    const menuItems = [
        { name: "Dashboard", path: `/${role.toLowerCase()}/dashboard`, icon: <FaChartPie /> },
        { name: "Booking History", path: "/user/bookings", icon: <FaCalendarAlt /> }, // Added generic history
        { name: "Live Parking", path: "/live-parking", icon: <FaCar /> },
        { name: "Analytics", path: "/analytics", icon: <FaChartBar /> },
        { name: "Reservations", path: "/reservations", icon: <FaCalendarAlt /> },
        { name: "Payments", path: "/payments", icon: <FaCreditCard /> },
        { name: "Settings", path: "/settings", icon: <FaCog /> },
    ];

    return (
        <div className="h-screen w-64 bg-dark-card/90 backdrop-blur-xl border-r border-white/10 flex flex-col fixed left-0 top-0 z-50">
            <div className="p-6">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">
                    ParkEase
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group ${isActive
                                ? "bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 text-white shadow-neon-purple border border-neon-purple/30"
                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <span className={`text-lg ${isActive ? "text-neon-purple drop-shadow-[0_0_5px_currentColor]" : "group-hover:text-neon-blue transition-colors"}`}>
                                {item.icon}
                            </span>
                            <span className="font-medium tracking-wide">{item.name}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-green shadow-[0_0_10px_#22c55e]"></div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <Link
                    to="/"
                    className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-neon-red/10 hover:text-neon-red transition-all"
                >
                    <FaSignOutAlt />
                    <span className="font-medium">Logout</span>
                </Link>
            </div>
        </div>
    );
}
