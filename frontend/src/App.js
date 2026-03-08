import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage    from "./pages/Landing_page";
import Login          from "./pages/Login";
import Register       from "./pages/Register";

// USER
import UserDashboard     from "./pages/user/UserDashboard";
import ParkingSlots      from "./pages/user/ParkingSlots";
import BookingHistory    from "./pages/user/BookingHistory";
import ActiveParking     from "./pages/user/ActiveParking";
import PaymentPage       from "./pages/user/PaymentPage";
import PaymentsDashboard from "./pages/user/PaymentsDashboard";
import FinalBillPage     from "./pages/user/FinalBillPage";
import SettingsPage      from "./pages/user/Settingspage";

// OWNER
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerSlots     from "./pages/owner/OwnerSlots";
import OwnerBookings  from "./pages/owner/OwnerBookings";

// ADMIN
import AdminDashboard  from "./pages/admin/AdminDashboard";
import AdminUsers      from "./pages/admin/AdminUsers";
import AdminParkings   from "./pages/admin/AdminParkings";
import AdminBookings   from "./pages/admin/AdminBookings";
import AdminPayments   from "./pages/admin/AdminPayments";
import AdminGhostSlots from "./pages/admin/AdminGhostSlots";

import Placeholder from "./pages/Placeholder";

function App() {
  return (
    <Router>
      <Routes>

        {/* Public */}
        <Route path="/"         element={<LandingPage />} />
        <Route path="/login"    element={<Login />}       />
        <Route path="/register" element={<Register />}    />

        {/* User */}
        <Route path="/user/dashboard"      element={<UserDashboard />}     />
        <Route path="/user/slots"          element={<ParkingSlots />}      />
        <Route path="/user/bookings"       element={<BookingHistory />}    />
        <Route path="/user/active-parking" element={<ActiveParking />}     />
        <Route path="/user/payment"        element={<PaymentPage />}       />
        <Route path="/user/payments"       element={<PaymentsDashboard />} />
        <Route path="/user/final-bill"     element={<FinalBillPage />}     />
        <Route path="/user/settings"       element={<SettingsPage />}      />

        {/* Owner */}
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/slots"     element={<OwnerSlots />}     />
        <Route path="/owner/bookings"  element={<OwnerBookings />}  />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />}  />
        <Route path="/admin/users"     element={<AdminUsers />}      />
        <Route path="/admin/parkings"  element={<AdminParkings />}   />
        <Route path="/admin/bookings"  element={<AdminBookings />}   />
        <Route path="/admin/payments"  element={<AdminPayments />}   />
        <Route path="/admin/ghost"     element={<AdminGhostSlots />} />

        {/* Fallbacks */}
        <Route path="/live-parking" element={<Placeholder />} />
        <Route path="/analytics"    element={<Placeholder />} />
        <Route path="/reservations" element={<Placeholder />} />

      </Routes>
    </Router>
  );
}

export default App;