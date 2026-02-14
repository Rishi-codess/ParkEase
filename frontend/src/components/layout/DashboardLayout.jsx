import Sidebar from "../Sidebar";
import TopBar from "../common/TopBar";

export default function DashboardLayout({ children, role, onSearch, searchTerm, userInfo, toggleProfile }) {
  return (
    <div className="min-h-screen bg-dark-bg text-white flex">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content */}
      <main className="flex-1 ml-64 relative overflow-hidden bg-dark-bg">
        {/* Top Navigation Bar */}
        <TopBar
          onSearch={onSearch}
          searchTerm={searchTerm}
          userInfo={userInfo}
          toggleProfile={toggleProfile}
        />

        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-64 w-[500px] h-[500px] bg-neon-blue/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Page Content with Top Padding for Header */}
        <div className="relative z-10 p-8 pt-24 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}

