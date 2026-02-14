export default function OccupancyChart({ occupied, total }) {
    const percentage = Math.round((occupied / total) * 100);
    const strokeDasharray = 2 * Math.PI * 40; // Approx 251
    const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

    return (
        <div className="bg-dark-card/60 border border-white/5 rounded-2xl p-6 backdrop-blur-xl flex flex-col items-center justify-center h-full">
            <h3 className="text-xl font-bold text-white mb-6 w-full text-left flex items-center gap-2">
                <span className="w-2 h-8 rounded-full bg-neon-purple"></span>
                Occupancy
            </h3>

            <div className="relative w-48 h-48">
                {/* SVG Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r="40"
                        className="stroke-gray-700 fill-none"
                        strokeWidth="8"
                    ></circle>
                    {/* Foreground Circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r="40"
                        className="stroke-neon-purple fill-none transition-all duration-1000 ease-out drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                        strokeWidth="8"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    ></circle>
                </svg>

                {/* Text in Center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white text-shadow-neon">{percentage}%</span>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Occupied</span>
                </div>
            </div>

            <div className="mt-6 w-full grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-dark-bg/50 rounded-lg">
                    <span className="block text-neon-green text-xl font-bold">{total - occupied}</span>
                    <span className="text-xs text-gray-500">Available</span>
                </div>
                <div className="p-3 bg-dark-bg/50 rounded-lg">
                    <span className="block text-neon-red text-xl font-bold">{occupied}</span>
                    <span className="text-xs text-gray-500">Occupied</span>
                </div>
            </div>
        </div>
    );
}
