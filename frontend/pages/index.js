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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-400">SkillShare</h1>
          <div className="space-x-4">
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
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
          Learn New Skills at Your Own Pace
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Join thousands of students learning from expert instructors. 
          Access unlimited courses with our subscription plans.
        </p>
        <div className="space-x-4">
          <Link href="/signup" className="btn-primary text-lg px-8 py-3">
            Get Started
          </Link>
          <Link href="/courses" className="btn-secondary text-lg px-8 py-3">
            Browse Courses
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose SkillShare?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card text-center">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
            <p className="text-gray-400">
              Learn from industry professionals with years of experience
            </p>
          </div>
          <div className="glass-card text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Unlimited Access</h3>
            <p className="text-gray-400">
              Subscribe once and get access to all courses forever
            </p>
          </div>
          <div className="glass-card text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Community Support</h3>
            <p className="text-gray-400">
              Connect with peers and instructors through discussion forums
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

