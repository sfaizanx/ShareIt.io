import React, { useEffect, useState } from "react";

const TextModal = ({ isOpen, onClose, title = "Enter Text", socket, selectedUser}) => {
  if (!isOpen) return null;
  const [data, setData] = useState(null);

   const handleSend = () => {
    socket.emit("send-text", {
      to: selectedUser,
      text: data,
    });
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        backdropFilter: "blur(3px)",
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-3 relative transition-transform duration-300 scale-100"
        style={{
          border: "1px solid #e5e7eb",
          animation: "fadeIn 0.3s ease",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg font-semibold"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-3 text-center">
          {title}
        </h2>

        <div className="text-gray-600 text-sm text-center">
            <input type="text" className="border-2 border-black" autoFocus  onChange={(e)=>setData(e.target.value)} />
        </div>

        <div className="flex justify-center mt-5 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            style={{ minWidth: "90px" }}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            style={{ minWidth: "90px" }}
            onClick={()=>handleSend(data)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextModal;
