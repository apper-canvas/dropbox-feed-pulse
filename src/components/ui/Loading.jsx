import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-flex p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full"
        >
          <ApperIcon name="Loader2" size={48} className="text-primary" />
        </motion.div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">Loading...</h3>
          <p className="text-gray-600">Please wait while we prepare your content</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;