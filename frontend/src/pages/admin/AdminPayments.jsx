import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import RevenueChart from "../../components/dashboard/RevenueChart";
import { FaMoneyBillWave, FaDownload, FaCheckCircle, FaTimesCircle, FaUndoAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const STATUS_STYLE = {
  SUCCESS:  "bg-neon-green/20 text-neon-green border-neon-green/30",
  FAILED:   "bg-neon-red/20 text-neon-red border-neon-red/30",
  REFUNDED: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const STATUS_ICON = {
  SUCCESS:  <FaCheckCircle  size={10} />,
  FAILED:   <FaTimesCircle  size={10} />,
  REFUNDED: <FaUndoAlt      size={10} />,
};

export default function AdminPayments() {
  const [filterStatus, setFilterStatus] = useState("ALL");

  const transactions = [
    { id: "TXN001", user: "Rishi Kumar",  parking: "City Mall Parking",  amount: "$15.00",  commission: "$1.50",  ownerEarning: "$13.50", date: "Feb 14, 2026", status: "SUCCESS"  },
    { id: "TXN002", user: "Suresh Patel", parking: "Hospital Parking",   amount: "$8.50",   commission: "$0.85",  ownerEarning: "$7.65",  date: "Feb 12, 2026", status: "SUCCESS"  },
    { id: "TXN003", user: "Karan Dev",    parking: "Airport Terminal 1", amount: "$120.00", commission: "$12.00", ownerEarning: "$108.00",date: "Feb 10, 2026", status: "REFUNDED" },
    { id: "TXN004", user: "Neha Singh",   parking: "City Mall Parking",  amount: "$10.00",  commission: "$1.00",  ownerEarning: "$9.00",  date: "Feb 23, 2026", status: "SUCCESS"  },
    { id: "TXN005", user: "Suresh Patel", parking: "City Mall Parking",  amount: "$20.00",  commission: "$2.00",  ownerEarning: "$18.00", date: "Feb 21, 2026", status: "SUCCESS"  },
    { id: "TXN006", user: "Rishi Kumar",  parking: "Hospital Parking",   amount: "$6.00",   commission: "$0.60",  ownerEarning: "$5.40",  date: "Feb 8, 2026",  status: "FAILED"   },
  ];

  const ownerPayouts = [
    { owner: "Amit Shah",   parking: "City Mall Parking", gross: "$45.00", commission: "$4.50", payout: "$40.50" },
    { owner: "Priya Menon", parking: "Hospital Parking",  gross: "$14.50", commission: "$1.45", payout: "$13.05" },
  ];

  const parseDollar = (str) => parseFloat(str.replace("$", "")) || 0;

  const totalRevenue    = transactions.filter(t => t.status === "SUCCESS" ).reduce((s, t) => s + parseDollar(t.amount),     0).toFixed(2);
  const totalCommission = transactions.filter(t => t.status === "SUCCESS" ).reduce((s, t) => s + parseDollar(t.commission), 0).toFixed(2);
  const totalRefunds    = transactions.filter(t => t.status === "REFUNDED").reduce((s, t) => s + parseDollar(t.amount),     0).toFixed(2);

  const filtered = filterStatus === "ALL" ? transactions : transactions.filter(t => t.status === filterStatus);

  const exportCSV = () => {
    const header = "TXN ID,User,Parking,Amount,Commission,Owner Earning,Date,Status";
    const rows = transactions.map(t =>
      `${t.id},${t.user},${t.parking},${t.amount},${t.commission},${t.ownerEarning},${t.date},${t.status}`
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "parkease_transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout role="ADMIN" userInfo={{ name: "Administrator", role: "ADMIN" }}>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Revenue & Payments</h2>
          <p className="text-gray-400">Platform earnings, commissions and transactions</p>
        </div>
        <button
          onClick={exportCSV}
          className="px-5 py-3 bg-neon-blue/20 text-neon-blue font-bold rounded-xl border border-neon-blue/30 hover:bg-neon-blue hover:text-white transition-all flex items-center gap-2 text-sm"
        >
          <FaDownload /> Export CSV
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Revenue"             value={`$${totalRevenue}`}    icon={<FaMoneyBillWave />} color="green"  trend={24} />
        <StatCard title="Platform Commission (10%)" value={`$${totalCommission}`} icon={<FaMoneyBillWave />} color="purple" trend={18} />
        <StatCard title="Total Refunds"             value={`$${totalRefunds}`}    icon={<FaUndoAlt />}       color="red" />
      </div>

      {/* REVENUE CHART — reuses existing component */}
      <div className="mb-8">
        <RevenueChart />
      </div>

      {/* OWNER PAYOUT BREAKDOWN */}
      <div className="bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 mb-8">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-8 rounded-full bg-neon-purple inline-block"></span>
          Owner Payout Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Parking</th>
                <th className="py-3 px-4">Gross Revenue</th>
                <th className="py-3 px-4">Commission (10%)</th>
                <th className="py-3 px-4 text-right">Net Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ownerPayouts.map((o, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-white font-semibold">{o.owner}</td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{o.parking}</td>
                  <td className="py-3 px-4 text-white">{o.gross}</td>
                  <td className="py-3 px-4 text-neon-red">{o.commission}</td>
                  <td className="py-3 px-4 text-right font-bold text-neon-green">{o.payout}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b border-white/5">
          <h3 className="text-xl font-bold text-white">All Transactions</h3>
          <div className="bg-dark-bg/60 border border-white/10 rounded-lg p-1 flex">
            {["ALL", "SUCCESS", "REFUNDED", "FAILED"].map(tab => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filterStatus === tab ? "bg-neon-blue text-white" : "text-gray-400 hover:text-white"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-white/10 bg-white/5">
                <th className="py-4 px-6">TXN ID</th>
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Parking</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Commission</th>
                <th className="py-4 px-6">Owner Gets</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(t => (
                <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-mono text-xs text-gray-400">{t.id}</td>
                  <td className="py-4 px-6 text-white font-medium text-sm">{t.user}</td>
                  <td className="py-4 px-6 text-gray-400 text-sm">{t.parking}</td>
                  <td className="py-4 px-6 text-white font-bold">{t.amount}</td>
                  <td className="py-4 px-6 text-neon-red text-sm">{t.commission}</td>
                  <td className="py-4 px-6 text-neon-green text-sm font-semibold">{t.ownerEarning}</td>
                  <td className="py-4 px-6 text-gray-400 text-sm">{t.date}</td>
                  <td className="py-4 px-6 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1 ${STATUS_STYLE[t.status]}`}>
                      {STATUS_ICON[t.status]} {t.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="8" className="py-12 text-center text-gray-500">No transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}