import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faSpinner, faCheck } from "@fortawesome/free-solid-svg-icons";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await api.put("/user", { name, username, email });
      setUser(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await api.post("/user/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(res.data);
    } catch (err) {
      setError("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-text mb-6">Profile</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-brand flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
            {user?.avatar ? <img src={`http://movie-night.test/storage/${user.avatar}`} alt={user.name} className="w-full h-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}
          </div>
          <label className="absolute bottom-0 right-0 w-7 h-7 bg-brand hover:bg-brand-dark rounded-full flex items-center justify-center cursor-pointer transition-colors">
            <FontAwesomeIcon icon={uploadingAvatar ? faSpinner : faCamera} spin={uploadingAvatar} size="xs" className="text-white" />
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </label>
        </div>
        <div>
          <p className="font-semibold text-text">{user?.name}</p>
          <p className="text-text-muted text-sm">@{user?.username}</p>
        </div>
      </div>

      {/* Error */}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">{error}</div>}

      {/* Form */}
      <form onSubmit={handleSave} className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-border rounded-lg px-4 py-2.5 text-text bg-surface focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-border rounded-lg px-4 py-2.5 text-text bg-surface focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-border rounded-lg px-4 py-2.5 text-text bg-surface focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          <FontAwesomeIcon icon={saving ? faSpinner : saved ? faCheck : null} spin={saving} />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
