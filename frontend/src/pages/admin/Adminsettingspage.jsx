import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

// ── Toggle ────────────────────────────────────────────────────────────────────
const Toggle = ({ value, onChange }) => (
  <div
    onClick={() => onChange(!value)}
    style={{
      width: 46, height: 26, borderRadius: 13,
      background: value ? "#3b82f6" : "rgba(255,255,255,0.15)",
      position: "relative", cursor: "pointer",
      transition: "background 0.2s", flexShrink: 0,
    }}
  >
    <div style={{
      position: "absolute", top: 3,
      left: value ? 23 : 3,
      width: 20, height: 20, borderRadius: "50%",
      background: "white", transition: "left 0.2s",
      boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
    }} />
  </div>
);

// ── Dropdown ──────────────────────────────────────────────────────────────────
const Dropdown = ({ value, onChange, options }) => (
  <div style={{ position: "relative" }}>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        appearance: "none", background: "#1e2638",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
        color: "#e2e8f0", padding: "8px 36px 8px 14px",
        fontSize: 14, fontFamily: "inherit",
        cursor: "pointer", outline: "none", minWidth: 140,
      }}
    >
      {options.map((o) => (
        <option key={o} value={o} style={{ background: "#1e2638" }}>{o}</option>
      ))}
    </select>
    <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", fontSize: 10 }}>▼</div>
  </div>
);

// ── Card ──────────────────────────────────────────────────────────────────────
const Card = ({ title, subtitle, children, accentColor }) => (
  <div style={{
    background: "#131c2e",
    border: `1px solid ${accentColor ? accentColor + "30" : "rgba(255,255,255,0.07)"}`,
    borderRadius: 12, marginBottom: 16, overflow: "hidden",
  }}>
    {title && (
      <div style={{ padding: "20px 24px 0", display: "flex", alignItems: "center", gap: 10 }}>
        {accentColor && <div style={{ width: 4, height: 20, borderRadius: 2, background: accentColor }} />}
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0" }}>{title}</div>
          {subtitle && <div style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>{subtitle}</div>}
        </div>
      </div>
    )}
    <div>{children}</div>
  </div>
);

// ── Row ───────────────────────────────────────────────────────────────────────
const Row = ({ label, sublabel, right, noBorder, danger }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 24px",
    borderBottom: noBorder ? "none" : "1px solid rgba(255,255,255,0.05)",
    gap: 16,
  }}>
    <div>
      <div style={{ fontSize: 14, fontWeight: 500, color: danger ? "#ef4444" : "#e2e8f0" }}>{label}</div>
      {sublabel && <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{sublabel}</div>}
    </div>
    <div style={{ flexShrink: 0 }}>{right}</div>
  </div>
);

// ── PassInput ─────────────────────────────────────────────────────────────────
const PassInput = ({ label, value, onChange, placeholder }) => (
  <div>
    <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
      {label}
    </label>
    <input
      type="password" value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width: "100%", background: "#1a2235", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "12px 14px", color: "#e2e8f0", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
      onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
      onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
    />
  </div>
);

// ── TextInput ─────────────────────────────────────────────────────────────────
const TextInput = ({ label, value, onChange, placeholder, half }) => (
  <div style={{ flex: half ? "1 1 calc(50% - 8px)" : "1 1 100%" }}>
    {label && <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{label}</label>}
    <input
      value={value} onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width: "100%", background: "#1a2235", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "12px 14px", color: "#e2e8f0", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
      onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
      onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
    />
  </div>
);

// ── Buttons ───────────────────────────────────────────────────────────────────
const PrimaryBtn = ({ children, onClick, color }) => (
  <button onClick={onClick} style={{
    background: color === "red" ? "linear-gradient(135deg,#ef4444,#dc2626)"
      : color === "green" ? "linear-gradient(135deg,#22c55e,#16a34a)"
      : "#3b82f6",
    color: "white", border: "none", borderRadius: 8,
    padding: "11px 24px", fontSize: 14, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit",
    boxShadow: color === "red" ? "0 0 20px rgba(239,68,68,0.25)"
      : color === "green" ? "0 0 20px rgba(34,197,94,0.25)"
      : "none",
  }}>
    {children}
  </button>
);

const SecondaryBtn = ({ children, onClick }) => (
  <button onClick={onClick} style={{
    background: "transparent", color: "#94a3b8", border: "none",
    borderRadius: 8, padding: "11px 20px", fontSize: 14,
    fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
  }}>
    {children}
  </button>
);

