import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import api from '../utils/api';

export default function Subscription() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchSubscriptionStatus();
    }
  }, [user]);

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get('/subscriptions/status');
      setSubscriptionStatus(response.data.data);
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan) => {
    try {
      await api.post('/subscriptions', {
        plan,
        paymentId: `mock_payment_${Date.now()}`,
      });
      alert('Subscription activated successfully!');
      fetchSubscriptionStatus();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating subscription');
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="loading-spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-gray-400 text-xl">Loading...</p>
        </div>
      </Layout>
    );
  }

  const hasActiveSubscription = subscriptionStatus?.hasActiveSubscription;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto animate-fade-in">
        <h1 className="text-5xl font-black mb-4 gradient-text animate-slide-up">Subscription Plans</h1>
        <p className="text-gray-400 text-xl mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Choose the perfect plan for your learning journey
        </p>

        {hasActiveSubscription && (
          <div className="glass-card mb-8 bg-green-500/20 border-2 border-green-500/50 neon-border animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl floating">✨</span>
              <h2 className="text-3xl font-black text-green-400 neon-text">
                Active Subscription
              </h2>
            </div>
            <p className="text-gray-300 text-lg mb-2">
              Plan: <span className="neon-text font-bold">{subscriptionStatus.subscription.plan}</span>
            </p>
            <p className="text-gray-400 text-sm">
              Valid until:{' '}
              <span className="neon-text font-semibold">
                {new Date(subscriptionStatus.subscription.endDate).toLocaleDateString()}
              </span>
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Monthly Plan */}
          <div className="glass-card group hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 floating">📅</div>
              <h2 className="text-4xl font-black mb-2 gradient-text">Monthly Plan</h2>
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-6xl font-black neon-text">₹29.99</span>
                <span className="text-gray-400">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-300">
                <span className="text-2xl mr-3 neon-text">✓</span>
                <span>Unlimited course access</span>
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-2xl mr-3 neon-text">✓</span>
                <span>All premium features</span>
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-2xl mr-3 neon-text">✓</span>
                <span>Cancel anytime</span>
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe('MONTHLY')}
              disabled={hasActiveSubscription}
              className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {hasActiveSubscription ? '✓ Current Plan' : '✨ Subscribe Monthly'}
            </button>
          </div>

          {/* Yearly Plan */}
          <div className="glass-card border-2 border-neon-orange neon-border group hover:scale-105 transition-all duration-300 animate-slide-up relative" style={{ animationDelay: '0.4s' }}>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-neon-orange to-neon-orange-dark text-white text-sm font-black px-6 py-2 rounded-full neon-border animate-pulse-slow">
                ⭐ BEST VALUE ⭐
              </div>
            </div>
            <div className="text-center mb-6 mt-4">
              <div className="text-6xl mb-4 floating" style={{ animationDelay: '0.5s' }}>🎯</div>
              <h2 className="text-4xl font-black mb-2 gradient-text">Yearly Plan</h2>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-6xl font-black neon-text">₹299.99</span>
                <span className="text-gray-400">/year</span>
              </div>
              <p className="text-neon-orange font-bold text-lg mb-4">💰 Save ₹60 per year</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-300">
                <span className="text-2xl mr-3 neon-text">✓</span>
                <span>Unlimited course access</span>
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-2xl mr-3 neon-text">✓</span>
                <span>All premium features</span>
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-2xl mr-3 neon-text">✓</span>
                <span className="neon-text font-bold">Best value - Save 17%</span>
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe('YEARLY')}
              disabled={hasActiveSubscription}
              className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {hasActiveSubscription ? '✓ Current Plan' : '🚀 Subscribe Yearly'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
