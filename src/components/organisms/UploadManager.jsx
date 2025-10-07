import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import DropZone from "@/components/molecules/DropZone";
import FileCard from "@/components/molecules/FileCard";
import StatsBar from "@/components/molecules/StatsBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { validateFile, generateMockUploadUrl } from "@/utils/fileUtils";

const UploadManager = () => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFilesSelected = (newFiles) => {
    const validatedFiles = newFiles.map((file) => {
      const validation = validateFile(file);
      const fileId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

      return {
        id: fileId,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: validation.isValid ? "pending" : "failed",
        progress: 0,
        uploadedUrl: null,
        error: validation.error,
        timestamp: new Date()
      };
    });

    const validFiles = validatedFiles.filter(f => f.status === "pending");
    const failedFiles = validatedFiles.filter(f => f.status === "failed");

    setFiles(prev => [...prev, ...validatedFiles]);

    if (failedFiles.length > 0) {
      toast.error(`${failedFiles.length} file(s) failed validation`);
    }

    if (validFiles.length > 0) {
      toast.success(`${validFiles.length} file(s) added to queue`);
    }
  };

  const simulateUpload = (fileId) => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve();
        }
        setFiles(prev =>
          prev.map(f =>
            f.id === fileId ? { ...f, progress: Math.min(progress, 100) } : f
          )
        );
      }, 300);
    });
  };

  const uploadFile = async (fileId) => {
    setFiles(prev =>
      prev.map(f => (f.id === fileId ? { ...f, status: "uploading" } : f))
    );

    try {
      await simulateUpload(fileId);
      
      const file = files.find(f => f.id === fileId);
      const uploadedUrl = generateMockUploadUrl(file.name);

      setFiles(prev =>
        prev.map(f =>
          f.id === fileId
            ? { ...f, status: "complete", progress: 100, uploadedUrl }
            : f
        )
      );

      toast.success(`${file.name} uploaded successfully!`);
    } catch (error) {
      setFiles(prev =>
        prev.map(f =>
          f.id === fileId
            ? { ...f, status: "failed", error: "Upload failed" }
            : f
        )
      );
      toast.error(`Failed to upload file`);
    }
  };

  const handleUploadAll = async () => {
    const pendingFiles = files.filter(f => f.status === "pending");
    if (pendingFiles.length === 0) {
      toast.info("No files to upload");
      return;
    }

    setIsUploading(true);
    
    for (const file of pendingFiles) {
      await uploadFile(file.id);
    }

    setIsUploading(false);
  };

  const handleRemoveFile = (fileId) => {
    const file = files.find(f => f.id === fileId);
    if (file.status === "uploading") {
      if (window.confirm("This file is currently uploading. Are you sure you want to cancel?")) {
        setFiles(prev => prev.filter(f => f.id !== fileId));
        toast.info("Upload cancelled");
      }
    } else {
      setFiles(prev => prev.filter(f => f.id !== fileId));
      toast.info("File removed from queue");
    }
  };

  const handleClearCompleted = () => {
    const completedCount = files.filter(f => f.status === "complete").length;
    if (completedCount === 0) {
      toast.info("No completed files to clear");
      return;
    }

    setFiles(prev => prev.filter(f => f.status !== "complete"));
    toast.success(`${completedCount} completed file(s) cleared`);
  };

  const stats = {
    totalFiles: files.length,
    completedFiles: files.filter(f => f.status === "complete").length,
    failedFiles: files.filter(f => f.status === "failed").length,
    totalSize: files.reduce((sum, f) => sum + f.size, 0)
  };

  const pendingFiles = files.filter(f => f.status === "pending");
  const activeFiles = files.filter(f => f.status !== "complete");
  const completedFiles = files.filter(f => f.status === "complete");

  return (
    <div className="space-y-8">
      <DropZone
        onFilesSelected={handleFilesSelected}
        disabled={isUploading}
      />

      {files.length > 0 && (
        <StatsBar
          totalFiles={stats.totalFiles}
          completedFiles={stats.completedFiles}
          failedFiles={stats.failedFiles}
          totalSize={stats.totalSize}
        />
      )}

      {activeFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              Upload Queue
              <span className="ml-2 text-sm font-medium text-gray-500">
                ({activeFiles.length} file{activeFiles.length !== 1 ? "s" : ""})
              </span>
            </h3>
            {pendingFiles.length > 0 && (
              <Button
                variant="primary"
                onClick={handleUploadAll}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                <ApperIcon name={isUploading ? "Loader2" : "Upload"} size={18} className={isUploading ? "animate-spin" : ""} />
                {isUploading ? "Uploading..." : `Upload ${pendingFiles.length} File${pendingFiles.length !== 1 ? "s" : ""}`}
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {activeFiles.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  onRemove={handleRemoveFile}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {completedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              Completed Uploads
              <span className="ml-2 text-sm font-medium text-success">
                ({completedFiles.length} file{completedFiles.length !== 1 ? "s" : ""})
              </span>
            </h3>
            <Button
              variant="ghost"
              onClick={handleClearCompleted}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Trash2" size={18} />
              Clear All
            </Button>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {completedFiles.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  onRemove={handleRemoveFile}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {files.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="inline-flex p-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full mb-4">
            <ApperIcon name="Inbox" size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No files uploaded yet
          </h3>
          <p className="text-gray-500">
            Drag and drop files above or click to browse
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default UploadManager;