'use client';

import Link from 'next/link';

export function TopHeader() {
  return (
    <div 
      className="py-2 px-4" 
      style={{ 
        backgroundColor: 'var(--color-bg-dark)', 
        color: 'var(--color-text-light)',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--font-size-body)',
        lineHeight: 'var(--line-height-body)'
      }}
    >
      <div className="mx-auto flex flex-wrap items-center justify-between gap-4" style={{ maxWidth: 'var(--container-max-width)' }}>
        <div className="flex items-center gap-1">
          <span>📍</span>
          <span>749 East Temple Street, Los Angeles, CA 90012</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span>📞</span>
            <span>(213) 555-0198</span>
          </div>
          <Link 
            href="mailto:info@averagejoesgym.com"
            className="hover:underline"
            style={{ color: 'var(--color-text-light)' }}
          >
            ✉️ info@averagejoesgym.com
          </Link>
          <Link 
            href="https://www.google.com/maps/search/749+East+Temple+Street,+Los+Angeles,+CA+90012"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: 'var(--color-text-light)' }}
          >
            🗺️ Get Directions
          </Link>
        </div>
      </div>
    </div>
  );
}

