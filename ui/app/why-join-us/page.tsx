'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ActionButton } from '@/components/ui/ActionButton';
import { IconWrapper } from '@/components/ui/IconWrapper';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { 
  CheckBadgeIcon, 
  ClockIcon, 
  UserGroupIcon, 
  ShieldCheckIcon
} from '@heroicons/react/24/solid';

export default function WhyJoinUsPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <Navbar />
      
      <main className="flex-1" style={{ paddingTop: 'var(--spacing-section-default)', paddingBottom: 'var(--spacing-section-default)', paddingLeft: '0px', paddingRight: '0px' }}>
        <div className="mx-auto px-4" style={{ maxWidth: 'var(--container-max-width)' }}>
          <h1 className="font-bold mb-8 text-center uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)', fontSize: 'var(--font-size-h1)', lineHeight: 'var(--line-height-h1)' }}>
            Why train here
          </h1>
          
          <p className="mb-12 text-center max-w-3xl mx-auto" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
            It's a gym. You train. You leave stronger. No mirrors. No hype. Just people working out together. If you don't like typical gyms, this might work for you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h2 className="font-bold mb-4 uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent-primary)', fontSize: 'var(--font-size-h2)', lineHeight: 'var(--line-height-h2)' }}>
                What to expect
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <CheckBadgeIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>If you do the work, you'll get better</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <CheckBadgeIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>No promises. No guarantees.</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <CheckBadgeIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>All fitness levels welcome</p>
                </div>
              </div>
            </div>

            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h2 className="font-bold mb-4 uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent-primary)', fontSize: 'var(--font-size-h2)', lineHeight: 'var(--line-height-h2)' }}>
                How it works
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <ClockIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>25 minutes. Show up. Do the work.</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <ClockIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>You might be sore. That's normal.</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <ClockIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>Everyone works at their own pace</p>
                </div>
              </div>
            </div>

            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h2 className="font-bold mb-4 uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent-primary)', fontSize: 'var(--font-size-h2)', lineHeight: 'var(--line-height-h2)' }}>
                The people
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <UserGroupIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>Coaches who know what they're doing</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <UserGroupIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>Sometimes we do things outside the gym</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <UserGroupIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>It's still a gym. But people talk to each other.</p>
                </div>
              </div>
            </div>

            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h2 className="font-bold mb-4 uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent-primary)', fontSize: 'var(--font-size-h2)', lineHeight: 'var(--line-height-h2)' }}>
                What you won't find
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <ShieldCheckIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>No mirrors. We don't have them.</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <ShieldCheckIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>No one's watching you. Everyone's working.</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <ShieldCheckIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>No bodybuilders. Just regular people trying to get stronger.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href={isAuthenticated ? '/schedule' : '/login'}>
              <ActionButton className="text-lg px-8 py-4">
                {isAuthenticated ? 'Book a Session' : 'Book a Session'}
              </ActionButton>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

