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
    if (!content.trim()) return;
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
        <div className="text-center py-20">
          <div className="loading-spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-gray-400 text-xl">Loading discussions...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-8 animate-slide-up">
          <div>
            <h1 className="text-5xl font-black mb-2 gradient-text">Course Discussions</h1>
            <p className="text-gray-400">Join the conversation and ask questions</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary text-lg px-6 py-3"
          >
            {showForm ? '✖️ Cancel' : '💬 New Discussion'}
          </button>
        </div>

        {/* New Discussion Form */}
        {showForm && (
          <div className="glass-card mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-3xl font-black mb-6 gradient-text">Start a Discussion</h2>
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
              <button type="submit" className="btn-primary w-full">
                ✨ Post Discussion
              </button>
            </form>
          </div>
        )}

        {/* Discussions List */}
        <div className="space-y-6">
          {discussions.length === 0 ? (
            <div className="glass-card text-center py-20 animate-fade-in">
              <div className="text-6xl mb-4 floating">💬</div>
              <p className="text-gray-400 text-xl">No discussions yet. Be the first to start one!</p>
            </div>
          ) : (
            discussions.map((discussion, index) => (
              <div key={discussion.id} className="glass-card animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-black mb-3 neon-text">
                      {discussion.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{discussion.content}</p>
                  </div>
                  <div className="text-right ml-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-full bg-neon-orange/20 flex items-center justify-center neon-text font-bold">
                        {discussion.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{discussion.user.name}</p>
                        <p className="text-gray-400 text-xs">
                          {new Date(discussion.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {discussion.replies && discussion.replies.length > 0 && (
                  <div className="ml-6 mt-6 space-y-3 border-l-2 border-neon-orange/30 pl-4">
                    {discussion.replies.map((reply, replyIndex) => (
                      <div key={reply.id || replyIndex} className="bg-dark-card/50 p-4 rounded-xl border border-neon-orange/20 animate-fade-in">
                        <div className="flex justify-between mb-2">
                          <span className="font-bold neon-text">{reply.userName}</span>
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
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a reply..."
                      className="input-field flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          handleReply(discussion.id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = e.target.previousElementSibling;
                        if (input.value.trim()) {
                          handleReply(discussion.id, input.value);
                          input.value = '';
                        }
                      }}
                      className="btn-secondary px-6"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
