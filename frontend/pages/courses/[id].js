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
        <div className="text-center py-20">Loading course details...</div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="text-center py-20">Course not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Course Header */}
        <div className="glass-card mb-8">
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-400 text-lg mb-6">{course.description}</p>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div>
                <span className="text-gray-400">Instructor: </span>
                <span className="text-primary-400 font-semibold">
                  {course.instructor?.name}
                </span>
              </div>
              <div>
                <span className="text-yellow-400">⭐ {course.rating.toFixed(1)}</span>
                <span className="text-gray-400 ml-2">
                  ({course.totalRatings} ratings)
                </span>
              </div>
              <div className="text-gray-400">
                {course.enrolledCount} students enrolled
              </div>
            </div>
            
            {!enrolled && user?.role === 'STUDENT' && (
              <button onClick={handleEnroll} className="btn-primary">
                Enroll Now
              </button>
            )}
            {enrolled && (
              <Link href={`/courses/${id}/learn`} className="btn-primary">
                Continue Learning
              </Link>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Lessons */}
            <div className="glass-card">
              <h2 className="text-2xl font-bold mb-4">Course Content</h2>
              <div className="space-y-3">
                {course.lessons?.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="p-4 bg-gray-800/50 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <span className="text-gray-400 mr-3">Lesson {index + 1}</span>
                      <span className="font-semibold">{lesson.title}</span>
                    </div>
                    <span className="text-gray-400">{lesson.duration} min</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quizzes */}
            {course.quizzes?.length > 0 && (
              <div className="glass-card">
                <h2 className="text-2xl font-bold mb-4">Quizzes</h2>
                <div className="space-y-3">
                  {course.quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="p-4 bg-gray-800/50 rounded-lg"
                    >
                      <h3 className="font-semibold">{quiz.title}</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {quiz.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Discussions */}
            <div className="glass-card">
              <h2 className="text-2xl font-bold mb-4">Discussions</h2>
              <Link
                href={`/discussions/${id}`}
                className="btn-primary"
              >
                View Discussions
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-card">
              <h3 className="text-xl font-semibold mb-4">Course Info</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400">Category: </span>
                  <span className="font-semibold">{course.category}</span>
                </div>
                <div>
                  <span className="text-gray-400">Difficulty: </span>
                  <span className="font-semibold">{course.difficulty}</span>
                </div>
                <div>
                  <span className="text-gray-400">Lessons: </span>
                  <span className="font-semibold">
                    {course.lessons?.length || 0}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Price: </span>
                  <span className="font-semibold text-primary-400">
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

