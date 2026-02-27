import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/Landing_page";
import Login from "./pages/Login";
import Register from "./pages/Register";

import UserDashboard from "./pages/user/UserDashboard";
import ParkingSlots from "./pages/user/ParkingSlots";
import BookingHistory from "./pages/user/BookingHistory";

import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerSlots from "./pages/owner/OwnerSlots";
import OwnerBookings from "./pages/owner/OwnerBookings";
import AddParking from "./pages/owner/AddParking";
import ManageParkingSlots from "./pages/owner/ManageParkingSlots";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Placeholder from "./pages/Placeholder";

import SettingsPage from "./pages/user/Settingspage";

function App() {
  return (
    <Router>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/slots" element={<ParkingSlots />} />
        <Route path="/user/bookings" element={<BookingHistory />} />
        <Route path="/user/reservations" element={<BookingHistory />} />
        <Route path="/user/settings" element={<SettingsPage />} />

        {/* Owner Routes */}
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/add-parking" element={<AddParking />} />
        <Route path="/owner/slots" element={<OwnerSlots />} />
        <Route path="/owner/slots/:parkingId" element={<ManageParkingSlots />} />
        <Route path="/owner/bookings" element={<OwnerBookings />} />
        <Route path="/owner/bookings/:parkingId" element={<OwnerBookings />} />
        <Route path="/owner/settings" element={<Placeholder />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/settings" element={<Placeholder />} />

        {/* Placeholder Routes */}
        <Route path="/settings" element={<Placeholder />} />
        <Route path="/live-parking" element={<Placeholder />} />
        <Route path="/analytics" element={<Placeholder />} />
        <Route path="/reservations" element={<Placeholder />} />
        <Route path="/payments" element={<Placeholder />} />

      </Routes>
    </Router>
  );
}

export default App;