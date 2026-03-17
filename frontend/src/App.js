import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/Landing_page";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Placeholder from "./pages/Placeholder";
import ProtectedRoute from "./components/common/ProtectedRoute";

// ---------------- User Pages ----------------
import UserDashboard from "./pages/user/UserDashboard";
import ParkingSlots from "./pages/user/ParkingSlots";
import BookingHistory from "./pages/user/BookingHistory";
import PaymentPage from "./pages/user/PaymentPage";
import ActiveParking from "./pages/user/ActiveParking";
import FinalBillPage from "./pages/user/FinalBillPage";
import Settingspage from "./pages/user/Settingspage";
import PaymentsDashboard from "./pages/user/PaymentsDashboard";
import PaymentPage from "./pages/user/PaymentPage";
import ActiveParking from "./pages/user/ActiveParking";
import FinalBillPage from "./pages/user/FinalBillPage";
import SettingsPage from "./pages/user/Settingspage";

// ---------------- Owner Pages ----------------
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerSlots from "./pages/owner/OwnerSlots";
import OwnerBookings from "./pages/owner/OwnerBookings";
import OwnerSettingsPage from "./pages/owner/Ownersettingspage"; 
import AddParking from "./pages/owner/AddParking";
import ManageParkingSlots from "./pages/owner/ManageParkingSlots";

// ---------------- Admin Pages ----------------
import AdminDashboard from "./pages/admin/AdminDashboard";

import AdminSettingsPage from "./pages/admin/Adminsettingspage";

// ---------------- Placeholder ----------------
import Placeholder from "./pages/Placeholder";



// Role wrappers
const U = ({ children }) => (
  <ProtectedRoute role="USER">{children}</ProtectedRoute>
);

const O = ({ children }) => (
  <ProtectedRoute role="OWNER">{children}</ProtectedRoute>
);

const A = ({ children }) => (
  <ProtectedRoute role="ADMIN">{children}</ProtectedRoute>
);


function App() {
  return (
    <Router>
      <Routes>


        {/* ---------------- Landing ---------------- */}
        <Route path="/" element={<LandingPage />} />

        {/* ---------------- Auth ---------------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ---------------- User Routes ---------------- */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/slots" element={<ParkingSlots />} />
        <Route path="/user/bookings" element={<BookingHistory />} />
        <Route path="/user/payments" element={<PaymentPage />} />
        <Route path="/user/active-parking" element={<ActiveParking />} />
        <Route path="/user/final-bill" element={<FinalBillPage />} />
        <Route path="/user/settings" element={<Settingspage />} />

        {/* ---------------- Owner Routes ---------------- */}
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/slots" element={<OwnerSlots />} />
        <Route path="/owner/bookings" element={<OwnerBookings />} />
        <Route path="/owner/settings" element={<OwnerSettingsPage />} /> 

        {/* ---------------- Admin Routes ---------------- */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />

        {/* ---------------- Placeholder Routes ---------------- */}
        <Route path="/live-parking" element={<Placeholder />} />
        <Route path="/analytics" element={<Placeholder />} />
        <Route path="/reservations" element={<Placeholder />} />

        {/* -------- PUBLIC ROUTES -------- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* -------- USER ROUTES -------- */}
        <Route path="/user/dashboard" element={<U><UserDashboard /></U>} />
        <Route path="/user/slots/:parkingId" element={<U><ParkingSlots /></U>} />
        <Route path="/user/bookings" element={<U><BookingHistory /></U>} />
        <Route path="/user/payments" element={<U><PaymentsDashboard /></U>} />
        <Route path="/user/payment" element={<U><PaymentPage /></U>} />
        <Route path="/user/active-parking" element={<U><ActiveParking /></U>} />
        <Route path="/user/final-bill" element={<U><FinalBillPage /></U>} />
        <Route path="/user/settings" element={<U><SettingsPage role="USER" /></U>} />

        {/* -------- OWNER ROUTES -------- */}
        <Route path="/owner/dashboard" element={<O><OwnerDashboard /></O>} />
        <Route path="/owner/add-parking" element={<O><AddParking /></O>} />
        <Route path="/owner/slots" element={<O><OwnerSlots /></O>} />
        <Route path="/owner/slots/:parkingId" element={<O><ManageParkingSlots /></O>} />
        <Route path="/owner/bookings" element={<O><OwnerBookings /></O>} />
        <Route path="/owner/bookings/:parkingId" element={<O><OwnerBookings /></O>} />
        <Route path="/owner/settings" element={<O><SettingsPage role="OWNER" /></O>} />

        {/* -------- ADMIN ROUTES -------- */}
        <Route path="/admin/dashboard" element={<A><AdminDashboard /></A>} />
        <Route path="/admin/users" element={<A><AdminDashboard /></A>} />
        <Route path="/admin/parkings" element={<A><AdminDashboard /></A>} />
        <Route path="/admin/bookings" element={<A><AdminDashboard /></A>} />
        <Route path="/admin/revenue" element={<A><AdminDashboard /></A>} />
        <Route path="/admin/ghost-slots" element={<A><AdminDashboard /></A>} />
        <Route path="/admin/settings" element={<A><SettingsPage role="ADMIN" /></A>} />

        {/* -------- PLACEHOLDER ROUTES -------- */}
        <Route path="/settings" element={<Placeholder />} />
        <Route path="/live-parking" element={<Placeholder />} />
        <Route path="/analytics" element={<Placeholder />} />
        <Route path="/reservations" element={<Placeholder />} />
        <Route path="/payments" element={<Placeholder />} />

        {/* -------- 404 FALLBACK -------- */}
        <Route path="*" element={<Placeholder />} />


      </Routes>
    </Router>
  );
}

export default App;