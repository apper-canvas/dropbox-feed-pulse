import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import DropZone from "@/components/molecules/DropZone";
import FileCard from "@/components/molecules/FileCard";
import StatsBar from "@/components/molecules/StatsBar";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import { validateFile } from "@/utils/fileUtils";

const UploadManager = () => {
const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const { ApperClient } = window.ApperSDK;
  const apperClient = new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "file_id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "uploaded_url_c"}},
          {"field": {"Name": "error_c"}},
          {"field": {"Name": "timestamp_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await apperClient.fetchRecords('file_c', params);
      
      if (!response?.data?.length) {
        setFiles([]);
      } else {
        const mappedFiles = response.data.map(record => ({
          id: record.file_id_c,
          dbId: record.Id,
          file: null,
          name: record.name_c,
          size: record.size_c,
          type: record.type_c,
          status: record.status_c,
          progress: record.progress_c || 0,
          uploaded_url_c: record.uploaded_url_c,
          error: record.error_c,
          timestamp: new Date(record.timestamp_c)
        }));
        setFiles(mappedFiles);
      }
    } catch (error) {
      console.error("Error fetching files:", error?.response?.data?.message || error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };
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
        uploaded_url_c: null,
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

const simulateUpload = async (fileId, dbId) => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(async () => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve();
        }
        
        const currentProgress = Math.min(progress, 100);
        setFiles(prev =>
          prev.map(f =>
            f.id === fileId ? { ...f, progress: currentProgress } : f
          )
        );

        if (dbId) {
          try {
            await apperClient.updateRecord('file_c', {
              records: [{
                Id: dbId,
                progress_c: Math.floor(currentProgress),
                status_c: currentProgress < 100 ? "uploading" : "complete"
              }]
            });
          } catch (error) {
            console.error("Error updating progress:", error);
          }
        }
      }, 300);
    });
  };

const uploadFile = async (fileId) => {
    const file = files.find(f => f.id === fileId);
    
    try {
      const createParams = {
        records: [{
          file_id_c: fileId,
          name_c: file.name,
          size_c: file.size,
          type_c: file.type,
          status_c: "uploading",
          progress_c: 0,
          uploaded_url_c: null,
          error_c: null,
          timestamp_c: new Date().toISOString()
        }]
      };
      
      const createResponse = await apperClient.createRecord('file_c', createParams);
      
      if (!createResponse.success) {
        throw new Error(createResponse.message);
      }

      const dbId = createResponse.results[0].data.Id;
      
      setFiles(prev =>
        prev.map(f => (f.id === fileId ? { ...f, status: "uploading", dbId } : f))
      );

      await simulateUpload(fileId, dbId);
      
      const randomId = Math.random().toString(36).substring(7);
      const uploadedUrl = `https://cdn.dropbox.app/uploads/${randomId}/${file.name}`;

      const updateParams = {
        records: [{
          Id: dbId,
          status_c: "complete",
          progress_c: 100,
          uploaded_url_c: uploadedUrl
        }]
      };
      
      const updateResponse = await apperClient.updateRecord('file_c', updateParams);
      
      if (!updateResponse.success) {
        throw new Error(updateResponse.message);
      }

      setFiles(prev =>
        prev.map(f =>
          f.id === fileId
            ? { ...f, status: "complete", progress: 100, uploaded_url_c: uploadedUrl }
            : f
        )
      );

      toast.success(`${file.name} uploaded successfully!`);
    } catch (error) {
      console.error("Error uploading file:", error?.response?.data?.message || error);
      
      setFiles(prev =>
        prev.map(f =>
          f.id === fileId
            ? { ...f, status: "failed", error: "Upload failed" }
            : f
        )
      );
      
      if (file.dbId) {
        try {
          await apperClient.updateRecord('file_c', {
            records: [{
              Id: file.dbId,
              status_c: "failed",
              error_c: "Upload failed"
            }]
          });
        } catch (updateError) {
          console.error("Error updating failed status:", updateError);
        }
      }
      
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

const handleRemoveFile = async (fileId) => {
    const file = files.find(f => f.id === fileId);
    
    if (file?.dbId) {
      try {
        await apperClient.deleteRecord('file_c', {
          RecordIds: [file.dbId]
        });
      } catch (error) {
        console.error("Error deleting file record:", error);
      }
    }
    
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleClearCompleted = async () => {
    const completedFiles = files.filter(f => f.status === "complete");
    const dbIds = completedFiles.map(f => f.dbId).filter(id => id);
    
    if (dbIds.length > 0) {
      try {
        await apperClient.deleteRecord('file_c', {
          RecordIds: dbIds
        });
      } catch (error) {
        console.error("Error deleting completed files:", error);
      }
    }
    
    setFiles(prev => prev.filter(f => f.status !== "complete"));
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