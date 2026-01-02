'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { Modal } from '@/components/ui/Modal';
import { ModalFooter } from '@/components/ui/ModalFooter';
import { PaymentMethodForm } from '@/components/payments/PaymentMethodForm';
import { getPaymentMethods, getPendingPayments, getReceipts, removePaymentMethod } from '@/lib/api';
import type { PaymentMethodResponse, PendingPaymentResponse, ReceiptResponse } from '@/lib/api';

export default function MemberPaymentsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodResponse[]>([]);
  const [pendingPayments, setPendingPayments] = useState<PendingPaymentResponse[]>([]);
  const [receipts, setReceipts] = useState<ReceiptResponse[]>([]);
  const [activeTab, setActiveTab] = useState<'methods' | 'pending' | 'receipts'>('methods');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddMethod, setShowAddMethod] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      if (activeTab === 'methods') {
        const data = await getPaymentMethods();
        setPaymentMethods(data);
      } else if (activeTab === 'pending') {
        const data = await getPendingPayments();
        setPendingPayments(data);
      } else {
        const data = await getReceipts();
        setReceipts(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amount);
  };

  return (
    <div>
      <PageHeader title="Payments" />

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

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <button
          onClick={() => setActiveTab('methods')}
          className={`px-4 py-2 ${activeTab === 'methods' ? 'border-b-2' : ''}`}
          style={{
            borderBottomColor: activeTab === 'methods' ? 'var(--color-accent-primary)' : 'transparent',
            color: activeTab === 'methods' ? 'var(--color-accent-primary)' : 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
          }}
        >
          Payment Methods
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 ${activeTab === 'pending' ? 'border-b-2' : ''}`}
          style={{
            borderBottomColor: activeTab === 'pending' ? 'var(--color-accent-primary)' : 'transparent',
            color: activeTab === 'pending' ? 'var(--color-accent-primary)' : 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
          }}
        >
          Pending Payments
        </button>
        <button
          onClick={() => setActiveTab('receipts')}
          className={`px-4 py-2 ${activeTab === 'receipts' ? 'border-b-2' : ''}`}
          style={{
            borderBottomColor: activeTab === 'receipts' ? 'var(--color-accent-primary)' : 'transparent',
            color: activeTab === 'receipts' ? 'var(--color-accent-primary)' : 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
          }}
        >
          Receipts
        </button>
      </div>

      {loading && (
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          Loading...
        </div>
      )}

      {!loading && activeTab === 'methods' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
              Payment Methods
            </h3>
            <ActionButton variant="primary" onClick={() => setShowAddMethod(true)}>
              Add Payment Method
            </ActionButton>
          </div>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
              No payment methods saved.
            </div>
          ) : (
            paymentMethods.map((method) => (
              <div
                key={method.id}
                className="p-6"
                style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                      {method.type}
                      {method.isDefault && (
                        <span className="ml-2 text-xs" style={{ color: 'var(--color-accent-primary)', fontFamily: 'var(--font-body)' }}>
                          (Default)
                        </span>
                      )}
                    </p>
                    {method.last4 && (
                      <div className="mt-2" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                        <p>**** **** **** {method.last4}</p>
                        {method.expiryMonth && method.expiryYear && (
                          <p>Exp {method.expiryMonth}/{method.expiryYear}</p>
                        )}
                        {method.cardholderName && <p>({method.cardholderName})</p>}
                      </div>
                    )}
                  </div>
                  <ActionButton
                    variant="secondary"
                    onClick={async () => {
                      if (confirm('Are you sure you want to remove this payment method?')) {
                        try {
                          await removePaymentMethod(method.id);
                          loadData();
                        } catch (err: any) {
                          setError(err.message || 'Failed to remove payment method');
                        }
                      }
                    }}
                  >
                    Remove
                  </ActionButton>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Payment Method Modal */}
      <Modal isOpen={showAddMethod} onClose={() => setShowAddMethod(false)} title="Add Payment Method">
        <PaymentMethodForm
          onSuccess={() => {
            setShowAddMethod(false);
            loadData();
          }}
          onCancel={() => setShowAddMethod(false)}
        />
      </Modal>

      {!loading && activeTab === 'pending' && (
        <div>
          {pendingPayments.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>You have no pending payments.</p>
          ) : (
            <div className="space-y-4">
              {pendingPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-6"
                  style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                        {payment.description}
                      </p>
                      <p className="mt-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                        {formatCurrency(payment.amount, payment.currency)} - Due: {formatDate(payment.dueDate)}
                      </p>
                    </div>
                    <span
                      className="px-3 py-1 text-sm"
                      style={{
                        backgroundColor: 'var(--color-accent-primary)',
                        color: 'white',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'receipts' && (
        <div>
          {receipts.length === 0 ? (
            <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
              No receipts found.
            </div>
          ) : (
            <div className="space-y-4">
              {receipts.map((receipt) => (
                <div
                  key={receipt.id}
                  className="p-6"
                  style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                        {receipt.description}
                      </p>
                      <p className="mt-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                        {formatCurrency(receipt.amount, receipt.currency)} - {formatDate(receipt.paymentDate)}
                      </p>
                      {receipt.transactionId && (
                        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                          Transaction ID: {receipt.transactionId}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

