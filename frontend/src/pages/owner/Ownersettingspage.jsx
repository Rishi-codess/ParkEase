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
        cursor: "pointer", outline: "none", minWidth: 130,
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
const Card = ({ title, subtitle, children, accent }) => (
  <div style={{
    background: "#131c2e",
    border: `1px solid ${accent ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.07)"}`,
    borderRadius: 12, marginBottom: 16, overflow: "hidden",
  }}>
    {title && (
      <div style={{ padding: "20px 24px 0", display: "flex", alignItems: "center", gap: 10 }}>
        {accent && <div style={{ width: 4, height: 20, borderRadius: 2, background: "#22c55e" }} />}
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
const Row = ({ label, sublabel, right, noBorder }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 24px",
    borderBottom: noBorder ? "none" : "1px solid rgba(255,255,255,0.05)",
    gap: 16,
  }}>
    <div>
      <div style={{ fontSize: 14, fontWeight: 500, color: "#e2e8f0" }}>{label}</div>
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
    <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
      {label}
    </label>
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
const PrimaryBtn = ({ children, onClick, green }) => (
  <button onClick={onClick} style={{
    background: green ? "linear-gradient(135deg,#22c55e,#16a34a)" : "#3b82f6",
    color: "white", border: "none", borderRadius: 8,
    padding: "11px 24px", fontSize: 14, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit",
    boxShadow: green ? "0 0 20px rgba(34,197,94,0.25)" : "none",
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

// ── TABS ──────────────────────────────────────────────────────────────────────
const TABS = ["Business Profile", "Parking Settings", "Notifications", "Security", "Billing"];

// ── Settings Content ──────────────────────────────────────────────────────────
function OwnerSettingsContent() {
  const [activeTab, setActiveTab] = useState("Business Profile");

  // Business Profile
  const [businessName, setBusinessName]   = useState("Owner's Parking Co.");
  const [ownerName, setOwnerName]         = useState("Owner");
  const [email, setEmail]                 = useState("owner@example.com");
  const [phone, setPhone]                 = useState("+91 98765 43210");
  const [gst, setGst]                     = useState("27AABCU9603R1ZX");
  const [address, setAddress]             = useState("Koregaon Park, Pune, Maharashtra");

  // Parking Settings
  const [currency, setCurrency]           = useState("INR (₹)");
  const [timeFormat, setTimeFormat]       = useState("12-hour");
  const [autoConfirm, setAutoConfirm]     = useState(true);
  const [instantPayout, setInstantPayout] = useState(false);
  const [gracePeriod, setGracePeriod]     = useState("10 mins");
  const [maxBooking, setMaxBooking]       = useState("4 hours");
  const [overbooking, setOverbooking]     = useState(false);

  // Notifications
  const [notif, setNotif] = useState({
    newBooking: true,
    cancellation: true,
    payoutAlert: true,
    peakTraffic: true,
    slotFull: true,
    weeklyReport: false,
    sms: true,
    email: true,
  });

  // Security
  const [twoFA, setTwoFA]         = useState(false);
  const [loginAlert, setLoginAlert] = useState(true);
  const [currPass, setCurrPass]   = useState("");
  const [newPass, setNewPass]     = useState("");
  const [confPass, setConfPass]   = useState("");

  // Billing
  const [payoutMethod, setPayoutMethod] = useState("Bank Transfer");
  const [bankName, setBankName]         = useState("HDFC Bank");
  const [accountNo, setAccountNo]       = useState("XXXX XXXX 4321");
  const [ifsc, setIfsc]                 = useState("HDFC0001234");

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
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>Settings</h1>
          <p style={{ fontSize: 13, color: "#64748b" }}>Manage your business preferences and account configuration</p>
        </div>
        {/* Green Add Parking style button matching owner dashboard */}
        <button style={{
          background: "linear-gradient(135deg,#22c55e,#16a34a)",
          color: "white", border: "none", borderRadius: 10,
          padding: "12px 24px", fontSize: 14, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit",
          boxShadow: "0 0 24px rgba(34,197,94,0.3)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          ✓ Save All Changes
        </button>
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

      {/* ── BUSINESS PROFILE ── */}
      {activeTab === "Business Profile" && (
        <div>
          <Card title="Business Information" subtitle="Your parking business details" accent>
            {/* Avatar / Business Logo row */}
            <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16,
                background: "linear-gradient(135deg,#22c55e,#16a34a)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26, fontWeight: 700, color: "white", flexShrink: 0,
              }}>
                🅿
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>{businessName}</div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{email}</div>
                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <PrimaryBtn green>Upload Logo</PrimaryBtn>
                  <SecondaryBtn>Remove</SecondaryBtn>
                </div>
              </div>
            </div>

            {/* Form */}
            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
                <TextInput label="Business Name"  value={businessName} onChange={setBusinessName} placeholder="Your business name" half />
                <TextInput label="Owner Name"     value={ownerName}    onChange={setOwnerName}    placeholder="Full name" half />
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
                <TextInput label="Email Address"  value={email}  onChange={setEmail}  placeholder="business@email.com" half />
                <TextInput label="Phone Number"   value={phone}  onChange={setPhone}  placeholder="+91 XXXXX XXXXX" half />
              </div>
              <div style={{ marginBottom: 16 }}>
                <TextInput label="GST Number" value={gst} onChange={setGst} placeholder="GST registration number" />
              </div>
              <TextInput label="Business Address" value={address} onChange={setAddress} placeholder="Full address" />
            </div>

            <div style={{ display: "flex", gap: 12, padding: "12px 24px 20px" }}>
              <PrimaryBtn green>Save Changes</PrimaryBtn>
              <SecondaryBtn>Discard</SecondaryBtn>
            </div>
          </Card>

          {/* Stats summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {[
              { label: "Total Parkings", value: "2", icon: "🅿", color: "#3b82f6" },
              { label: "Total Slots", value: "16", icon: "🚗", color: "#8b5cf6" },
              { label: "Active Bookings", value: "10", icon: "✅", color: "#22c55e" },
            ].map(s => (
              <div key={s.label} style={{ background: "#131c2e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "18px 20px" }}>
                <div style={{ fontSize: 22 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color, marginTop: 8 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PARKING SETTINGS ── */}
      {activeTab === "Parking Settings" && (
        <div>
          <Card title="Booking Configuration" subtitle="Control how bookings work at your lots">
            <Row label="Auto-Confirm Bookings"   sublabel="Automatically confirm new booking requests"          right={<Toggle value={autoConfirm}   onChange={setAutoConfirm} />} />
            <Row label="Allow Overbooking"        sublabel="Accept bookings beyond your listed slot count"       right={<Toggle value={overbooking}   onChange={setOverbooking} />} />
            <Row label="Grace Period"             sublabel="Time allowed after booking expiry before releasing"  right={<Dropdown value={gracePeriod}  onChange={setGracePeriod}  options={["5 mins","10 mins","15 mins","30 mins"]} />} />
            <Row label="Max Booking Duration"     sublabel="Maximum hours a slot can be booked at once"          right={<Dropdown value={maxBooking}   onChange={setMaxBooking}   options={["2 hours","4 hours","6 hours","12 hours","24 hours"]} />} noBorder />
          </Card>

          <Card title="Display Preferences" subtitle="How information is shown to customers">
            <Row label="Currency"    sublabel="Currency for displaying parking prices"    right={<Dropdown value={currency}   onChange={setCurrency}   options={["INR (₹)","USD ($)","EUR (€)"]} />} />
            <Row label="Time Format" sublabel="How time is displayed across the platform" right={<Dropdown value={timeFormat} onChange={setTimeFormat} options={["12-hour","24-hour"]} />} noBorder />
          </Card>

          <Card title="Payouts" subtitle="Configure your earnings and payout settings">
            <Row label="Instant Payouts" sublabel="Receive earnings immediately after each booking" right={<Toggle value={instantPayout} onChange={setInstantPayout} />} noBorder />
          </Card>

          <div style={{ display: "flex", gap: 12 }}>
            <PrimaryBtn green>Save Settings</PrimaryBtn>
            <SecondaryBtn>Reset to Default</SecondaryBtn>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS ── */}
      {activeTab === "Notifications" && (
        <div>
          <Card title="Booking Alerts" subtitle="Stay updated on your parking activity">
            <Row label="New Booking"         sublabel="Alert when a customer books your slot"          right={<Toggle value={notif.newBooking}    onChange={(v) => setNotif(p => ({ ...p, newBooking: v }))} />} />
            <Row label="Cancellation Alert"  sublabel="Notify when a booking is cancelled"             right={<Toggle value={notif.cancellation}  onChange={(v) => setNotif(p => ({ ...p, cancellation: v }))} />} />
            <Row label="Slot Full Alert"     sublabel="Alert when all your slots are occupied"         right={<Toggle value={notif.slotFull}      onChange={(v) => setNotif(p => ({ ...p, slotFull: v }))} />} noBorder />
          </Card>

          <Card title="Business Insights" subtitle="Reports and performance notifications">
            <Row label="Peak Traffic Warnings" sublabel="AI-powered alerts before high-demand periods"  right={<Toggle value={notif.peakTraffic}  onChange={(v) => setNotif(p => ({ ...p, peakTraffic: v }))} />} />
            <Row label="Payout Alerts"         sublabel="Notify when earnings are transferred"          right={<Toggle value={notif.payoutAlert}  onChange={(v) => setNotif(p => ({ ...p, payoutAlert: v }))} />} />
            <Row label="Weekly Summary Report" sublabel="Get a weekly breakdown of your earnings"       right={<Toggle value={notif.weeklyReport} onChange={(v) => setNotif(p => ({ ...p, weeklyReport: v }))} />} noBorder />
          </Card>

          <Card title="Communication Channels" subtitle="How you receive notifications">
            <Row label="SMS Alerts"         sublabel="Text messages to your registered mobile"  right={<Toggle value={notif.sms}   onChange={(v) => setNotif(p => ({ ...p, sms: v }))} />} />
            <Row label="Email Notifications" sublabel="Reports and receipts via email"           right={<Toggle value={notif.email} onChange={(v) => setNotif(p => ({ ...p, email: v }))} />} noBorder />
          </Card>

          {/* Peak traffic preview — matching owner dashboard orange style */}
          <div style={{ background: "linear-gradient(135deg,rgba(234,179,8,0.08),rgba(251,146,60,0.05))", border: "1px solid rgba(234,179,8,0.2)", borderRadius: 12, padding: "16px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(234,179,8,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>⚡</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Peak Traffic · <span style={{ color: "#f59e0b" }}>5–7 PM</span></div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 3 }}>High demand expected. Your lots will likely be full — ensure staff is available.</div>
            </div>
          </div>
        </div>
      )}

      {/* ── SECURITY ── */}
      {activeTab === "Security" && (
        <div>
          <Card title="Authentication" subtitle="Protect your business account">
            <Row label="Two-Factor Authentication" sublabel="Require a verification code when signing in" right={<Toggle value={twoFA}       onChange={setTwoFA} />} />
            <Row label="Login Activity Alerts"     sublabel="Get notified of any new sign-ins"            right={<Toggle value={loginAlert}  onChange={setLoginAlert} />} noBorder />
          </Card>

          <Card title="Password" subtitle="Update your account password">
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

          <Card title="Active Sessions" subtitle="Devices currently signed into your account">
            {[
              { device: "Chrome · Windows 11", location: "Pune, MH", time: "Now", current: true },
              { device: "ParkEase Owner App · Android", location: "Pune, MH", time: "3 hours ago", current: false },
            ].map((s, i) => (
              <Row
                key={i}
                label={s.device}
                sublabel={`${s.location} · ${s.time}`}
                right={
                  s.current
                    ? <span style={{ fontSize: 11, color: "#22c55e", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>Current</span>
                    : <button style={{ fontSize: 11, color: "#ef4444", background: "transparent", border: "1px solid rgba(239,68,68,0.3)", padding: "3px 10px", borderRadius: 20, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Revoke</button>
                }
                noBorder={i === 1}
              />
            ))}
          </Card>
        </div>
      )}

      {/* ── BILLING ── */}
      {activeTab === "Billing" && (
        <div>
          {/* Earnings summary */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[
              { label: "Today's Revenue", value: "$570", change: "+24%", color: "#22c55e" },
              { label: "This Week",       value: "$3,240", change: "+12%", color: "#3b82f6" },
            ].map(s => (
              <div key={s.label} style={{ background: "#131c2e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "20px 24px" }}>
                <div style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: s.color, marginTop: 4 }}>{s.change} vs last week</div>
              </div>
            ))}
          </div>

          <Card title="Payout Method" subtitle="Where your earnings are sent" accent>
            <div style={{ padding: "20px 24px" }}>
              {/* Method selector */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginBottom: 10 }}>PAYOUT METHOD</label>
                <div style={{ display: "flex", gap: 10 }}>
                  {["Bank Transfer", "UPI", "Wallet"].map(m => (
                    <div
                      key={m}
                      onClick={() => setPayoutMethod(m)}
                      style={{
                        flex: 1, padding: "10px 16px", borderRadius: 10, cursor: "pointer", textAlign: "center",
                        border: payoutMethod === m ? "1.5px solid #22c55e" : "1.5px solid rgba(255,255,255,0.08)",
                        background: payoutMethod === m ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.02)",
                        color: payoutMethod === m ? "#22c55e" : "#64748b",
                        fontSize: 13, fontWeight: 600, transition: "all 0.15s",
                      }}
                    >
                      {m}
                    </div>
                  ))}
                </div>
              </div>

              {payoutMethod === "Bank Transfer" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <TextInput label="BANK NAME"      value={bankName}  onChange={setBankName}  placeholder="Your bank" half />
                    <TextInput label="ACCOUNT NUMBER" value={accountNo} onChange={setAccountNo} placeholder="XXXX XXXX XXXX" half />
                  </div>
                  <TextInput label="IFSC CODE" value={ifsc} onChange={setIfsc} placeholder="HDFC0001234" />
                </div>
              )}
              {payoutMethod === "UPI" && (
                <TextInput label="UPI ID" value="owner@upi" onChange={() => {}} placeholder="yourname@upi" />
              )}
              {payoutMethod === "Wallet" && (
                <div style={{ padding: "14px", background: "rgba(255,255,255,0.03)", borderRadius: 8, fontSize: 13, color: "#94a3b8" }}>
                  Wallet payouts are processed automatically every 7 days.
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 12, padding: "0 24px 20px" }}>
              <PrimaryBtn green>Save Payout Details</PrimaryBtn>
              <SecondaryBtn>Cancel</SecondaryBtn>
            </div>
          </Card>

          <Card title="Transaction History" subtitle="Recent payouts to your account">
            {[
              { date: "Feb 24, 2026", amount: "$570",   status: "Paid",    ref: "TXN-00124" },
              { date: "Feb 17, 2026", amount: "$480",   status: "Paid",    ref: "TXN-00118" },
              { date: "Feb 10, 2026", amount: "$620",   status: "Paid",    ref: "TXN-00112" },
              { date: "Feb 03, 2026", amount: "$310",   status: "Pending", ref: "TXN-00106" },
            ].map((tx, i) => (
              <Row
                key={i}
                label={tx.ref}
                sublabel={tx.date}
                right={
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>{tx.amount}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                      color: tx.status === "Paid" ? "#22c55e" : "#f59e0b",
                      background: tx.status === "Paid" ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.12)",
                      border: `1px solid ${tx.status === "Paid" ? "rgba(34,197,94,0.25)" : "rgba(245,158,11,0.25)"}`,
                    }}>{tx.status}</span>
                  </div>
                }
                noBorder={i === 3}
              />
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}

// ── Main Export — wrapped in DashboardLayout with OWNER role ──────────────────
export default function OwnerSettingsPage() {
  return (
    <DashboardLayout role="OWNER">
      <OwnerSettingsContent />
    </DashboardLayout>
  );
}