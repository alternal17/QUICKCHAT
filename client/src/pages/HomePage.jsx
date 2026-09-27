// src/pages/HomePage.jsx
import React, { useContext } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import { ChatContext } from "../../context/ChatContext";

const HomePage = () => {
  const { selectedUser, setSelectedUser, messages } = useContext(ChatContext);

  // derive media from messages (images only)
  const media = (messages || []).filter((m) => m && m.image).map((m) => m.image);

  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : "md:grid-cols-2"
        }`}
      >
        {/* Left sidebar */}
        <div className="min-h-0">
          <Sidebar />
        </div>

        {/* Center chat column */}
        <div className="min-h-0">
          <ChatContainer />
        </div>

        {/* Right column reserved for profile + media (only when a user is selected) */}
        {selectedUser && (
          <aside className="min-h-0 border-l border-stone-700 bg-[#0f0d16]">
            {/* Profile header at the top of the right column */}
            <div className="p-4 border-b border-white/6 flex items-center gap-3">
              <img
                src={selectedUser.profilePic || "/src/assets/avatar_icon.png"}
                alt={selectedUser.fullName}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">
                  {selectedUser.fullName}
                </div>
                <div className="text-xs text-gray-300 truncate">{selectedUser.bio}</div>
                {selectedUser.online && (
                  <div className="text-xs text-green-400 mt-1">Online</div>
                )}
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="ml-auto text-sm text-gray-300 hover:text-white"
                aria-label="Close profile"
              >
                Close
              </button>
            </div>

            {/* Profile details (optional fields) */}
            <div className="p-4 text-sm text-gray-200">
              {selectedUser.location && (
                <div className="mb-2">
                  <div className="text-xs text-gray-400">Location</div>
                  <div className="text-sm">{selectedUser.location}</div>
                </div>
              )}
              {selectedUser.email && (
                <div className="mb-2">
                  <div className="text-xs text-gray-400">Email</div>
                  <div className="text-sm truncate">{selectedUser.email}</div>
                </div>
              )}
              {/* Add other profile fields here as needed */}
            </div>

            {/* Media section (fills remaining vertical space) */}
            <div className="p-4 overflow-y-auto flex-1">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-medium text-gray-200">Media</div>
                <div className="text-xs text-gray-400">{media.length} items</div>
              </div>

              {media.length ? (
                <div className="grid grid-cols-3 gap-2">
                  {media.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => window.open(url, "_blank")}
                      className="block w-full h-20 rounded overflow-hidden focus:outline-none"
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

            {/* Footer area intentionally removed (no Done button) */}
          </aside>
        )}
      </div>
    </div>
  );
};

export default HomePage;
