'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ActionButton } from '@/components/ui/ActionButton';
import { TestimonialsCarousel } from '@/components/ui/TestimonialsCarousel';
import { IconWrapper } from '@/components/ui/IconWrapper';
import { useAuth } from '@/hooks/useAuth';
import { 
  CheckBadgeIcon, 
  ClockIcon, 
  CogIcon, 
  UserGroupIcon, 
  HeartIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-10 sm:py-14" style={{
        backgroundImage: 'url(/images/hero-background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%',
        backgroundRepeat: 'no-repeat',
      }}>
        {/* Dark Overlay */}
        <div className="absolute inset-0" style={{ backgroundColor: 'var(--color-bg-hero-overlay)' }}></div>
        
        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <h1 className="font-oswald uppercase font-bold text-4xl sm:text-5xl" style={{ color: 'var(--color-text-hero)' }}>
              Average Joe's Gym
            </h1>
            <p className="font-inter text-base leading-7 max-w-2xl" style={{ color: 'var(--color-text-hero)' }}>
              We're not fancy. We just show up.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/schedule">
                <ActionButton className="px-4 py-2 font-oswald uppercase">
                  See the Schedule
                </ActionButton>
              </Link>
              {isAuthenticated && (
                <Link href="/schedule">
                  <ActionButton variant="secondary" className="px-4 py-2 font-oswald uppercase">
                    Book a Session
                  </ActionButton>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl text-center" style={{ color: 'var(--color-text-dark)' }}>
              Why train here
            </h2>
            <p className="font-inter text-base leading-7 text-center max-w-3xl mx-auto" style={{ color: 'var(--color-text-primary)' }}>
              It's a gym. You train. You leave stronger. No mirrors. No hype. Just people working out together. If you don't like typical gyms, this might work for you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h3 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-accent-primary)' }}>
                What to expect
              </h3>
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
              <h3 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-accent-primary)' }}>
                How it works
              </h3>
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
              <h3 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-accent-primary)' }}>
                The people
              </h3>
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
              <h3 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-accent-primary)' }}>
                What you won't find
              </h3>
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
          </div>
        </div>
      </section>

      {/* Mid-Page CTA Section */}
      <section className="text-center py-10 sm:py-14" style={{ backgroundColor: 'var(--color-bg-light-green)' }}>
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl" style={{ color: 'var(--color-text-dark)' }}>
              No promises. Just work.
            </h2>
            <p className="font-inter text-base leading-7 max-w-2xl mx-auto" style={{ color: 'var(--color-text-primary)' }}>
              Come train. See if it works for you. If you show up and do the work, you'll get stronger. That's all we can promise.
            </p>
            <Link href={isAuthenticated ? '/schedule' : '/login'}>
              <ActionButton className="px-4 py-2 font-oswald uppercase">
                Book a Session
              </ActionButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl text-center" style={{ color: 'var(--color-text-dark)' }}>
              What people say
            </h2>
          <TestimonialsCarousel testimonials={[
            {
              name: 'Heather Stevenson',
              text: "I've been coming here for 3 months. Sessions are short which works for my schedule. I'm stronger now. No more knee pain. The coaches know what they're doing. I keep showing up."
            },
            {
              name: 'Stefanie Eisenstadt',
              text: "My husband and I started when we weren't getting anywhere on our own. We did 3 months to see how it went. The structured sessions help. Other members are fine. We're both stronger now. We signed up for the year."
            },
            {
              name: 'Dawn Miskelly',
              text: "Been here 10 months. I hadn't exercised in years. Now I come every week. It helps. Sessions are short so I can fit them in. Coaches push you but not too hard. Members are decent people. If you're stuck, try it."
            },
            {
              name: 'Niomi Brians',
              text: "I've been here over a year. I stopped exercising during Covid. This got me back into it. Coaches know their stuff. They help with exercise and nutrition. I've met some people here. It works for me."
            },
            {
              name: 'Jennifer Brehaut',
              text: "I joined recently. Lost my confidence over the years. Needed somewhere to get back into it. This works. People are fine. Sessions are manageable. I can fit them in. I keep coming back."
            },
            {
              name: 'Sarah Rankin',
              text: "This is helping me get healthier. I'm not an exercise person. I only ever liked walking. But this works. I miss it if I don't go. Sessions are short but they work. The app makes booking easy. Coaches are decent. I fit in here."
            },
            {
              name: 'Leighann Edgar',
              text: "It's not a typical gym. No mirrors. No one flexing. Just regular people working out. Coaches are fine. There's a kids room which helps."
            },
            {
              name: 'Alicia',
              text: "I started in July. I was nervous. Coach introduced herself. People were fine. After the session my legs were done but I felt okay. It's still tough 8 weeks in but I keep showing up. People are decent."
            }
          ]} />
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-10 sm:py-14" style={{ backgroundColor: 'var(--color-bg-very-light-green)' }}>
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl text-center" style={{ color: 'var(--color-text-dark)' }}>
              What we have
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-subtle)' }}>
              <IconWrapper size={100} className="mb-4">
                <ClockIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
              </IconWrapper>
              <h3 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-text-dark)' }}>
                25 minute sessions
              </h3>
              <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                Sessions are 25 minutes. You can fit it in. That's the point.
              </p>
            </div>
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-subtle)' }}>
              <IconWrapper size={100} className="mb-4">
                <UserGroupIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
              </IconWrapper>
              <h3 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-text-dark)' }}>
                Small groups
              </h3>
              <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                Small groups. Less intimidating. More manageable.
              </p>
            </div>
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-subtle)' }}>
              <IconWrapper size={100} className="mb-4">
                <SparklesIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
              </IconWrapper>
              <h3 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-text-dark)' }}>
                Coach tells you what to do
              </h3>
              <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                Coach runs the session. You follow along. No thinking required.
              </p>
            </div>
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-subtle)' }}>
              <IconWrapper size={100} className="mb-4">
                <HeartIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
              </IconWrapper>
              <h3 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-text-dark)' }}>
                People show up
              </h3>
              <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                Same people. Same time. You get to know them. That's it.
              </p>
            </div>
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-subtle)' }}>
              <IconWrapper size={100} className="mb-4">
                <HeartIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
              </IconWrapper>
              <h3 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-text-dark)' }}>
                Heart rate monitors
              </h3>
              <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                We track your heart rate. Helps us know if you're working hard enough.
              </p>
            </div>
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-subtle)' }}>
              <IconWrapper size={100} className="mb-4">
                <CogIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
              </IconWrapper>
              <h3 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-4" style={{ color: 'var(--color-text-dark)' }}>
                Basic equipment
              </h3>
              <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                Machines adjust to how hard you push. Everyone uses the same equipment. Works for everyone.
              </p>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Coaches Section */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl text-center" style={{ color: 'var(--color-text-dark)' }}>
              The coaches
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/gav.png" alt="Coach Gav" width={200} height={200} className="mb-4" />
              <h3 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-2" style={{ color: 'var(--color-text-dark)' }}>
                Coach Gav
              </h3>
              <p className="mb-4 font-semibold font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                Owner and Head Coach
              </p>
            </div>
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/conor.png" alt="Coach Conor" width={200} height={200} className="mb-4" />
              <h3 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-2" style={{ color: 'var(--color-text-dark)' }}>
                Coach Conor
              </h3>
              <p className="mb-4 font-semibold font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                Gym Manager
              </p>
            </div>
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/michelle.png" alt="Coach Michelle" width={200} height={200} className="mb-4" />
              <h3 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-2" style={{ color: 'var(--color-text-dark)' }}>
                Coach Michelle
              </h3>
              <p className="mb-4 font-semibold font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                Coach
              </p>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Who You Are Section */}
      <section className="py-10 sm:py-14" style={{ backgroundColor: 'var(--color-bg-light-gray)' }}>
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbKSagQoVyvRnNJfs4kZRJQDk-gb5V8UHUCA&s" alt="Average Joe's Gym" width={300} height={100} className="mb-8" style={{ width: 'auto', height: 'auto' }} />
              <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl" style={{ color: 'var(--color-text-dark)' }}>
                Is this for you
              </h2>
              <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                If you don't like typical gyms, this might work. It's still a gym. Just different.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <UserGroupIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>You don't like gyms</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <CheckBadgeIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>You want to get stronger</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <ShieldCheckIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>You hate mirrors and egos</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <HeartIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>You want to train with other people</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <ClockIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>You're busy</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <ClockIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>25 minutes works for you</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <UserGroupIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>You don't want to train alone</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <HeartIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>You want to train with regular people</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <SparklesIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>You don't know what to do</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <SparklesIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>You want someone to tell you what to do</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-oswald uppercase font-bold text-2xl sm:text-3xl mb-6" style={{ color: 'var(--color-text-dark)' }}>
                Are you a good fit?
              </h3>
              <p className="mb-6 font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                We're a small gym. We know everyone's name. We care about results, not numbers. If you're looking for something different from a typical gym, we might be a good fit.
              </p>
              <p className="mb-6 font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                It's not for everyone. But if you're willing to show up and do the work, we'll help you get stronger.
              </p>
              <Link href={isAuthenticated ? '/schedule' : '/login'}>
                <ActionButton className="px-4 py-2 font-oswald uppercase">
                  Book a Session
                </ActionButton>
              </Link>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-10 sm:py-14 text-center" style={{ backgroundColor: 'var(--color-bg-light-gray-alt)' }}>
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <h2 className="font-oswald uppercase font-bold text-2xl sm:text-3xl" style={{ color: 'var(--color-text-dark)' }}>
              That's it
            </h2>
            <p className="font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
              Show up. Train. Leave stronger. Repeat.
            </p>
            <Link href={isAuthenticated ? '/schedule' : '/login'}>
              <ActionButton className="px-4 py-2 font-oswald uppercase">
                Book a Session
              </ActionButton>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
