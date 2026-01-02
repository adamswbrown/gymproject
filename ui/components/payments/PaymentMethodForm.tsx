'use client';

import { useState } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ActionButton } from '@/components/ui/ActionButton';
import { addPaymentMethod } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface PaymentMethodFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

function PaymentForm({ onSuccess, onCancel }: PaymentMethodFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create payment method
      const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (pmError) {
        throw new Error(pmError.message);
      }

      if (!paymentMethod) {
        throw new Error('Failed to create payment method');
      }

      // Save to backend
      await addPaymentMethod(paymentMethod.id);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to add payment method');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          className="p-4"
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

      <div className="p-4 border" style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border-subtle)' }}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-body)',
                '::placeholder': {
                  color: 'var(--color-text-muted)',
                },
              },
            },
          }}
        />
      </div>

      <div className="flex gap-2">
        <ActionButton type="submit" variant="primary" disabled={loading || !stripe}>
          {loading ? 'Adding...' : 'Add Payment Method'}
        </ActionButton>
        {onCancel && (
          <ActionButton type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </ActionButton>
        )}
      </div>
    </form>
  );
}

export function PaymentMethodForm({ onSuccess, onCancel }: PaymentMethodFormProps) {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <div style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
        Stripe is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
      </div>
    );
  }

  const options: StripeElementsOptions = {
    mode: 'setup',
    currency: 'gbp',
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  );
}

