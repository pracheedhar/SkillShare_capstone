import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Signup() {
  const router = useRouter();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signup(
      formData.name,
      formData.email,
      formData.password,
      formData.role
    );

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-neon-orange/20 rounded-full blur-3xl top-1/4 left-1/4 animate-pulse-slow"></div>
        <div className="absolute w-96 h-96 bg-neon-orange/20 rounded-full blur-3xl bottom-1/4 right-1/4 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="particle" style={{ top: '20%', left: '10%' }}></div>
        <div className="particle" style={{ top: '60%', left: '80%', animationDelay: '1s' }}></div>
        <div className="particle" style={{ top: '80%', left: '20%', animationDelay: '2s' }}></div>
        <div className="particle" style={{ top: '40%', left: '70%', animationDelay: '1.5s' }}></div>
      </div>

      <div className="glass-card w-full max-w-md relative z-10 animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black mb-2 gradient-text">Join SkillShare</h1>
          <p className="text-gray-400">Start your learning journey today</p>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border-2 border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 animate-fade-in neon-border">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-bold mb-3 text-gray-300">
              <span className="neon-text">👤</span> Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
              className="input-field"
            />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-bold mb-3 text-gray-300">
              <span className="neon-text">✉️</span> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              className="input-field"
            />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <label className="block text-sm font-bold mb-3 text-gray-300">
              <span className="neon-text">🔒</span> Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="••••••••"
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <label className="block text-sm font-bold mb-3 text-gray-300">
              <span className="neon-text">🎭</span> Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field"
            >
              <option value="STUDENT">🎓 Student</option>
              <option value="INSTRUCTOR">👨‍🏫 Instructor</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-lg py-4 animate-slide-up"
            style={{ animationDelay: '0.5s' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="loading-spinner w-5 h-5"></div>
                Signing up...
              </span>
            ) : (
              '✨ Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="neon-text font-bold hover:underline transition-all duration-300 hover:scale-110 inline-block">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
