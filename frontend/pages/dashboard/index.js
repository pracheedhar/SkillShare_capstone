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
        <div className="text-center py-20">Loading dashboard...</div>
      </Layout>
    );
  }

  if (user?.role === 'INSTRUCTOR') {
    return (
      <Layout>
        <h1 className="text-4xl font-bold mb-8">Instructor Dashboard</h1>
        
        {data && (
          <>
            {/* Statistics */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="glass-card">
                <h3 className="text-gray-400 text-sm mb-2">Total Courses</h3>
                <p className="text-3xl font-bold">{data.statistics.totalCourses}</p>
              </div>
              <div className="glass-card">
                <h3 className="text-gray-400 text-sm mb-2">Total Enrollments</h3>
                <p className="text-3xl font-bold">{data.statistics.totalEnrollments}</p>
              </div>
              <div className="glass-card">
                <h3 className="text-gray-400 text-sm mb-2">Total Students</h3>
                <p className="text-3xl font-bold">{data.statistics.totalStudents}</p>
              </div>
              <div className="glass-card">
                <h3 className="text-gray-400 text-sm mb-2">Total Earnings</h3>
                <p className="text-3xl font-bold">${data.statistics.totalEarnings}</p>
              </div>
            </div>

            {/* Course Performance */}
            <div className="glass-card mb-8">
              <h2 className="text-2xl font-bold mb-4">Course Performance</h2>
              <div className="space-y-4">
                {data.courses?.map((course) => (
                  <div
                    key={course.id}
                    className="p-4 bg-gray-800/50 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-gray-400 text-sm">
                        {course.enrollments} enrollments • {course.lessons} lessons
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary-400 font-semibold">
                        ${course.earnings.toFixed(2)}
                      </p>
                      <p className="text-gray-400 text-sm">
                        ⭐ {course.rating.toFixed(1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Enrollments */}
            <div className="glass-card">
              <h2 className="text-2xl font-bold mb-4">Recent Enrollments</h2>
              <div className="space-y-3">
                {data.recentEnrollments?.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="p-4 bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold">{enrollment.student.name}</p>
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
      </Layout>
    );
  }

  // Student Dashboard
  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8">My Dashboard</h1>
      
      {data && (
        <>
          {/* Statistics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="glass-card">
              <h3 className="text-gray-400 text-sm mb-2">Enrolled Courses</h3>
              <p className="text-3xl font-bold">{data.statistics.totalCourses}</p>
            </div>
            <div className="glass-card">
              <h3 className="text-gray-400 text-sm mb-2">Completed</h3>
              <p className="text-3xl font-bold">{data.statistics.completedCourses}</p>
            </div>
            <div className="glass-card">
              <h3 className="text-gray-400 text-sm mb-2">Avg Progress</h3>
              <p className="text-3xl font-bold">{data.statistics.averageProgress}%</p>
            </div>
            <div className="glass-card">
              <h3 className="text-gray-400 text-sm mb-2">Quiz Avg Score</h3>
              <p className="text-3xl font-bold">{data.statistics.averageQuizScore}%</p>
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="glass-card mb-8">
            <h2 className="text-2xl font-bold mb-4">My Courses</h2>
            <div className="space-y-4">
              {data.enrollments?.map((enrollment) => (
                <Link
                  key={enrollment.id}
                  href={`/courses/${enrollment.courseId}`}
                  className="block p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{enrollment.course.title}</h3>
                      <p className="text-gray-400 text-sm">
                        {enrollment.course.category} • {enrollment.course.instructor.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary-400 font-semibold">
                        {enrollment.progress.toFixed(0)}% Complete
                      </p>
                      <div className="w-32 h-2 bg-gray-700 rounded-full mt-2">
                        <div
                          className="h-2 bg-primary-500 rounded-full"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Quiz Attempts */}
          {data.quizAttempts?.length > 0 && (
            <div className="glass-card">
              <h2 className="text-2xl font-bold mb-4">Recent Quiz Results</h2>
              <div className="space-y-3">
                {data.quizAttempts.slice(0, 5).map((attempt) => (
                  <div
                    key={attempt.id}
                    className="p-4 bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{attempt.quiz.title}</p>
                        <p className="text-gray-400 text-sm">
                          {attempt.quiz.course.title}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-primary-400 font-semibold">
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
    </Layout>
  );
}

