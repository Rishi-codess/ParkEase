import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import UserDashboard from "./pages/user/UserDashboard";
import ParkingSlots from "./pages/user/ParkingSlots";
import BookingHistory from "./pages/user/BookingHistory";

import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerSlots from "./pages/owner/OwnerSlots";
import OwnerBookings from "./pages/owner/OwnerBookings";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Placeholder from "./pages/Placeholder";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/slots" element={<ParkingSlots />} />
        <Route path="/user/bookings" element={<BookingHistory />} />

        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/slots" element={<OwnerSlots />} />
        <Route path="/owner/bookings" element={<OwnerBookings />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Placeholder Routes for Sidebar Links */}
        <Route path="/live-parking" element={<Placeholder />} />
        <Route path="/analytics" element={<Placeholder />} />
        <Route path="/reservations" element={<Placeholder />} />
        <Route path="/payments" element={<Placeholder />} />
        <Route path="/settings" element={<Placeholder />} />
      </Routes>
    </Router>
  );
}

export default App;
