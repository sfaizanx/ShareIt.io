/**
 * File utility helpers — type detection, icons, size formatting.
 */

/** Format file size to human-readable string */
export function formatFileSize(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/** Detect file category from MIME type */
export function getFileCategory(type) {
  if (!type) return "file";
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (type.includes("pdf")) return "pdf";
  if (type.includes("zip") || type.includes("rar") || type.includes("tar") || type.includes("gzip"))
    return "archive";
  if (type.includes("word") || type.includes("document")) return "document";
  if (type.includes("sheet") || type.includes("excel") || type.includes("csv")) return "spreadsheet";
  if (type.includes("presentation") || type.includes("powerpoint")) return "presentation";
  if (type.includes("text") || type.includes("json") || type.includes("xml") || type.includes("javascript"))
    return "code";
  return "file";
}

/** Get file extension from filename */
export function getFileExtension(filename) {
  if (!filename) return "";
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

/** Get a user-friendly time string */
export function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/** Generate initials from a name */
export function getInitials(name) {
  if (!name) return "?";
  return name.slice(0, 2).toUpperCase();
}

/** Generate a consistent color from a string (for avatar backgrounds) */
export function stringToColor(str) {
  if (!str) return "#6366f1";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
    "#06b6d4", "#14b8a6", "#f59e0b", "#10b981",
    "#3b82f6", "#a855f7", "#ef4444", "#0ea5e9",
  ];
  return colors[Math.abs(hash) % colors.length];
}
