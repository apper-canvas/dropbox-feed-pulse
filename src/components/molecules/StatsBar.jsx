import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatsBar = ({ totalFiles, completedFiles, failedFiles, totalSize }) => {
  const formatSize = (bytes) => {
    if (bytes === 0) return "0 MB";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const stats = [
    {
      label: "Total Files",
      value: totalFiles,
      icon: "Files",
      color: "from-primary to-secondary"
    },
    {
      label: "Completed",
      value: completedFiles,
      icon: "CheckCircle2",
      color: "from-success to-emerald-600"
    },
    {
      label: "Failed",
      value: failedFiles,
      icon: "XCircle",
      color: "from-error to-red-600"
    },
    {
      label: "Total Size",
      value: formatSize(totalSize),
      icon: "HardDrive",
      color: "from-info to-blue-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-5 bg-gradient-to-br from-white to-gray-50/50">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                <ApperIcon name={stat.icon} size={24} className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {stat.value}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsBar;