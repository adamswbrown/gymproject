'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {

  return (
    <footer className="border-t mt-auto" style={{ backgroundColor: 'var(--color-bg-dark)', borderColor: 'var(--color-border-dark)' }}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ maxWidth: 'var(--container-max-width)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <Image 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbKSagQoVyvRnNJfs4kZRJQDk-gb5V8UHUCA&s" 
              alt="Average Joe's Gym" 
              width={200} 
              height={67} 
              className="mb-6" 
              style={{ width: 'auto', height: 'auto' }} 
            />
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-light)' }}>
                  Address
                </h4>
                <p className="text-sm" style={{ color: 'var(--color-text-light)', fontFamily: 'var(--font-body)', opacity: 0.8 }}>
                  749 East Temple Street<br />
                  Los Angeles, CA 90012
                </p>
              </div>
              <div>
                <h4 className="text-sm font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-light)' }}>
                  Phone
                </h4>
                <p className="text-sm" style={{ color: 'var(--color-text-light)', fontFamily: 'var(--font-body)', opacity: 0.8 }}>
                  (213) 555-0198
                </p>
              </div>
              <div>
                <h4 className="text-sm font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-light)' }}>
                  Email
                </h4>
                <Link 
                  href="mailto:info@averagejoesgym.com"
                  className="text-sm hover:underline"
                  style={{ color: 'var(--color-text-light)', fontFamily: 'var(--font-body)', opacity: 0.8 }}
                >
                  info@averagejoesgym.com
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-8" style={{ borderColor: 'var(--color-border-dark)' }}>
          <p className="text-sm text-center" style={{ color: 'var(--color-text-light)', fontFamily: 'var(--font-body)', opacity: 0.8 }}>
            Copyright 2026 Average Joe's Gym.{' '}
            <Link href="/privacy-policy/" className="hover:underline" style={{ color: 'var(--color-text-light)' }}>
              Privacy Policy.
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

