'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { getUserOrders } from '@/lib/api';
import type { OrderResponse } from '@/lib/api';

function StoreOrdersPageContent() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
    
    // Check for success/cancel messages
    if (searchParams.get('success') === 'true') {
      setSuccessMessage('Payment completed successfully!');
      // Clear the message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [searchParams]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="My Orders" />
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="My Orders" />

      {error && (
        <div
          className="mb-6 p-4"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-accent-primary)',
            color: 'var(--color-accent-primary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {error}
        </div>
      )}

      {successMessage && (
        <div
          className="mb-6 p-4"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            border: '1px solid #10b981',
            color: '#10b981',
            fontFamily: 'var(--font-body)',
          }}
        >
          {successMessage}
        </div>
      )}

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
            No orders found.
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="p-6"
              style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                    Order #{order.id.slice(0, 8)}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <span
                  className="px-3 py-1 text-sm font-semibold"
                  style={{
                    backgroundColor: order.status === 'COMPLETED' ? 'var(--color-accent-primary)' : 'var(--color-text-muted)',
                    color: 'white',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {order.status}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                      {item.product.name} x {item.quantity}
                    </span>
                    <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
                <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                  Total: {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function StoreOrdersPage() {
  return (
    <Suspense fallback={
      <div>
        <PageHeader title="My Orders" />
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          Loading...
        </div>
      </div>
    }>
      <StoreOrdersPageContent />
    </Suspense>
  );
}

