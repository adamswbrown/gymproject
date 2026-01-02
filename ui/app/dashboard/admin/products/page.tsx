'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { Modal } from '@/components/ui/Modal';
import { ModalFooter } from '@/components/ui/ModalFooter';
import { DismissibleError } from '@/components/ui/DismissibleError';
import { useRequireRole } from '@/hooks/useRequireRole';
import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  type ProductResponse,
  type CreateProductDto,
} from '@/lib/api';

export default function AdminProductsPage() {
  const { hasAccess, isLoading: roleLoading, accessDenied } = useRequireRole('ADMIN');
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateProductDto>({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    active: true,
  });

  useEffect(() => {
    if (hasAccess) {
      loadProducts();
    }
  }, [hasAccess]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await createAdminProduct(formData);
      setIsCreateModalOpen(false);
      setFormData({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        active: true,
      });
      loadProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      setError(null);
      await updateAdminProduct(editingId, formData);
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        active: true,
      });
      loadProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      setError(null);
      await deleteAdminProduct(id);
      loadProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
    }
  };

  const handleEdit = (product: ProductResponse) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      imageUrl: product.imageUrl || '',
      active: product.active,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Products" />
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <PageHeader title="Products" />
        <ActionButton variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          Create Product
        </ActionButton>
      </div>

      {error && (
        <DismissibleError
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      <div className="space-y-4">
        {products.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
            No products found.
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="p-6"
              style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                      {product.name}
                    </h3>
                    <span
                      className="px-2 py-1 text-xs"
                      style={{
                        backgroundColor: product.active ? 'var(--color-accent-primary)' : 'var(--color-text-muted)',
                        color: 'white',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {product.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {product.description && (
                    <p className="mb-2" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                      {product.description}
                    </p>
                  )}
                  <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                    {formatCurrency(product.price)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <ActionButton variant="secondary" onClick={() => handleEdit(product)}>
                    Edit
                  </ActionButton>
                  <ActionButton variant="secondary" onClick={() => handleDelete(product.id)}>
                    Delete
                  </ActionButton>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create Product">
        <form onSubmit={handleCreate}>
          <div className="space-y-4">
            <div>
              <label className="block mb-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border"
                style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
              />
            </div>
            <div>
              <label className="block mb-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border"
                rows={3}
                style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
              />
            </div>
            <div>
              <label className="block mb-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                Price (£) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 border"
                style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
              />
            </div>
            <div>
              <label className="block mb-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full p-2 border"
                style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
              />
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>Active</span>
              </label>
            </div>
          </div>
          <ModalFooter>
            <ActionButton type="submit" variant="primary">
              Create
            </ActionButton>
            <ActionButton type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </ActionButton>
          </ModalFooter>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingId} onClose={() => setEditingId(null)} title="Edit Product">
        <form onSubmit={handleUpdate}>
          <div className="space-y-4">
            <div>
              <label className="block mb-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border"
                style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
              />
            </div>
            <div>
              <label className="block mb-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border"
                rows={3}
                style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
              />
            </div>
            <div>
              <label className="block mb-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                Price (£) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 border"
                style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
              />
            </div>
            <div>
              <label className="block mb-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full p-2 border"
                style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
              />
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>Active</span>
              </label>
            </div>
          </div>
          <ModalFooter>
            <ActionButton type="submit" variant="primary">
              Save
            </ActionButton>
            <ActionButton type="button" variant="secondary" onClick={() => setEditingId(null)}>
              Cancel
            </ActionButton>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}

