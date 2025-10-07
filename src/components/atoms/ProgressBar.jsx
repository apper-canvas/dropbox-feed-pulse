import React from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const ProgressBar = React.forwardRef(({ 
  className, 
  progress = 0,
  showPercentage = true,
  ...props 
}, ref) => {
  return (
    <div ref={ref} className={cn("relative", className)} {...props}>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      {showPercentage && (
        <span className="absolute -top-6 right-0 text-sm font-semibold text-gray-700">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;