import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import Link from 'next/link';

export default function CourseDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading: authLoading } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (id && user) {
      fetchCourse();
      checkEnrollment();
    }
  }, [id, user]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data.data);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const response = await api.get('/enrollments');
      const enrollments = response.data.data;
      const isEnrolled = enrollments.some((e) => e.courseId === id);
      setEnrolled(isEnrolled);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    try {
      await api.post('/enrollments', { courseId: id });
      setEnrolled(true);
      alert('Successfully enrolled in course!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error enrolling in course');
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="loading-spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-gray-400 text-xl">Loading course details...</p>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="glass-card text-center py-20">
          <div className="text-6xl mb-4 floating">📚</div>
          <p className="text-gray-400 text-xl">Course not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto animate-fade-in">
        {/* Course Header */}
        <div className="glass-card mb-8 animate-slide-up">
          {course.thumbnail && (
            <div className="relative mb-6 rounded-xl overflow-hidden">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h1 className="text-4xl md:text-5xl font-black mb-2 text-white">{course.title}</h1>
              </div>
            </div>
          )}
          {!course.thumbnail && (
            <h1 className="text-4xl md:text-5xl font-black mb-4 gradient-text">{course.title}</h1>
          )}
          
          <p className="text-gray-300 text-lg mb-6 leading-relaxed">{course.description}</p>
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-dark-card/50 rounded-xl border border-neon-orange/20">
            <div className="flex items-center gap-6 flex-wrap">
              <div>
                <span className="text-gray-400 text-sm">Instructor: </span>
                <span className="neon-text font-bold text-lg">
                  👤 {course.instructor?.name}
                </span>
              </div>
              <div>
                <span className="text-yellow-400 text-xl font-bold">⭐ {course.rating.toFixed(1)}</span>
                <span className="text-gray-400 ml-2">
                  ({course.totalRatings} ratings)
                </span>
              </div>
              <div className="text-gray-400">
                👥 {course.enrolledCount} students enrolled
              </div>
            </div>
            
            {!enrolled && user?.role === 'STUDENT' && (
              <button onClick={handleEnroll} className="btn-primary text-lg px-8 py-3">
                ✨ Enroll Now
              </button>
            )}
            {enrolled && (
              <Link href={`/courses/${id}/learn`} className="btn-primary text-lg px-8 py-3">
                🚀 Continue Learning
              </Link>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Lessons */}
            <div className="glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-3xl font-black mb-6 gradient-text">Course Content</h2>
              <div className="space-y-3">
                {course.lessons?.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="p-4 bg-dark-card/50 rounded-xl border-2 border-dark-border hover:border-neon-orange/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-neon-orange/20 flex items-center justify-center neon-text font-bold group-hover:scale-110 transition-transform">
                          {index + 1}
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm mr-3">Lesson {index + 1}</span>
                          <span className="font-bold text-lg group-hover:text-neon-orange transition-colors">{lesson.title}</span>
                        </div>
                      </div>
                      <span className="text-gray-400 font-semibold">⏱️ {lesson.duration} min</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quizzes */}
            {course.quizzes?.length > 0 && (
              <div className="glass-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-3xl font-black mb-6 gradient-text">Quizzes</h2>
                <div className="space-y-3">
                  {course.quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="p-4 bg-dark-card/50 rounded-xl border-2 border-dark-border hover:border-neon-orange/50 transition-all duration-300"
                    >
                      <h3 className="font-bold text-xl mb-2 neon-text">🎯 {quiz.title}</h3>
                      <p className="text-gray-400 text-sm">
                        {quiz.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Discussions */}
            <div className="glass-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <h2 className="text-3xl font-black mb-6 gradient-text">Discussions</h2>
              <Link
                href={`/discussions/${id}`}
                className="btn-primary inline-block"
              >
                💬 View Discussions
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-card sticky top-24 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-2xl font-black mb-6 gradient-text">Course Info</h3>
              <div className="space-y-4">
                <div className="p-3 bg-dark-card/50 rounded-lg border border-neon-orange/20">
                  <span className="text-gray-400 text-sm">Category: </span>
                  <span className="font-bold neon-text text-lg">{course.category}</span>
                </div>
                <div className="p-3 bg-dark-card/50 rounded-lg border border-neon-orange/20">
                  <span className="text-gray-400 text-sm">Difficulty: </span>
                  <span className="font-bold neon-text text-lg">{course.difficulty}</span>
                </div>
                <div className="p-3 bg-dark-card/50 rounded-lg border border-neon-orange/20">
                  <span className="text-gray-400 text-sm">Lessons: </span>
                  <span className="font-bold neon-text text-lg">
                    {course.lessons?.length || 0}
                  </span>
                </div>
                <div className="p-4 bg-gradient-to-r from-neon-orange/20 to-neon-orange-dark/20 rounded-lg border-2 border-neon-orange/50">
                  <span className="text-gray-300 text-sm">Price: </span>
                  <span className="font-black neon-text text-2xl">
                    ${course.price}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
