'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { PageHeader } from '@/components/ui/PageHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { getProductById, createOrder, createCheckoutForOrder } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { ProductResponse } from '@/lib/api';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [checkoutClientSecret, setCheckoutClientSecret] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadProduct(params.id as string);
    }
  }, [params.id]);

  const loadProduct = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProductById(id);
      setProduct(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/store');
      return;
    }

    if (!product) return;

    try {
      setAddingToCart(true);
      setError(null);
      
      // Create order first
      const order = await createOrder({
        items: [
          {
            productId: product.id,
            quantity,
          },
        ],
      });

      // Create checkout session for the order
      const checkout = await createCheckoutForOrder(order.id);
      setCheckoutClientSecret(checkout.clientSecret);
      setShowCheckout(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create checkout');
    } finally {
      setAddingToCart(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Product" />
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <PageHeader title="Product Not Found" />
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          Product not found.
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={product.name} />

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-96 object-cover"
              style={{ backgroundColor: 'var(--color-bg-primary)' }}
            />
          ) : (
            <div
              className="w-full h-96 flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-bg-secondary)' }}
            >
              <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>No image</span>
            </div>
          )}
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            {product.name}
          </h2>
          <p className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            {formatCurrency(product.price)}
          </p>
          {product.description && (
            <p className="mb-6" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
              {product.description}
            </p>
          )}
          <div className="mb-6">
            <label className="block mb-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="p-2 border w-24"
              style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
            />
          </div>
          <ActionButton variant="primary" onClick={handleAddToCart} disabled={addingToCart}>
            {addingToCart ? 'Processing...' : 'Buy Now'}
          </ActionButton>
        </div>
      </div>

      {/* Embedded Checkout */}
      {showCheckout && checkoutClientSecret && (
        <div className="mt-8">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
              Complete Your Purchase
            </h3>
            <ActionButton variant="secondary" onClick={() => setShowCheckout(false)}>
              Cancel
            </ActionButton>
          </div>
          <div className="border" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret: checkoutClientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
      )}
    </div>
  );
}

