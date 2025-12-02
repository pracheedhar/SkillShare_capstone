import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="loading-spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="particle" style={{ top: '20%', left: '10%', animationDelay: '0s' }}></div>
        <div className="particle" style={{ top: '60%', left: '80%', animationDelay: '1s' }}></div>
        <div className="particle" style={{ top: '80%', left: '20%', animationDelay: '2s' }}></div>
        <div className="particle" style={{ top: '40%', left: '70%', animationDelay: '1.5s' }}></div>
        <div className="particle" style={{ top: '10%', left: '50%', animationDelay: '0.5s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="glass border-b border-neon-orange/30 sticky top-0 z-50 animate-slide-up">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold neon-text animate-fade-in">SkillShare</h1>
          <div className="space-x-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Link href="/login" className="btn-secondary">
              Login
            </Link>
            <Link href="/signup" className="btn-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-black mb-6 gradient-text animate-slide-up">
            Learn New Skills
          </h1>
          <h2 className="text-5xl md:text-6xl font-black mb-6 gradient-text animate-slide-up" style={{ animationDelay: '0.1s' }}>
            at Your Own Pace
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Join thousands of students learning from expert instructors. 
            <span className="neon-text"> Access unlimited courses</span> with our subscription plans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/signup" className="btn-primary text-lg px-10 py-4 text-xl">
              ✨ Get Started
            </Link>
            <Link href="/courses" className="btn-secondary text-lg px-10 py-4 text-xl">
              🔍 Browse Courses
            </Link>
          </div>
        </div>

        {/* Floating Icons */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="floating" style={{ animationDelay: '0s' }}>
            <div className="text-6xl">🎓</div>
          </div>
          <div className="floating" style={{ animationDelay: '1s' }}>
            <div className="text-6xl">📚</div>
          </div>
          <div className="floating" style={{ animationDelay: '2s' }}>
            <div className="text-6xl">💡</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 gradient-text animate-fade-in">
          Why Choose SkillShare?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card text-center group animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-6xl mb-6 floating group-hover:scale-110 transition-transform duration-300">🎓</div>
            <h3 className="text-2xl font-bold mb-4 neon-text">Expert Instructors</h3>
            <p className="text-gray-300 leading-relaxed">
              Learn from industry professionals with years of experience and real-world expertise
            </p>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-neon-orange to-transparent"></div>
          </div>
          
          <div className="glass-card text-center group animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-6xl mb-6 floating group-hover:scale-110 transition-transform duration-300" style={{ animationDelay: '0.5s' }}>📚</div>
            <h3 className="text-2xl font-bold mb-4 neon-text">Unlimited Access</h3>
            <p className="text-gray-300 leading-relaxed">
              Subscribe once and get access to all courses forever. Learn at your own pace, anytime, anywhere
            </p>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-neon-orange to-transparent"></div>
          </div>
          
          <div className="glass-card text-center group animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-6xl mb-6 floating group-hover:scale-110 transition-transform duration-300" style={{ animationDelay: '1s' }}>💬</div>
            <h3 className="text-2xl font-bold mb-4 neon-text">Community Support</h3>
            <p className="text-gray-300 leading-relaxed">
              Connect with peers and instructors through discussion forums and get help when you need it
            </p>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-neon-orange to-transparent"></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="glass-card max-w-3xl mx-auto animate-fade-in">
          <h2 className="text-4xl font-black mb-6 gradient-text">Ready to Start Learning?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of students already learning on SkillShare
          </p>
          <Link href="/signup" className="btn-primary text-xl px-12 py-4 inline-block">
            🚀 Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
}
