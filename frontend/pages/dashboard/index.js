import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      if (user.role === 'INSTRUCTOR') {
        const response = await api.get('/analytics/instructor');
        setData(response.data.data);
      } else {
        const response = await api.get('/analytics/progress');
        setData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="loading-spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-gray-400 text-xl">Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  if (user?.role === 'INSTRUCTOR') {
    return (
      <Layout>
        <div className="animate-fade-in">
          <h1 className="text-5xl font-black mb-4 gradient-text animate-slide-up">Instructor Dashboard</h1>
          <p className="text-gray-400 text-xl mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Manage your courses and track your success
          </p>
          
          {data && (
            <>
              {/* Statistics */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Courses', value: data.statistics.totalCourses, icon: '📚', delay: '0.1s' },
                  { label: 'Total Enrollments', value: data.statistics.totalEnrollments, icon: '👥', delay: '0.2s' },
                  { label: 'Total Students', value: data.statistics.totalStudents, icon: '🎓', delay: '0.3s' },
                  { label: 'Total Earnings', value: `$${data.statistics.totalEarnings}`, icon: '💰', delay: '0.4s' },
                ].map((stat, index) => (
                  <div key={index} className="glass-card group hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: stat.delay }}>
                    <div className="text-4xl mb-3 floating">{stat.icon}</div>
                    <h3 className="text-gray-400 text-sm mb-2 font-semibold">{stat.label}</h3>
                    <p className="text-4xl font-black neon-text">{stat.value}</p>
                    <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-neon-orange to-transparent"></div>
                  </div>
                ))}
              </div>

              {/* Course Performance */}
              <div className="glass-card mb-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <h2 className="text-3xl font-black mb-6 gradient-text">Course Performance</h2>
                <div className="space-y-4">
                  {data.courses?.map((course, index) => (
                    <div
                      key={course.id}
                      className="p-6 bg-dark-card/50 rounded-xl border-2 border-dark-border hover:border-neon-orange/50 transition-all duration-300 group animate-slide-up"
                      style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2 group-hover:text-neon-orange transition-colors">{course.title}</h3>
                          <p className="text-gray-400 text-sm">
                            {course.enrollments} enrollments • {course.lessons} lessons • ⭐ {course.rating.toFixed(1)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black neon-text">
                            ${course.earnings.toFixed(2)}
                          </p>
                          <p className="text-gray-500 text-sm">Revenue</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Enrollments */}
              <div className="glass-card animate-slide-up" style={{ animationDelay: '0.7s' }}>
                <h2 className="text-3xl font-black mb-6 gradient-text">Recent Enrollments</h2>
                <div className="space-y-3">
                  {data.recentEnrollments?.map((enrollment, index) => (
                    <div
                      key={enrollment.id}
                      className="p-4 bg-dark-card/50 rounded-lg border border-dark-border hover:border-neon-orange/30 transition-all duration-300 animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-bold text-lg">{enrollment.student.name}</p>
                          <p className="text-gray-400 text-sm">
                            {enrollment.course.title}
                          </p>
                        </div>
                        <span className="text-gray-400 text-sm">
                          {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </Layout>
    );
  }

  // Student Dashboard
  return (
    <Layout>
      <div className="animate-fade-in">
        <h1 className="text-5xl font-black mb-4 gradient-text animate-slide-up">My Dashboard</h1>
        <p className="text-gray-400 text-xl mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Track your learning progress and achievements
        </p>
        
        {data && (
          <>
            {/* Statistics */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Enrolled Courses', value: data.statistics.totalCourses, icon: '📚', delay: '0.1s' },
                { label: 'Completed', value: data.statistics.completedCourses, icon: '✅', delay: '0.2s' },
                { label: 'Avg Progress', value: `${data.statistics.averageProgress}%`, icon: '📊', delay: '0.3s' },
                { label: 'Quiz Avg Score', value: `${data.statistics.averageQuizScore}%`, icon: '🎯', delay: '0.4s' },
              ].map((stat, index) => (
                <div key={index} className="glass-card group hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: stat.delay }}>
                  <div className="text-4xl mb-3 floating">{stat.icon}</div>
                  <h3 className="text-gray-400 text-sm mb-2 font-semibold">{stat.label}</h3>
                  <p className="text-4xl font-black neon-text">{stat.value}</p>
                  <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-neon-orange to-transparent"></div>
                </div>
              ))}
            </div>

            {/* Enrolled Courses */}
            <div className="glass-card mb-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <h2 className="text-3xl font-black mb-6 gradient-text">My Courses</h2>
              <div className="space-y-4">
                {data.enrollments?.map((enrollment, index) => (
                  <Link
                    key={enrollment.id}
                    href={`/courses/${enrollment.courseId}`}
                    className="block p-6 bg-dark-card/50 rounded-xl border-2 border-dark-border hover:border-neon-orange/50 transition-all duration-300 group animate-slide-up"
                    style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-neon-orange transition-colors">
                          {enrollment.course.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {enrollment.course.category} • 👤 {enrollment.course.instructor.name}
                        </p>
                      </div>
                      <div className="text-right ml-6">
                        <p className="text-2xl font-black neon-text mb-2">
                          {enrollment.progress.toFixed(0)}%
                        </p>
                        <div className="w-32 h-3 bg-dark-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-neon-orange to-neon-orange-light transition-all duration-500 rounded-full"
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Quiz Attempts */}
            {data.quizAttempts?.length > 0 && (
              <div className="glass-card animate-slide-up" style={{ animationDelay: '0.7s' }}>
                <h2 className="text-3xl font-black mb-6 gradient-text">Recent Quiz Results</h2>
                <div className="space-y-3">
                  {data.quizAttempts.slice(0, 5).map((attempt, index) => (
                    <div
                      key={attempt.id}
                      className="p-4 bg-dark-card/50 rounded-lg border border-dark-border hover:border-neon-orange/30 transition-all duration-300 animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-lg">{attempt.quiz.title}</p>
                          <p className="text-gray-400 text-sm">
                            {attempt.quiz.course.title}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black neon-text">
                            {attempt.score.toFixed(1)}%
                          </p>
                          <p className="text-gray-400 text-sm">
                            {attempt.correctCount}/{attempt.totalQuestions}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
