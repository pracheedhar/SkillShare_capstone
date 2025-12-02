import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import api from '../utils/api';

export default function Settings() {
  const router = useRouter();
  const { user, loading: authLoading, checkAuth } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        name: formData.name,
        bio: formData.bio,
        avatar: formData.avatar,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await api.put('/users/profile', updateData);
      setMessage('Profile updated successfully!');
      checkAuth();
      setFormData({
        ...formData,
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Error updating profile'
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="loading-spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-gray-400 text-xl">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <h1 className="text-5xl font-black mb-4 gradient-text animate-slide-up">Settings</h1>
        <p className="text-gray-400 text-xl mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Manage your profile and preferences
        </p>

        <div className="glass-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-3xl font-black mb-6 gradient-text">Profile Settings</h2>

          {message && (
            <div
              className={`mb-6 px-4 py-3 rounded-lg border-2 animate-fade-in ${
                message.includes('successfully')
                  ? 'bg-green-500/20 border-green-500/50 text-green-200 neon-border'
                  : 'bg-red-500/20 border-red-500/50 text-red-200 neon-border'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{message.includes('successfully') ? '✅' : '⚠️'}</span>
                <span>{message}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <label className="block text-sm font-bold mb-3 text-gray-300">
                <span className="neon-text">👤</span> Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <label className="block text-sm font-bold mb-3 text-gray-300">
                <span className="neon-text">📝</span> Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="input-field"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <label className="block text-sm font-bold mb-3 text-gray-300">
                <span className="neon-text">🖼️</span> Avatar URL
              </label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="input-field"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <label className="block text-sm font-bold mb-3 text-gray-300">
                <span className="neon-text">🔒</span> New Password (leave blank to keep current)
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            {formData.password && (
              <div className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
                <label className="block text-sm font-bold mb-3 text-gray-300">
                  <span className="neon-text">🔒</span> Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-lg py-4 animate-slide-up"
              style={{ animationDelay: '0.8s' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="loading-spinner w-5 h-5"></div>
                  Updating...
                </span>
              ) : (
                '✨ Update Profile'
              )}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
