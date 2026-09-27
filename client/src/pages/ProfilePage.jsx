
import React, { useState, useContext } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import imageCompression from "browser-image-compression"; // ✅ Add compression library

const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      let payload = { fullName: name, bio };

      if (selectedImg) {
        const base64Image = await readFileAsDataURL(selectedImg);
        payload.profilePic = base64Image;
      }

      await updateProfile(payload);
      navigate("/");
    } catch (err) {
      console.error("Profile update failed:", err);
      setError("Failed to update profile. Please check your connection or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div
        className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2
        border-gray-600 flex items-center justify-center max-sm:flex-col-reverse
        rounded-lg"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-lg font-semibold">Profile details</h3>

          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <img
              src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon}
              alt="Profile avatar"
              className={`w-16 h-16 border border-gray-500 ${selectedImg ? "rounded-full" : "rounded-md"}`}
            />
            <span className="text-sm">Upload profile image</span>
          </label>

          {/* ✅ File input with size check + compression */}
          <input
            onChange={async (e) => {
              const file = e.target.files?.[0] ?? null;
              if (file) {
                if (file.size > 5 * 1024 * 1024) {
                  setError("Image too large. Please choose a file under 5 MB.");
                  setSelectedImg(null);
                  return;
                }

                try {
                  // ✅ Compress image before storing
                  const options = {
                    maxSizeMB: 1, // target size ~1MB
                    maxWidthOrHeight: 1024, // resize dimensions
                    useWebWorker: true,
                  };
                  const compressedFile = await imageCompression(file, options);
                  setSelectedImg(compressedFile);
                  setError(null);
                } catch (err) {
                  console.error("Compression failed:", err);
                  setError("Failed to compress image. Try another file.");
                }
              } else {
                setSelectedImg(null);
              }
            }}
            type="file"
            id="avatar"
            accept=".png,.jpg,.jpeg"
            hidden
          />

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-gray-500 rounded-md bg-transparent text-white"
            placeholder="Full Name"
          />

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="p-2 border border-gray-500 rounded-md bg-transparent text-white"
            placeholder="Write a short bio..."
          />

          {/* ✅ Error message display */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>

        <img
          className="max-w-44 aspect-square rounded-full mx-10 sm:mt-10"
          src={  authUser?.profilePic ||assets.logo_icon}
          alt="logo"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
