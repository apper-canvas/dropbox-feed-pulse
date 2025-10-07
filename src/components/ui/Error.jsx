import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 max-w-md mx-auto p-8"
      >
        <div className="inline-flex p-6 bg-gradient-to-br from-error/10 to-red-50 rounded-full">
          <ApperIcon name="AlertCircle" size={64} className="text-error" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">Oops! Something went wrong</h3>
          <p className="text-gray-600">{message}</p>
        </div>
        {onRetry && (
          <Button variant="primary" onClick={onRetry} className="flex items-center gap-2 mx-auto">
            <ApperIcon name="RefreshCw" size={18} />
            Try Again
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default Error;