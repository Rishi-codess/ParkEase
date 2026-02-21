import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import UserDashboard from "./pages/user/UserDashboard";
import ParkingSlots from "./pages/user/ParkingSlots";
import BookingHistory from "./pages/user/BookingHistory";
import PaymentPage from "./pages/user/PaymentPage";
import ActiveParking from "./pages/user/ActiveParking";
import FinalBillPage from "./pages/user/FinalBillPage";
import PaymentsDashboard from "./pages/user/PaymentsDashboard";

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

                {/* User Routes */}
                <Route path="/user/dashboard" element={<UserDashboard />} />
                <Route path="/user/slots" element={<ParkingSlots />} />
                <Route path="/user/bookings" element={<BookingHistory />} />
                <Route path="/user/reservations" element={<BookingHistory />} />
                <Route path="/user/payment" element={<PaymentPage />} />
                <Route path="/user/active-parking" element={<ActiveParking />} />
                <Route path="/user/final-bill" element={<FinalBillPage />} />
                <Route path="/user/payments" element={<PaymentsDashboard />} />
                <Route path="/user/settings" element={<Placeholder />} />

                {/* Owner Routes */}
                <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                <Route path="/owner/slots" element={<OwnerSlots />} />
                <Route path="/owner/bookings" element={<OwnerBookings />} />
                <Route path="/owner/settings" element={<Placeholder />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/settings" element={<Placeholder />} />

                {/* Generic Placeholder Routes */}
                <Route path="/settings" element={<Placeholder />} />
                <Route path="/live-parking" element={<Placeholder />} />
                <Route path="/analytics" element={<Placeholder />} />
                <Route path="/reservations" element={<Placeholder />} />
            </Routes>
        </Router>
    );
}

export default App;

