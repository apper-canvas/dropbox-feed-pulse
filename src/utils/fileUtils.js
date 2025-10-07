const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
  "application/zip",
  "application/x-zip-compressed"
];

export const validateFile = (file) => {
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds 50MB limit (${formatFileSize(file.size)})`
    };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `File type not supported (${file.type})`
    };
  }

  return { isValid: true, error: null };
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export const getFileIcon = (type) => {
  if (type.startsWith("image/")) return "Image";
  if (type.includes("pdf")) return "FileText";
  if (type.includes("word") || type.includes("document")) return "FileText";
  if (type.includes("excel") || type.includes("spreadsheet")) return "Sheet";
  if (type.includes("zip") || type.includes("compressed")) return "Archive";
  if (type.startsWith("text/")) return "FileCode";
  return "File";
};

export const generateMockUploadUrl = (filename) => {
  const randomId = Math.random().toString(36).substring(7);
  return `https://cdn.dropbox.app/uploads/${randomId}/${filename}`;
};