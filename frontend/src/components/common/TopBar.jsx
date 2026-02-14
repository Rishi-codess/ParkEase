import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";

export default function TopBar({ onSearch, searchTerm, userInfo, toggleProfile }) {
    return (
        <div className="fixed top-0 left-64 right-0 h-20 bg-dark-card/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-8 z-40">

            {/* SEARCH BAR */}
            <div className="relative w-96">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-neon-blue transition-colors" />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm || ""}
                    onChange={(e) => onSearch && onSearch(e.target.value)}
                    className="w-full bg-dark-bg/50 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-white outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
                />
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-6">

                {/* NOTIFICATIONS */}
                <button className="relative p-2 text-gray-400 hover:text-white transition-colors group">
                    <FaBell className="text-xl group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-neon-red rounded-full border-2 border-dark-card"></span>
                </button>

                {/* USER PROFILE */}
                <div onClick={toggleProfile} className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-white group-hover:text-neon-blue transition-colors">{userInfo?.name || "User"}</p>
                        <p className="text-xs text-gray-400">{userInfo?.role || "Member"}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue p-[2px]">
                        <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center overflow-hidden">
                            {userInfo?.avatar ? (
                                <img src={userInfo.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <FaUserCircle className="text-2xl text-gray-300" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
