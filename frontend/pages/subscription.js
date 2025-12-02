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
      // In production, integrate with payment gateway here
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
        <div className="text-center py-20">Loading...</div>
      </Layout>
    );
  }

  const hasActiveSubscription = subscriptionStatus?.hasActiveSubscription;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Subscription Plans</h1>

        {hasActiveSubscription && (
          <div className="glass-card mb-8 bg-green-500/20 border-green-500/50">
            <h2 className="text-2xl font-semibold mb-2 text-green-400">
              Active Subscription
            </h2>
            <p className="text-gray-300">
              Plan: {subscriptionStatus.subscription.plan}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Valid until:{' '}
              {new Date(
                subscriptionStatus.subscription.endDate
              ).toLocaleDateString()}
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Monthly Plan */}
          <div className="glass-card">
            <h2 className="text-3xl font-bold mb-2">Monthly Plan</h2>
            <p className="text-4xl font-bold text-primary-400 mb-4">$29.99</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Unlimited course access
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                All premium features
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Cancel anytime
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe('MONTHLY')}
              disabled={hasActiveSubscription}
              className="btn-primary w-full disabled:opacity-50"
            >
              {hasActiveSubscription ? 'Current Plan' : 'Subscribe Monthly'}
            </button>
          </div>

          {/* Yearly Plan */}
          <div className="glass-card border-2 border-primary-500">
            <div className="bg-primary-500/20 text-primary-400 text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
              BEST VALUE
            </div>
            <h2 className="text-3xl font-bold mb-2">Yearly Plan</h2>
            <p className="text-4xl font-bold text-primary-400 mb-2">$299.99</p>
            <p className="text-gray-400 text-sm mb-4">Save $60 per year</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Unlimited course access
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                All premium features
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Best value - Save 17%
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe('YEARLY')}
              disabled={hasActiveSubscription}
              className="btn-primary w-full disabled:opacity-50"
            >
              {hasActiveSubscription ? 'Current Plan' : 'Subscribe Yearly'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

