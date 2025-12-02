import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import api from '../../utils/api';

export default function Discussions() {
  const router = useRouter();
  const { courseId } = router.query;
  const { user, loading: authLoading } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (courseId && user) {
      fetchDiscussions();
    }
  }, [courseId, user]);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/discussions?courseId=${courseId}`);
      setDiscussions(response.data.data);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/discussions', {
        courseId,
        ...formData,
      });
      setFormData({ title: '', content: '' });
      setShowForm(false);
      fetchDiscussions();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating discussion');
    }
  };

  const handleReply = async (discussionId, content) => {
    try {
      await api.post(`/discussions/${discussionId}/reply`, { content });
      fetchDiscussions();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding reply');
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="text-center py-20">Loading discussions...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Course Discussions</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Cancel' : 'New Discussion'}
          </button>
        </div>

        {/* New Discussion Form */}
        {showForm && (
          <div className="glass-card mb-6">
            <h2 className="text-2xl font-bold mb-4">Start a Discussion</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Discussion Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="input-field"
              />
              <textarea
                placeholder="Your question or topic..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
                rows={4}
                className="input-field"
              />
              <button type="submit" className="btn-primary">
                Post Discussion
              </button>
            </form>
          </div>
        )}

        {/* Discussions List */}
        <div className="space-y-6">
          {discussions.length === 0 ? (
            <div className="glass-card text-center py-12 text-gray-400">
              No discussions yet. Be the first to start one!
            </div>
          ) : (
            discussions.map((discussion) => (
              <div key={discussion.id} className="glass-card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {discussion.title}
                    </h3>
                    <p className="text-gray-400">{discussion.content}</p>
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    <p>{discussion.user.name}</p>
                    <p>
                      {new Date(discussion.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Replies */}
                {discussion.replies && discussion.replies.length > 0 && (
                  <div className="ml-6 mt-4 space-y-3 border-l-2 border-gray-700 pl-4">
                    {discussion.replies.map((reply) => (
                      <div key={reply.id} className="bg-gray-800/50 p-3 rounded">
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold">{reply.userName}</span>
                          <span className="text-gray-400 text-sm">
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Add a reply..."
                    className="input-field"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        handleReply(discussion.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

