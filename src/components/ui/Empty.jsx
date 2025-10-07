import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data available",
  description = "Get started by adding some content",
  icon = "Inbox",
  action,
  actionLabel = "Get Started"
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 max-w-md mx-auto p-8"
      >
        <div className="inline-flex p-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full">
          <ApperIcon name={icon} size={64} className="text-gray-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
        {action && (
          <Button variant="primary" onClick={action} className="flex items-center gap-2 mx-auto">
            <ApperIcon name="Plus" size={18} />
            {actionLabel}
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default Empty;