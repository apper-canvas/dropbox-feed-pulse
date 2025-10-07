import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ProgressBar from "@/components/atoms/ProgressBar";
import Card from "@/components/atoms/Card";
import { formatFileSize, getFileIcon } from "@/utils/fileUtils";

const FileCard = ({ file, onRemove }) => {
  const getStatusColor = () => {
    switch (file.status) {
      case "complete":
        return "text-success";
      case "failed":
        return "text-error";
      case "uploading":
        return "text-primary";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = () => {
    switch (file.status) {
      case "complete":
        return "CheckCircle2";
      case "failed":
        return "XCircle";
      case "uploading":
        return "Loader2";
      default:
        return "Clock";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg flex-shrink-0">
              <ApperIcon 
                name={getFileIcon(file.type)} 
                size={24} 
                className="text-primary"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 truncate">{file.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">{formatFileSize(file.size)}</span>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1.5">
                  <ApperIcon 
                    name={getStatusIcon()} 
                    size={14} 
                    className={`${getStatusColor()} ${file.status === "uploading" ? "animate-spin" : ""}`}
                  />
                  <span className={`text-sm font-medium ${getStatusColor()}`}>
                    {file.status === "complete" && "Complete"}
                    {file.status === "failed" && "Failed"}
                    {file.status === "uploading" && "Uploading"}
                    {file.status === "pending" && "Pending"}
                  </span>
                </div>
              </div>
              {file.error && (
                <p className="text-sm text-error mt-1">{file.error}</p>
              )}
            </div>
          </div>
          {file.status !== "complete" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(file.id)}
              className="flex-shrink-0"
            >
              <ApperIcon name="X" size={16} />
            </Button>
          )}
        </div>

        {file.status === "uploading" && (
          <ProgressBar progress={file.progress} showPercentage={true} />
        )}

        {file.status === "complete" && file.uploadedUrl && (
          <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-success/5 to-emerald-50/50 rounded-lg border border-success/20">
            <ApperIcon name="Link" size={16} className="text-success flex-shrink-0" />
            <input
              type="text"
              value={file.uploadedUrl}
              readOnly
              className="flex-1 bg-transparent text-sm text-gray-700 outline-none font-mono"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(file.uploadedUrl);
              }}
              className="flex-shrink-0"
            >
              <ApperIcon name="Copy" size={16} />
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default FileCard;