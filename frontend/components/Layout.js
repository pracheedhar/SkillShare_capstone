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
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 bg-neon-orange/10 rounded-full blur-3xl top-0 left-0 animate-pulse-slow"></div>
        <div className="absolute w-96 h-96 bg-neon-orange/10 rounded-full blur-3xl bottom-0 right-0 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <nav className="glass border-b border-neon-orange/30 sticky top-0 z-50 backdrop-blur-xl animate-slide-up">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="text-3xl font-black neon-text hover:scale-110 transition-transform duration-300">
              SkillShare
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link 
                href="/courses" 
                className="text-white hover:text-neon-orange transition-all duration-300 hover:scale-110 font-semibold relative group"
              >
                Courses
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-orange group-hover:w-full transition-all duration-300"></span>
              </Link>
              {user?.role === 'INSTRUCTOR' && (
                <Link 
                  href="/dashboard" 
                  className="text-white hover:text-neon-orange transition-all duration-300 hover:scale-110 font-semibold relative group"
                >
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-orange group-hover:w-full transition-all duration-300"></span>
                </Link>
              )}
              <Link 
                href="/subscription" 
                className="text-white hover:text-neon-orange transition-all duration-300 hover:scale-110 font-semibold relative group"
              >
                Subscription
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-orange group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                href="/settings" 
                className="text-white hover:text-neon-orange transition-all duration-300 hover:scale-110 font-semibold relative group"
              >
                Settings
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-orange group-hover:w-full transition-all duration-300"></span>
              </Link>
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-neon-orange/30">
                <span className="text-sm text-gray-300 font-medium">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm px-4 py-2"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        {children}
      </main>
    </div>
  );
}
