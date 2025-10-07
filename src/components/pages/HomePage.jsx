import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import UploadManager from "@/components/organisms/UploadManager";

const HomePage = () => {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
              <ApperIcon name="CloudUpload" size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-purple-600 bg-clip-text text-transparent">
              DropBox
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload files quickly and securely with real-time progress tracking. 
            Drag and drop or click to browse your files.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <UploadManager />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-4 bg-white rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <ApperIcon name="Shield" size={18} className="text-success" />
              <span className="text-sm text-gray-700 font-medium">Secure Upload</span>
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <div className="flex items-center gap-2">
              <ApperIcon name="Zap" size={18} className="text-warning" />
              <span className="text-sm text-gray-700 font-medium">Fast Processing</span>
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <div className="flex items-center gap-2">
              <ApperIcon name="CheckCircle2" size={18} className="text-info" />
              <span className="text-sm text-gray-700 font-medium">Reliable Storage</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;