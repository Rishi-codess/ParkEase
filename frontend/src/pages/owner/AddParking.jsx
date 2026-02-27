import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { FaPlus, FaTrash, FaArrowLeft, FaParking } from "react-icons/fa";
import { motion } from "framer-motion";

const VEHICLE_TYPES = [
  { value: "CAR", label: "Car", prefix: "CAR" },
  { value: "BIKE", label: "Bike", prefix: "BIKE" },
  { value: "LARGE", label: "Large", prefix: "LRG" },
  { value: "SMALL", label: "Small", prefix: "SML" },
];

export default function AddParking() {
  const navigate = useNavigate();
  const [parkingName, setParkingName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [slotConfigs, setSlotConfigs] = useState([
    { vehicleType: "CAR", numberOfSlots: "", costPerHour: "" },
  ]);

  const addSlotConfig = () => {
    // Find next available vehicle type
    const usedTypes = slotConfigs.map((c) => c.vehicleType);
    const available = VEHICLE_TYPES.find((t) => !usedTypes.includes(t.value));
    if (!available) return;
    setSlotConfigs([
      ...slotConfigs,
      { vehicleType: available.value, numberOfSlots: "", costPerHour: "" },
    ]);
  };

  const removeSlotConfig = (index) => {
    if (slotConfigs.length === 1) return;
    setSlotConfigs(slotConfigs.filter((_, i) => i !== index));
  };

  const updateSlotConfig = (index, field, value) => {
    const updated = [...slotConfigs];
    updated[index] = { ...updated[index], [field]: value };
    setSlotConfigs(updated);
  };

  const generateSlots = () => {
    const slots = [];
    slotConfigs.forEach((config) => {
      const count = parseInt(config.numberOfSlots) || 0;
      const typeInfo = VEHICLE_TYPES.find((t) => t.value === config.vehicleType);
      for (let i = 1; i <= count; i++) {
        slots.push({
          slotId: `${typeInfo.prefix}-${String(i).padStart(2, "0")}`,
          vehicleType: config.vehicleType,
          vehicleTypeLabel: typeInfo.label,
          costPerHour: parseFloat(config.costPerHour) || 0,
          status: "AVAILABLE",
          disabled: false,
        });
      }
    });
    return slots;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate at least one slot config has values
    const hasValidConfig = slotConfigs.some(
      (c) => parseInt(c.numberOfSlots) > 0 && parseFloat(c.costPerHour) > 0
    );
    if (!hasValidConfig) {
      alert("Please add at least one slot configuration with valid values.");
      return;
    }

    const slots = generateSlots();
    const totalSlots = slots.length;

    const newParking = {
      id: `PKG-${Date.now()}`,
      name: parkingName,
      location,
      description,
      slotConfigs: slotConfigs
        .filter((c) => parseInt(c.numberOfSlots) > 0)
        .map((c) => ({
          vehicleType: c.vehicleType,
          vehicleTypeLabel: VEHICLE_TYPES.find((t) => t.value === c.vehicleType)?.label,
          numberOfSlots: parseInt(c.numberOfSlots),
          costPerHour: parseFloat(c.costPerHour),
        })),
      slots,
      totalSlots,
      occupied: 0,
      revenue: "₹0",
      occupancyRate: 0,
      peakHours: "N/A",
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem("ownerParkings") || "[]");
    existing.push(newParking);
    localStorage.setItem("ownerParkings", JSON.stringify(existing));

    navigate("/owner/dashboard");
  };

  return (
    <DashboardLayout role="OWNER">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/owner/dashboard")}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-all"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">Add New Parking</h2>
            <p className="text-gray-400">Configure your parking lot details and slot types</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FaParking className="text-neon-blue" /> Parking Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1.5">Parking Name *</label>
                <input
                  type="text"
                  value={parkingName}
                  onChange={(e) => setParkingName(e.target.value)}
                  placeholder="e.g. City Mall Parking"
                  required
                  className="w-full bg-dark-bg border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 focus:border-neon-blue outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1.5">Location *</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. City Center, Block A"
                  required
                  className="w-full bg-dark-bg border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 focus:border-neon-blue outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the parking lot..."
                  rows={3}
                  className="w-full bg-dark-bg border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 focus:border-neon-blue outline-none transition-colors resize-none"
                />
              </div>
            </div>
          </motion.div>

          {/* Slot Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-6 rounded-full bg-neon-purple"></span>
                Slot Configuration
              </h3>
              {slotConfigs.length < VEHICLE_TYPES.length && (
                <button
                  type="button"
                  onClick={addSlotConfig}
                  className="px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple border border-neon-purple/30 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
                >
                  <FaPlus className="text-xs" /> Add Type
                </button>
              )}
            </div>

            <div className="space-y-4">
              {slotConfigs.map((config, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/5 border border-white/5 rounded-xl p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                      <label className="block text-gray-400 text-xs mb-1.5 uppercase tracking-wider">
                        Vehicle Type
                      </label>
                      <select
                        value={config.vehicleType}
                        onChange={(e) => updateSlotConfig(index, "vehicleType", e.target.value)}
                        className="w-full bg-dark-bg border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue outline-none"
                      >
                        {VEHICLE_TYPES.map((t) => (
                          <option
                            key={t.value}
                            value={t.value}
                            disabled={
                              slotConfigs.some(
                                (c, i) => i !== index && c.vehicleType === t.value
                              )
                            }
                          >
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1.5 uppercase tracking-wider">
                        Number of Slots
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={config.numberOfSlots}
                        onChange={(e) => updateSlotConfig(index, "numberOfSlots", e.target.value)}
                        placeholder="e.g. 10"
                        required
                        className="w-full bg-dark-bg border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:border-neon-blue outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1.5 uppercase tracking-wider">
                        Cost / Hour (₹)
                      </label>
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={config.costPerHour}
                        onChange={(e) => updateSlotConfig(index, "costPerHour", e.target.value)}
                        placeholder="e.g. 5"
                        required
                        className="w-full bg-dark-bg border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:border-neon-blue outline-none"
                      />
                    </div>
                    <div className="flex items-center justify-end">
                      {slotConfigs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSlotConfig(index)}
                          className="p-3 rounded-lg bg-neon-red/10 hover:bg-neon-red/20 text-neon-red border border-neon-red/20 transition-all"
                          title="Remove"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Slot Preview */}
            {slotConfigs.some((c) => parseInt(c.numberOfSlots) > 0) && (
              <div className="mt-6 p-4 bg-dark-bg/50 rounded-xl border border-white/5">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Slot Preview</p>
                <div className="flex flex-wrap gap-2">
                  {generateSlots().map((slot) => (
                    <span
                      key={slot.slotId}
                      className="px-3 py-1.5 bg-neon-green/10 text-neon-green border border-neon-green/20 rounded-lg text-xs font-mono font-bold"
                    >
                      {slot.slotId}
                    </span>
                  ))}
                </div>
                <p className="text-gray-500 text-xs mt-3">
                  Total: {generateSlots().length} slots will be created
                </p>
              </div>
            )}
          </motion.div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/owner/dashboard")}
              className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-xl bg-neon-green hover:bg-green-400 text-black font-bold shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <FaPlus /> Create Parking
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
