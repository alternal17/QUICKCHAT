// src/components/RightSidebar.jsx
import React, { useMemo } from "react";
import assets from "../assets/assets";

const RightSidebar = ({ show = false, onClose = () => {}, selectedUser = null, messages = [] }) => {
  // derive media directly from props to avoid setState inside useEffect
  const media = useMemo(() => {
    if (!messages || !messages.length) return [];
    return messages.filter((m) => m && m.image).map((m) => m.image);
  }, [messages]);

  if (!selectedUser) return null;

  return (
    <div
      className={`absolute z-50 transform transition-all duration-200 ${
        show ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"
      }`}
      style={{ right: "1rem", bottom: "1rem" }}
      aria-hidden={!show}
    >
      <div className="w-[280px] bg-[#282142] text-white rounded-xl shadow-lg overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={selectedUser.profilePic || assets.avatar_icon}
              alt={selectedUser.fullName || "avatar"}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{selectedUser.fullName}</div>
              <div className="text-xs text-gray-300 truncate">{selectedUser.bio || ""}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedUser.online && <span className="w-2 h-2 rounded-full bg-green-400" />}
            <button
              onClick={onClose}
              className="text-sm text-gray-300 hover:text-white px-2 py-1 rounded"
              aria-label="Close profile panel"
            >
              Close
            </button>
          </div>
        </div>

        {/* media area */}
        <div className="p-3 max-h-[160px] overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium">Media</div>
            <div className="text-xs text-gray-400">{media.length} items</div>
          </div>

          {media.length ? (
            <div className="grid grid-cols-3 gap-2">
              {media.map((url, i) => (
                <button
                  key={i}
                  onClick={() => window.open(url, "_blank")}
                  className="block w-full h-16 rounded overflow-hidden focus:outline-none"
                  aria-label={`Open media ${i + 1}`}
                >
                  <img src={url} alt={`media-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-400">No media available</div>
          )}
        </div>

        {/* footer */}
        <div className="p-3 border-t border-white/6 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-red-400 to-red-600 text-white py-1 px-4 rounded-full text-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
