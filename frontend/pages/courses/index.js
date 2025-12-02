import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import Link from 'next/link';

export default function Courses() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: '',
    sortBy: 'newest',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user, filters, pagination.page]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        sortBy: filters.sortBy === 'newest' ? 'createdAt' : filters.sortBy,
        sortOrder: 'desc',
      });

      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);

      const response = await api.get(`/courses?${params}`);
      setCourses(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, page: 1 });
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="text-center py-20">Loading courses...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6">All Courses</h1>
        
        {/* Filters */}
        <div className="glass-card mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search courses..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="input-field"
            />
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Data Science">Data Science</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="Marketing">Marketing</option>
            </select>
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="input-field"
            >
              <option value="">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="input-field"
            >
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
              <option value="popularity">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No courses found. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="glass-card hover:border-primary-500/50 transition-all cursor-pointer"
              >
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-primary-400 font-semibold">
                    {course.instructor?.name}
                  </span>
                  <span className="text-yellow-400">⭐ {course.rating.toFixed(1)}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-400">
                  <span>{course.difficulty}</span>
                  <span>{course._count?.enrollments || 0} students</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center space-x-2 mt-8">
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.pages}
              className="btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

