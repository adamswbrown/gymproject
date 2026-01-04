'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';

export function Navbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollHeader, setScrollHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 50) {
        setScrollHeader(true);
      } else {
        setScrollHeader(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { href: '#home', label: 'Home' },
    { href: '#program', label: 'Program' },
    { href: '#choose', label: 'Choose Us' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#schedule', label: 'Schedule' },
    { href: '#footer', label: 'Contact' },
  ];

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`header ${scrollHeader ? 'scroll-header' : ''}`} id="header">
      <nav className="nav container">
        <Link href="#home" className="nav__logo">
          <Image 
            src="/logo.png" 
            alt="Average Joe's Gym" 
            width={120}
            height={40}
            style={{ height: '2.5rem', width: 'auto' }}
            priority
          />
        </Link>

        <div className={`nav__menu ${mobileMenuOpen ? 'show-menu' : ''}`} id="nav-menu">
          <ul className="nav__list">
            {navLinks.map((link) => (
              <li key={link.href} className="nav__item">
                <a 
                  href={link.href}
                  className="nav__link"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </a>
              </li>
            ))}
            
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <>
                    <li className="nav__item">
                      <Link 
                        href={getDashboardPath()}
                        className="nav__link"
                        onClick={closeMobileMenu}
                      >
                        My Account
                      </Link>
                    </li>
                    <li className="nav__item">
                      <Link 
                        href="/schedule" 
                        className="nav__link"
                        onClick={closeMobileMenu}
                      >
                        Schedule
                      </Link>
                    </li>
                    {user?.role === 'MEMBER' && (
                      <>
                        <li className="nav__item">
                          <Link 
                            href="/dashboard/member/memberships"
                            className="nav__link"
                            onClick={closeMobileMenu}
                          >
                            Memberships
                          </Link>
                        </li>
                        <li className="nav__item">
                          <Link 
                            href="/store"
                            className="nav__link"
                            onClick={closeMobileMenu}
                          >
                            Store
                          </Link>
                        </li>
                        <li className="nav__item">
                          <Link 
                            href="/forms-and-waivers"
                            className="nav__link"
                            onClick={closeMobileMenu}
                          >
                            Forms
                          </Link>
                        </li>
                      </>
                    )}
                    <li className="nav__item">
                      <button
                        className="nav__button"
                        onClick={() => {
                          logout();
                          closeMobileMenu();
                        }}
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav__item">
                      <Link 
                        href="/login"
                        className="nav__link"
                        onClick={closeMobileMenu}
                      >
                        Log in
                      </Link>
                    </li>
                    <li className="nav__item">
                      <Link 
                        href="/register"
                        className="nav__button"
                        onClick={closeMobileMenu}
                      >
                        Join
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
          <div className="nav__close" id="nav-close" onClick={closeMobileMenu}>
            <i className="ri-close-line"></i>
          </div>
        </div>

        <div className="nav__toggle" id="nav-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <i className="ri-menu-line"></i>
        </div>
      </nav>
    </header>
  );
}
