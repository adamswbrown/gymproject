'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { ActionButton } from '../ui/ActionButton';
import { TopHeader } from './TopHeader';
import { useState } from 'react';

export function Navbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return '/dashboard';
    switch (user.role) {
      case 'MEMBER':
        return '/dashboard/member/bookings';
      case 'INSTRUCTOR':
        return '/dashboard/instructor/sessions';
      case 'ADMIN':
        return '/dashboard/admin/class-types';
      default:
        return '/dashboard';
    }
  };

  const navLinks = [
    { href: '/why-join-us', label: 'Why Join Us' },
    { href: '/what-we-offer', label: 'What we offer' },
    { href: '/reviews', label: 'Reviews' },
    { href: '/coaches', label: 'Coaches' },
    { href: '/who-you-are', label: 'Who you are' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact-us', label: 'Contact Us' },
  ];

  return (
    <>
      <TopHeader />
      <nav style={{ backgroundColor: 'var(--color-bg-dark)', height: 'var(--navbar-height)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--container-max-width)' }}>
        <div className="flex items-center justify-between" style={{ height: 'var(--navbar-height)' }}>
          <Link href="/" className="flex items-center">
            <Image 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbKSagQoVyvRnNJfs4kZRJQDk-gb5V8UHUCA&s" 
              alt="Average Joe's Gym" 
              width={245} 
              height={71}
              className="h-auto"
              style={{ width: 'auto', height: '71px' }}
              loading="eager"
              priority
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="transition-colors hover:opacity-80"
                style={{ 
                  color: 'var(--color-text-light)', 
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                {link.label}
              </Link>
            ))}
            
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <>
                    <Link 
                      href={getDashboardPath()}
                      className="transition-colors hover:opacity-80"
                      style={{ 
                        color: 'rgb(0, 255, 0)', 
                        fontFamily: 'var(--font-body)',
                        fontSize: '17px',
                        fontWeight: '500'
                      }}
                    >
                      My Account
                    </Link>
                    <Link 
                      href="/schedule" 
                      className="transition-colors hover:opacity-80"
                      style={{ 
                        color: 'rgb(0, 255, 0)', 
                        fontFamily: 'var(--font-body)',
                        fontSize: '17px',
                        fontWeight: '500'
                      }}
                    >
                      Schedule
                    </Link>
                    {user?.role === 'MEMBER' && (
                      <>
                        <Link 
                          href="/dashboard/member/memberships" 
                          className="transition-colors hover:opacity-80"
                          style={{ 
                            color: 'rgb(0, 255, 0)', 
                            fontFamily: 'var(--font-body)',
                            fontSize: '17px',
                            fontWeight: '500'
                          }}
                        >
                          Memberships
                        </Link>
                        <Link 
                          href="/store" 
                          className="transition-colors hover:opacity-80"
                          style={{ 
                            color: 'rgb(0, 255, 0)', 
                            fontFamily: 'var(--font-body)',
                            fontSize: '17px',
                            fontWeight: '500'
                          }}
                        >
                          Store
                        </Link>
                        <Link 
                          href="/forms-and-waivers" 
                          className="transition-colors hover:opacity-80"
                          style={{ 
                            color: 'rgb(0, 255, 0)', 
                            fontFamily: 'var(--font-body)',
                            fontSize: '17px',
                            fontWeight: '500'
                          }}
                        >
                          Forms and Waivers
                        </Link>
                      </>
                    )}
                    <ActionButton 
                      variant="secondary" 
                      onClick={logout}
                      className="text-sm py-2 px-4"
                    >
                      Logout
                    </ActionButton>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <ActionButton variant="secondary" className="text-sm py-2 px-4">
                        Log in
                      </ActionButton>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: 'var(--color-text-light)' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 transition-colors hover:opacity-80"
                style={{ 
                  color: 'var(--color-text-light)', 
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                {link.label}
              </Link>
            ))}
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <>
                    <Link 
                      href={getDashboardPath()}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 transition-colors hover:opacity-80"
                      style={{ 
                        color: 'rgb(0, 255, 0)', 
                        fontFamily: 'var(--font-body)',
                        fontSize: '17px',
                        fontWeight: '500'
                      }}
                    >
                      My Account
                    </Link>
                    <Link 
                      href="/schedule"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 transition-colors hover:opacity-80"
                      style={{ 
                        color: 'rgb(0, 255, 0)', 
                        fontFamily: 'var(--font-body)',
                        fontSize: '17px',
                        fontWeight: '500'
                      }}
                    >
                      Schedule
                    </Link>
                    {user?.role === 'MEMBER' && (
                      <>
                        <Link 
                          href="/dashboard/member/memberships"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-2 transition-colors hover:opacity-80"
                          style={{ 
                            color: 'rgb(0, 255, 0)', 
                            fontFamily: 'var(--font-body)',
                            fontSize: '17px',
                            fontWeight: '500'
                          }}
                        >
                          Memberships
                        </Link>
                        <Link 
                          href="/store"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-2 transition-colors hover:opacity-80"
                          style={{ 
                            color: 'rgb(0, 255, 0)', 
                            fontFamily: 'var(--font-body)',
                            fontSize: '17px',
                            fontWeight: '500'
                          }}
                        >
                          Store
                        </Link>
                        <Link 
                          href="/forms-and-waivers"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-2 transition-colors hover:opacity-80"
                          style={{ 
                            color: 'rgb(0, 255, 0)', 
                            fontFamily: 'var(--font-body)',
                            fontSize: '17px',
                            fontWeight: '500'
                          }}
                        >
                          Forms and Waivers
                        </Link>
                      </>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="block py-2 transition-colors hover:opacity-80"
                      style={{ 
                        color: 'rgb(0, 255, 0)', 
                        fontFamily: 'var(--font-body)',
                        fontSize: '17px',
                        fontWeight: '500'
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 transition-colors hover:opacity-80"
                      style={{ 
                        color: 'rgb(0, 255, 0)', 
                        fontFamily: 'var(--font-body)',
                        fontSize: '17px',
                        fontWeight: '500'
                      }}
                    >
                      Log in
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
    </>
  );
}

