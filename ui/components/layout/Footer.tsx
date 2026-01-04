'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="footer section" id="footer">
      <div className="footer__container container grid">
        <div>
          <Link href="#home" className="footer__logo">
            <Image 
              src="/logo.png" 
              alt="Average Joe's Gym" 
              width={150}
              height={50}
              style={{ height: '4rem', width: 'auto' }}
            />
          </Link>
          <p className="footer__description">
            Subscribe for company <br /> updates below.
          </p>
        </div>

        <div className="footer__content grid">
          <div>
            <h3 className="footer__title">Services</h3>
            <ul className="footer__links">
              <li>
                <Link href="#program" className="footer__link">Programs</Link>
              </li>
              <li>
                <Link href="#schedule" className="footer__link">Schedule</Link>
              </li>
              <li>
                <Link href="#choose" className="footer__link">Why Choose Us</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer__title">Company</h3>
            <ul className="footer__links">
              <li>
                <Link href="#about" className="footer__link">About Us</Link>
              </li>
              <li>
                <Link href="#contact" className="footer__link">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer__title">Contact</h3>
            <ul className="footer__links">
              <li className="footer__link">749 East Temple Street</li>
              <li className="footer__link">Los Angeles, CA 90012</li>
              <li>
                <Link href="mailto:info@averagejoesgym.com" className="footer__link">
                  info@averagejoesgym.com
                </Link>
              </li>
              <li className="footer__link">(213) 555-0198</li>
            </ul>
          </div>
        </div>

        <div className="footer__social">
          <a href="https://www.facebook.com/" className="footer__social-link" target="_blank" rel="noopener noreferrer">
            <i className="ri-facebook-fill"></i>
          </a>
          <a href="https://twitter.com/" className="footer__social-link" target="_blank" rel="noopener noreferrer">
            <i className="ri-twitter-fill"></i>
          </a>
          <a href="https://www.instagram.com/" className="footer__social-link" target="_blank" rel="noopener noreferrer">
            <i className="ri-instagram-fill"></i>
          </a>
        </div>

        <p className="footer__copy">
          &#169; Copyright Average Joe's Gym. All rights reserved
        </p>
      </div>
    </footer>
  );
}
