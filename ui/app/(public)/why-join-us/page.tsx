'use client';

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
    <section className="py-10 sm:py-14">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <h1 className="font-oswald uppercase font-bold text-4xl sm:text-5xl text-center" style={{ color: 'var(--color-text-dark)' }}>
            Why train here
          </h1>
          
          <p className="font-inter text-base leading-7 text-center max-w-3xl mx-auto" style={{ color: 'var(--color-text-primary)' }}>
            It's a gym. You train. You leave stronger. No mirrors. No hype. Just people working out together. If you don't like typical gyms, this might work for you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-accent-primary)' }}>
                What to expect
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <CheckBadgeIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>If you do the work, you'll get better</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <CheckBadgeIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>No promises. No guarantees.</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <CheckBadgeIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>All fitness levels welcome</p>
                </div>
              </div>
            </div>

            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-accent-primary)' }}>
                How it works
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <ClockIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>25 minutes. Show up. Do the work.</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <ClockIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>You might be sore. That's normal.</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <ClockIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>Everyone works at their own pace</p>
                </div>
              </div>
            </div>

            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-accent-primary)' }}>
                The people
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <UserGroupIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>Coaches who know what they're doing</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <UserGroupIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>Sometimes we do things outside the gym</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <UserGroupIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>It's still a gym. But people talk to each other.</p>
                </div>
              </div>
            </div>

            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-accent-primary)' }}>
                What you won't find
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <ShieldCheckIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>No mirrors. We don't have them.</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <ShieldCheckIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>No one's watching you. Everyone's working.</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <ShieldCheckIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>No bodybuilders. Just regular people trying to get stronger.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href={isAuthenticated ? '/schedule' : '/login'}>
              <ActionButton className="px-4 py-2 font-oswald uppercase">
                Book a Session
              </ActionButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
