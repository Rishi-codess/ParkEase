import { Link } from "react-router-dom";
import { FaCar, FaList, FaHistory, FaUsers } from "react-icons/fa";

export default function Sidebar({ role }) {
  return (
    <aside className="w-64 p-6 text-white">
      <h2 className="text-2xl font-bold mb-8">ParkEase</h2>

      <nav className="space-y-3">

        {role === "USER" && (
          <>
            <Link className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10" to="/user/dashboard">
              <FaCar /> Find Parking
            </Link>

            <Link className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10" to="/user/bookings">
              <FaHistory /> My Bookings
            </Link>
          </>
        )}

        {role === "OWNER" && (
          <>
            <Link className="block p-3 rounded-lg hover:bg-white/10" to="/owner/dashboard">Dashboard</Link>
            <Link className="block p-3 rounded-lg hover:bg-white/10" to="/owner/slots">Manage Slots</Link>
            <Link className="block p-3 rounded-lg hover:bg-white/10" to="/owner/bookings">Bookings</Link>
          </>
        )}

        {role === "ADMIN" && (
          <Link className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10" to="/admin/dashboard">
            <FaUsers /> Admin Panel
          </Link>
        )}

      </nav>
    </aside>
  );
}
