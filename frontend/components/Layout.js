import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen">
      <nav className="glass border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-primary-400">
              SkillShare
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link href="/courses" className="hover:text-primary-400 transition-colors">
                Courses
              </Link>
              {user?.role === 'INSTRUCTOR' && (
                <Link href="/dashboard" className="hover:text-primary-400 transition-colors">
                  Dashboard
                </Link>
              )}
              <Link href="/subscription" className="hover:text-primary-400 transition-colors">
                Subscription
              </Link>
              <Link href="/settings" className="hover:text-primary-400 transition-colors">
                Settings
              </Link>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