// ── Status Badge ──────────────────────────────────────────────────────────────
const Badge = ({ label, color }) => {
  const colors = {
    green:  { bg: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.25)",  text: "#22c55e" },
    red:    { bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.25)",   text: "#ef4444" },
    blue:   { bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.25)",  text: "#60a5fa" },
    yellow: { bg: "rgba(234,179,8,0.12)",   border: "rgba(234,179,8,0.25)",   text: "#f59e0b" },
  };
  const c = colors[color] || colors.blue;
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, color: c.text, background: c.bg, border: `1px solid ${c.border}` }}>
      {label}
    </span>
  );
};

// ── TABS ──────────────────────────────────────────────────────────────────────
const TABS = ["General", "User Management", "System", "Notifications", "Security"];

// ── Admin Settings Content ────────────────────────────────────────────────────
function AdminSettingsContent() {
  const [activeTab, setActiveTab] = useState("General");

  // General
  const [siteName, setSiteName]       = useState("ParkEase");
  const [adminName, setAdminName]     = useState("Administrator");
  const [adminEmail, setAdminEmail]   = useState("admin@parkease.com");
  const [adminPhone, setAdminPhone]   = useState("+91 98765 00000");
  const [timezone, setTimezone]       = useState("India Standard Time (IST, UTC+5:30)");
  const [currency, setCurrency]       = useState("INR (₹)");
  const [language, setLanguage]       = useState("English");

  // User Management
  const [autoApprove, setAutoApprove]         = useState(false);
  const [ownerVerify, setOwnerVerify]         = useState(true);
  const [maxBookingHrs, setMaxBookingHrs]     = useState("4 hours");
  const [gracePeriod, setGracePeriod]         = useState("10 mins");
  const [allowGuestBook, setAllowGuestBook]   = useState(false);

  // System
  const [maintenance, setMaintenance]         = useState(false);
  const [debugMode, setDebugMode]             = useState(false);
  const [aiPredictions, setAiPredictions]     = useState(true);
  const [liveTracking, setLiveTracking]       = useState(true);
  const [ghostSlotAlert, setGhostSlotAlert]   = useState(true);
  const [dataRetention, setDataRetention]     = useState("90 days");
  const [backupFreq, setBackupFreq]           = useState("Daily");

  // Notifications
  const [notif, setNotif] = useState({
    newUser: true,
    ownerRequest: true,
    ghostSlot: true,
    revenueReport: true,
    systemAlert: true,
    emailDigest: false,
    sms: true,
  });

  // Security
  const [twoFA, setTwoFA]               = useState(true);
  const [loginAlert, setLoginAlert]     = useState(true);
  const [ipWhitelist, setIpWhitelist]   = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30 mins");
  const [currPass, setCurrPass]         = useState("");
  const [newPass, setNewPass]           = useState("");
  const [confPass, setConfPass]         = useState("");

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#e2e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        input::placeholder { color: #475569; }
        select option { background: #1e2638; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>Admin Settings</h1>
          <p style={{ fontSize: 13, color: "#64748b" }}>System configuration and platform management</p>
        </div>
        {/* Stat pills matching admin dashboard */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Total Users", value: "5",     color: "#3b82f6" },
            { label: "Ghost Slots", value: "2",     color: "#ef4444" },
            { label: "Revenue",     value: "$1,240", color: "#22c55e" },
          ].map(s => (
            <div key={s.label} style={{ background: "#131c2e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "8px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 24, flexWrap: "wrap" }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? "#3b82f6" : "transparent",
              color: activeTab === tab ? "white" : "#94a3b8",
              border: "none", borderRadius: "8px 8px 0 0",
              padding: "10px 20px", fontSize: 14,
              fontWeight: activeTab === tab ? 600 : 500,
              cursor: "pointer", fontFamily: "inherit",
              marginBottom: "-1px", transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── GENERAL ── */}
      {activeTab === "General" && (
        <div>
          <Card title="Platform Identity" subtitle="Core details about your ParkEase platform" accentColor="#3b82f6">
            {/* Admin avatar row */}
            <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16,
                background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26, fontWeight: 700, color: "white", flexShrink: 0,
              }}>A</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>{adminName}</div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{adminEmail}</div>
                <div style={{ marginTop: 8 }}><Badge label="ADMIN" color="blue" /></div>
              </div>
            </div>

            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
                <TextInput label="Platform Name"    value={siteName}    onChange={setSiteName}    placeholder="ParkEase" half />
                <TextInput label="Admin Name"       value={adminName}   onChange={setAdminName}   placeholder="Administrator" half />
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
                <TextInput label="Admin Email"      value={adminEmail}  onChange={setAdminEmail}  placeholder="admin@parkease.com" half />
                <TextInput label="Phone Number"     value={adminPhone}  onChange={setAdminPhone}  placeholder="+91 XXXXX XXXXX" half />
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 calc(33% - 8px)" }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>TIMEZONE</label>
                  <Dropdown value={timezone} onChange={setTimezone} options={["India Standard Time (IST, UTC+5:30)", "Mumbai / Delhi / Kolkata", "UTC", "EST (UTC-5)", "PST (UTC-8)"]} />
                </div>
                <div style={{ flex: "1 1 calc(33% - 8px)" }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>CURRENCY</label>
                  <Dropdown value={currency} onChange={setCurrency} options={["INR (₹)", "USD ($)", "EUR (€)"]} />
                </div>
                <div style={{ flex: "1 1 calc(33% - 8px)" }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>LANGUAGE</label>
                  <Dropdown value={language} onChange={setLanguage} options={["English", "Hindi", "Marathi"]} />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, padding: "12px 24px 20px" }}>
              <PrimaryBtn>Save Changes</PrimaryBtn>
              <SecondaryBtn>Discard</SecondaryBtn>
            </div>
          </Card>

          {/* Live stats matching admin dashboard cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {[
              { label: "TOTAL USERS",  value: "5",     sub: "+12% vs last week", color: "#3b82f6", bg: "rgba(59,130,246,0.08)"  },
              { label: "GHOST SLOTS",  value: "2",     sub: "-5% vs last week",  color: "#ef4444", bg: "rgba(239,68,68,0.08)"   },
              { label: "OCCUPANCY",    value: "50%",   sub: "+8% vs last week",  color: "#8b5cf6", bg: "rgba(139,92,246,0.08)"  },
              { label: "REVENUE",      value: "$1,240", sub: "+24% vs last week", color: "#22c55e", bg: "rgba(34,197,94,0.08)"  },
            ].map(s => (
              <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.color}30`, borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: s.color, marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── USER MANAGEMENT ── */}
      {activeTab === "User Management" && (
        <div>
          <Card title="Registration & Approval" subtitle="Control how users and owners join the platform" accentColor="#3b82f6">
            <Row label="Auto-Approve Users"         sublabel="Automatically approve new user registrations"         right={<Toggle value={autoApprove}   onChange={setAutoApprove} />} />
            <Row label="Owner Verification Required" sublabel="Manually verify parking owners before they go live"   right={<Toggle value={ownerVerify}   onChange={setOwnerVerify} />} />
            <Row label="Allow Guest Bookings"        sublabel="Let unregistered users browse (not book) parking"     right={<Toggle value={allowGuestBook} onChange={setAllowGuestBook} />} noBorder />
          </Card>

          <Card title="Booking Rules" subtitle="Platform-wide booking restrictions">
            <Row label="Max Booking Duration" sublabel="Maximum time a slot can be booked at once"    right={<Dropdown value={maxBookingHrs} onChange={setMaxBookingHrs} options={["2 hours","4 hours","6 hours","12 hours","24 hours"]} />} />
            <Row label="Grace Period"         sublabel="Buffer time after booking expiry"              right={<Dropdown value={gracePeriod}   onChange={setGracePeriod}   options={["5 mins","10 mins","15 mins","30 mins"]} />} noBorder />
          </Card>

          {/* Recent users table */}
          <Card title="Recent Users" subtitle="Latest registered accounts">
            {[
              { name: "Rishi Kumar",  role: "USER",  email: "rishi@example.com",  status: "Active",  joined: "Feb 24" },
              { name: "Meena Patil",  role: "USER",  email: "meena@example.com",  status: "Active",  joined: "Feb 22" },
              { name: "Arjun Shah",   role: "OWNER", email: "arjun@example.com",  status: "Pending", joined: "Feb 20" },
              { name: "Priya Singh",  role: "USER",  email: "priya@example.com",  status: "Active",  joined: "Feb 18" },
              { name: "Vikram Joshi", role: "OWNER", email: "vikram@example.com", status: "Active",  joined: "Feb 15" },
            ].map((u, i) => (
              <Row
                key={i}
                label={u.name}
                sublabel={`${u.email} · Joined ${u.joined}`}
                right={
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Badge label={u.role}   color={u.role === "OWNER" ? "yellow" : "blue"} />
                    <Badge label={u.status} color={u.status === "Active" ? "green" : "yellow"} />
                    <button style={{ background: "transparent", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                      Suspend
                    </button>
                  </div>
                }
                noBorder={i === 4}
              />
            ))}
          </Card>
        </div>
      )}

      {/* ── SYSTEM ── */}
      {activeTab === "System" && (
        <div>
          <Card title="Platform Controls" subtitle="Core system switches — use with caution" accentColor="#ef4444">
            <Row label="Maintenance Mode" sublabel="Take the platform offline for all users"          right={<Toggle value={maintenance} onChange={setMaintenance} />} danger={maintenance} />
            <Row label="Debug Mode"       sublabel="Enable verbose logging for troubleshooting"       right={<Toggle value={debugMode}   onChange={setDebugMode} />} />
            <Row label="AI Predictions"   sublabel="Enable ML-powered parking availability forecasts" right={<Toggle value={aiPredictions} onChange={setAiPredictions} />} />
            <Row label="Live Tracking"    sublabel="Real-time occupancy updates across all locations"  right={<Toggle value={liveTracking}  onChange={setLiveTracking} />} />
            <Row label="Ghost Slot Alerts" sublabel="Flag slots booked but not physically occupied"   right={<Toggle value={ghostSlotAlert} onChange={setGhostSlotAlert} />} noBorder />
          </Card>

          <Card title="Data Management" subtitle="Storage, backups and retention policies">
            <Row label="Data Retention"   sublabel="How long to keep booking and user records"  right={<Dropdown value={dataRetention} onChange={setDataRetention} options={["30 days","60 days","90 days","1 year","Forever"]} />} />
            <Row label="Backup Frequency" sublabel="How often the system backs up its data"     right={<Dropdown value={backupFreq}    onChange={setBackupFreq}    options={["Hourly","Daily","Weekly"]} />} noBorder />
          </Card>

          {/* Live parking status mini view — matching admin dashboard */}
          <Card title="Live System Status" subtitle="Real-time occupancy across all locations">
            {[
              { name: "City Mall",  slots: 72, total: 100, pct: 72,  color: "#f59e0b" },
              { name: "Tech Park",  slots: 45, total: 80,  pct: 56,  color: "#3b82f6" },
              { name: "Station Rd", slots: 90, total: 120, pct: 75,  color: "#f59e0b" },
              { name: "Airport",    slots: 30, total: 60,  pct: 50,  color: "#3b82f6" },
            ].map((loc, i) => (
              <div key={loc.name} style={{ padding: "14px 24px", borderBottom: i === 3 ? "none" : "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#e2e8f0" }}>{loc.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: loc.color }}>{loc.slots}/{loc.total} ({loc.pct}%)</span>
                </div>
                <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${loc.pct}%`, height: "100%", background: loc.color, borderRadius: 3, transition: "width 0.4s" }} />
                </div>
              </div>
            ))}
          </Card>

          {maintenance && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: "16px 20px", display: "flex", gap: 14, alignItems: "center" }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#ef4444" }}>Maintenance Mode is ON</div>
                <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>All users are currently blocked from accessing the platform.</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── NOTIFICATIONS ── */}
      {activeTab === "Notifications" && (
        <div>
          <Card title="Admin Alerts" subtitle="Notify you of important platform events">
            <Row label="New User Registration"  sublabel="Alert when someone signs up"                        right={<Toggle value={notif.newUser}      onChange={(v) => setNotif(p => ({ ...p, newUser: v }))} />} />
            <Row label="Owner Requests"         sublabel="Notify when an owner applies for approval"          right={<Toggle value={notif.ownerRequest} onChange={(v) => setNotif(p => ({ ...p, ownerRequest: v }))} />} />
            <Row label="Ghost Slot Detected"    sublabel="Alert when a ghost slot is flagged by the system"   right={<Toggle value={notif.ghostSlot}    onChange={(v) => setNotif(p => ({ ...p, ghostSlot: v }))} />} />
            <Row label="System Alerts"          sublabel="Critical errors and uptime warnings"                 right={<Toggle value={notif.systemAlert}  onChange={(v) => setNotif(p => ({ ...p, systemAlert: v }))} />} noBorder />
          </Card>

          <Card title="Reports" subtitle="Scheduled summaries and analytics">
            <Row label="Revenue Reports"  sublabel="Get daily/weekly revenue summaries"    right={<Toggle value={notif.revenueReport} onChange={(v) => setNotif(p => ({ ...p, revenueReport: v }))} />} />
            <Row label="Email Digest"     sublabel="Weekly platform activity roundup"      right={<Toggle value={notif.emailDigest}   onChange={(v) => setNotif(p => ({ ...p, emailDigest: v }))} />} noBorder />
          </Card>

          <Card title="Channels" subtitle="How admin notifications are delivered">
            <Row label="SMS Alerts"          sublabel="Text messages for critical events"  right={<Toggle value={notif.sms}   onChange={(v) => setNotif(p => ({ ...p, sms: v }))} />} />
            <Row label="Email Notifications" sublabel="Reports and alerts via email"       right={<Toggle value={notif.email} onChange={(v) => setNotif(p => ({ ...p, email: v }))} />} noBorder />
          </Card>

          {/* Ghost slot alert preview — matching admin dashboard style */}
          <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "16px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>⚠️</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Ghost Slot · <span style={{ color: "#ef4444" }}>2 Detected</span></div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 3 }}>Slots appear booked but physically empty. This is what your alert will look like.</div>
            </div>
          </div>
        </div>
      )}

      {/* ── SECURITY ── */}
      {activeTab === "Security" && (
        <div>
          <Card title="Authentication" subtitle="Protect the admin account" accentColor="#3b82f6">
            <Row label="Two-Factor Authentication" sublabel="Require a verification code at every login"    right={<Toggle value={twoFA}       onChange={setTwoFA} />} />
            <Row label="Login Activity Alerts"     sublabel="Get notified of any new sign-in attempts"      right={<Toggle value={loginAlert}  onChange={setLoginAlert} />} />
            <Row label="IP Whitelist"              sublabel="Only allow access from approved IP addresses"  right={<Toggle value={ipWhitelist} onChange={setIpWhitelist} />} />
            <Row label="Session Timeout"           sublabel="Auto-logout after inactivity"                  right={<Dropdown value={sessionTimeout} onChange={setSessionTimeout} options={["15 mins","30 mins","1 hour","4 hours"]} />} noBorder />
          </Card>

          <Card title="Change Password" subtitle="Update your admin password">
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
              <PassInput label="CURRENT PASSWORD"     value={currPass} onChange={setCurrPass} placeholder="••••" />
              <PassInput label="NEW PASSWORD"         value={newPass}  onChange={setNewPass}  placeholder="••••••" />
              <PassInput label="CONFIRM NEW PASSWORD" value={confPass} onChange={setConfPass} placeholder="••••••" />
              {newPass && confPass && newPass !== confPass && (
                <div style={{ fontSize: 12, color: "#ef4444" }}>Passwords do not match</div>
              )}
              <div style={{ display: "flex", gap: 12, paddingTop: 4 }}>
                <PrimaryBtn>Update Password</PrimaryBtn>
                <SecondaryBtn>Cancel</SecondaryBtn>
              </div>
            </div>
          </Card>

          <Card title="Active Sessions" subtitle="Devices signed into the admin panel">
            {[
              { device: "Chrome · Windows 11",      location: "Pune, MH",    time: "Now",          current: true },
              { device: "Firefox · MacOS",           location: "Mumbai, MH",  time: "2 hours ago",  current: false },
              { device: "ParkEase Admin · Android",  location: "Pune, MH",    time: "Yesterday",    current: false },
            ].map((s, i) => (
              <Row
                key={i}
                label={s.device}
                sublabel={`${s.location} · ${s.time}`}
                right={
                  s.current
                    ? <Badge label="Current" color="green" />
                    : <button style={{ fontSize: 11, color: "#ef4444", background: "transparent", border: "1px solid rgba(239,68,68,0.3)", padding: "3px 10px", borderRadius: 20, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Revoke</button>
                }
                noBorder={i === 2}
              />
            ))}
          </Card>

          {/* Danger Zone */}
          <Card title="Danger Zone" subtitle="Irreversible platform-level actions">
            <Row
              label="Reset All Platform Data"
              sublabel="Wipe all bookings, slots and user data permanently"
              right={<PrimaryBtn color="red">Reset</PrimaryBtn>}
              danger
            />
            <Row
              label="Export All Data"
              sublabel="Download a full backup of all platform data"
              right={
                <button style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)", color: "#60a5fa", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Export
                </button>
              }
              noBorder
            />
          </Card>
        </div>
      )}
    </div>
  );
}

// ── Main Export — wrapped in DashboardLayout with ADMIN role ──────────────────
export default function AdminSettingsPage() {
  return (
    <DashboardLayout role="ADMIN">
      <AdminSettingsContent />
    </DashboardLayout>
  );
}