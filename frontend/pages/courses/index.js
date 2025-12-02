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
        <div className="text-center py-20">
          <div className="loading-spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-gray-400 text-xl">Loading courses...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-5xl font-black mb-4 gradient-text animate-slide-up">All Courses</h1>
        <p className="text-gray-400 text-xl mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Discover amazing courses to level up your skills
        </p>
        
        {/* Filters */}
        <div className="glass-card mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 neon-text">🔍</span>
              <input
                type="text"
                placeholder="Search courses..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-12"
              />
            </div>
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
          <div className="glass-card text-center py-20 animate-fade-in">
            <div className="text-6xl mb-4 floating">📚</div>
            <p className="text-gray-400 text-xl">No courses found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="glass-card group hover:scale-105 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {course.thumbnail && (
                  <div className="relative mb-4 rounded-lg overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-2 right-2 px-3 py-1 bg-neon-orange/90 rounded-full text-white text-sm font-bold">
                      ⭐ {course.rating.toFixed(1)}
                    </div>
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2 group-hover:text-neon-orange transition-colors duration-300">
                  {course.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-neon-orange font-semibold text-sm">
                    👤 {course.instructor?.name}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {course._count?.enrollments || 0} students
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-neon-orange/20">
                  <span className="text-xs px-3 py-1 bg-neon-orange/20 text-neon-orange rounded-full font-semibold">
                    {course.difficulty}
                  </span>
                  <span className="text-neon-orange font-bold">
                    ${course.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center space-x-2 mt-12 animate-fade-in">
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <div className="px-6 py-3 glass-card">
              <span className="neon-text font-bold">
                Page {pagination.page} of {pagination.pages}
              </span>
            </div>
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.pages}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
