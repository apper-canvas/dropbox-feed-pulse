import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const DropZone = ({ onFilesSelected, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
    e.target.value = "";
  };

  return (
    <motion.div
      className={cn(
        "relative border-3 border-dashed rounded-2xl transition-all duration-300",
        "bg-white",
        isDragging
          ? "border-primary bg-gradient-to-br from-indigo-50 to-purple-50 scale-[1.02]"
          : "border-gray-300 hover:border-primary/50 hover:bg-gray-50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      whileHover={!disabled ? { scale: 1.01 } : {}}
    >
      <div className="p-12 text-center space-y-6">
        <motion.div
          className="inline-flex p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full"
          animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
        >
          <ApperIcon 
            name={isDragging ? "Upload" : "CloudUpload"} 
            size={64} 
            className="text-primary"
          />
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {isDragging ? "Drop files here" : "Drop files to upload"}
          </h2>
          <p className="text-gray-600 text-lg">
            or click to browse from your device
          </p>
          <p className="text-sm text-gray-500">
            Supports images, documents, spreadsheets, and more • Max 50MB per file
          </p>
        </div>

        <div>
          <input
            type="file"
            multiple
            onChange={handleFileInput}
            disabled={disabled}
            className="hidden"
            id="file-input"
          />
          <label htmlFor="file-input">
            <Button
              as="span"
              variant="primary"
              size="lg"
              disabled={disabled}
              className="cursor-pointer inline-flex items-center gap-2"
            >
              <ApperIcon name="FolderOpen" size={20} />
              Choose Files
            </Button>
          </label>
        </div>
      </div>
    </motion.div>
  );
};

export default DropZone;