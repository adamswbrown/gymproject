'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
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
  TrophyIcon,
  BuildingStorefrontIcon,
  PhotoIcon
} from '@heroicons/react/24/solid';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <Navbar />
      
      {/* Hero Section with Background Image */}
      <section 
        className="relative"
        style={{
          backgroundImage: 'url(/images/hero-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: '50% 50%',
          backgroundRepeat: 'no-repeat',
          paddingTop: '5px',
          paddingBottom: '5px',
          paddingLeft: '0px',
          paddingRight: '0px',
        }}
      >
        {/* Dark Overlay */}
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: 'var(--color-bg-hero-overlay)' }}
        ></div>
        
        <div className="relative px-4" style={{ maxWidth: 'var(--container-max-width)', margin: '0 auto' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-bold uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-hero)', fontSize: 'var(--font-size-h1)', fontWeight: '700', marginBottom: '0px', lineHeight: 'var(--line-height-h1)' }}>
                Average Joe's Gym
              </h1>
              <h2 className="font-semibold mb-8 uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent-primary)', fontSize: 'var(--font-size-h2)', fontWeight: '700', marginBottom: '0px', lineHeight: 'var(--line-height-h2)' }}>
                We're not fancy. We just show up.
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <IconWrapper size={30}>
                    <CheckBadgeIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <div>
                    <p style={{ color: 'var(--color-text-hero)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                      No guarantees. Just effort.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <IconWrapper size={30}>
                    <ClockIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <div>
                    <p style={{ color: 'var(--color-text-hero)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                      25 minutes. That's it.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <IconWrapper size={30}>
                    <CogIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <div>
                    <p style={{ color: 'var(--color-text-hero)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                      Basic equipment. It works.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <IconWrapper size={30}>
                    <UserGroupIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <div>
                    <p style={{ color: 'var(--color-text-hero)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                      Small groups. Someone tells you what to do.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <IconWrapper size={30}>
                    <HeartIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <div>
                    <p style={{ color: 'var(--color-text-hero)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                      Regular people. No judgment.
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/schedule">
                <ActionButton className="text-lg px-8 py-4">
                  See the Schedule
                </ActionButton>
              </Link>
            </div>
            <div>
              <div className="aspect-video w-full">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/-3vM6P7K2ho"
                  title="Average Joe's Gym"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section style={{ paddingTop: 'var(--spacing-section-default)', paddingBottom: 'var(--spacing-section-default)', paddingLeft: '0px', paddingRight: '0px' }}>
        <div className="mx-auto px-4" style={{ maxWidth: 'var(--container-max-width)' }}>
          <h2 className="font-bold mb-8 text-center uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)', fontSize: 'var(--font-size-h1)', lineHeight: 'var(--line-height-h1)' }}>
            Why train here
          </h2>
          <p className="mb-12 text-center max-w-3xl mx-auto" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
            It's a gym. You train. You leave stronger. No mirrors. No hype. Just people working out together.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-6" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <h3 className="font-bold mb-4 uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent-primary)', fontSize: 'var(--font-size-h2)', lineHeight: 'var(--line-height-h2)' }}>
                What to expect
              </h3>
              <div className="space-y-4">
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
              <h3 className="font-bold mb-4 uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent-primary)', fontSize: 'var(--font-size-h2)', lineHeight: 'var(--line-height-h2)' }}>
                How it works
              </h3>
              <div className="space-y-4">
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
              <h3 className="font-bold mb-4 uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent-primary)', fontSize: 'var(--font-size-h2)', lineHeight: 'var(--line-height-h2)' }}>
                The people
              </h3>
              <div className="space-y-4">
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
              <h3 className="font-bold mb-4 uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent-primary)', fontSize: 'var(--font-size-h2)', lineHeight: 'var(--line-height-h2)' }}>
                What you won't find
              </h3>
              <div className="space-y-4">
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
        </div>
      </section>

      {/* Results Guarantee Section */}
      <section className="text-center" style={{ backgroundColor: 'var(--color-bg-light-green)', paddingTop: '30px', paddingBottom: '25px', paddingLeft: '0px', paddingRight: '0px' }}>
        <div className="mx-auto px-4" style={{ maxWidth: 'var(--container-max-width)' }}>
          <h2 className="font-bold mb-8 uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)', fontSize: 'var(--font-size-h1)', lineHeight: 'var(--line-height-h1)' }}>
            No promises. Just work.
          </h2>
          <Link href={isAuthenticated ? '/schedule' : '/login'}>
            <ActionButton className="text-lg px-8 py-4">
              Book a Session
            </ActionButton>
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ paddingTop: '22px', paddingBottom: 'var(--spacing-section-default)', paddingLeft: '0px', paddingRight: '0px' }}>
        <div className="mx-auto px-4" style={{ maxWidth: 'var(--container-max-width)' }}>
          <h2 className="font-bold mb-12 text-center uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)', fontSize: 'var(--font-size-h1)', lineHeight: 'var(--line-height-h1)' }}>
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
      </section>

      {/* What We Offer Section */}
      <section style={{ backgroundColor: 'var(--color-bg-very-light-green)', paddingTop: 'var(--spacing-section-default)', paddingBottom: 'var(--spacing-section-default)', paddingLeft: '0px', paddingRight: '0px' }}>
        <div className="mx-auto px-4" style={{ maxWidth: 'var(--container-max-width)' }}>
          <h2 className="font-bold mb-12 text-center uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)', fontSize: 'var(--font-size-h1)', lineHeight: 'var(--line-height-h1)' }}>
            What we have
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-subtle)' }}>
              <IconWrapper size={100} className="mb-4">
                <ClockIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
              </IconWrapper>
              <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)', fontSize: 'var(--font-size-h3)', lineHeight: 'var(--line-height-h3)' }}>
                25 minute sessions
              </h3>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                Sessions are 25 minutes. You can fit it in. That's the point.
              </p>
            </div>
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-subtle)' }}>
              <IconWrapper size={100} className="mb-4">
                <UserGroupIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
              </IconWrapper>
              <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)', fontSize: 'var(--font-size-h3)', lineHeight: 'var(--line-height-h3)' }}>
                Small groups
              </h3>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                Small groups. Less intimidating. More manageable.
              </p>
            </div>
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-subtle)' }}>
              <IconWrapper size={100} className="mb-4">
                <SparklesIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
              </IconWrapper>
              <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)', fontSize: 'var(--font-size-h3)', lineHeight: 'var(--line-height-h3)' }}>
                Coach tells you what to do
              </h3>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                Coach runs the session. You follow along. No thinking required.
              </p>
            </div>
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-subtle)' }}>
              <IconWrapper size={100} className="mb-4">
                <HeartIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
              </IconWrapper>
              <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)', fontSize: 'var(--font-size-h3)', lineHeight: 'var(--line-height-h3)' }}>
                People show up
              </h3>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                Same people. Same time. You get to know them. That's it.
              </p>
            </div>
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-subtle)' }}>
              <IconWrapper size={100} className="mb-4">
                <HeartIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
              </IconWrapper>
              <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)', fontSize: 'var(--font-size-h3)', lineHeight: 'var(--line-height-h3)' }}>
                Heart rate monitors
              </h3>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                We track your heart rate. Helps us know if you're working hard enough.
              </p>
            </div>
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-subtle)' }}>
              <IconWrapper size={100} className="mb-4">
                <CogIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
              </IconWrapper>
              <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)', fontSize: 'var(--font-size-h3)', lineHeight: 'var(--line-height-h3)' }}>
                Basic equipment
              </h3>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                Machines adjust to how hard you push. Everyone uses the same equipment. Works for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coaches Section */}
      <section style={{ paddingTop: 'var(--spacing-section-default)', paddingBottom: 'var(--spacing-section-default)', paddingLeft: '0px', paddingRight: '0px' }}>
        <div className="mx-auto px-4" style={{ maxWidth: 'var(--container-max-width)' }}>
          <h2 className="font-bold mb-12 text-center uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)', fontSize: 'var(--font-size-h1)', lineHeight: 'var(--line-height-h1)' }}>
            The coaches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/gav.png" alt="Coach Gav" width={200} height={200} className="mb-4" />
              <h3 className="font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)', fontSize: 'var(--font-size-h3)', lineHeight: 'var(--line-height-h3)' }}>
                Coach Gav
              </h3>
              <p className="mb-4 font-semibold" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                Owner and Head Coach
              </p>
            </div>
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/conor.png" alt="Coach Conor" width={200} height={200} className="mb-4" />
              <h3 className="font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)', fontSize: 'var(--font-size-h3)', lineHeight: 'var(--line-height-h3)' }}>
                Coach Conor
              </h3>
              <p className="mb-4 font-semibold" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                Gym Manager
              </p>
            </div>
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <Image src="/images/michelle.png" alt="Coach Michelle" width={200} height={200} className="mb-4" />
              <h3 className="font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)', fontSize: 'var(--font-size-h3)', lineHeight: 'var(--line-height-h3)' }}>
                Coach Michelle
              </h3>
              <p className="mb-4 font-semibold" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                Coach
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section style={{ backgroundColor: 'var(--color-bg-light-gray)', paddingTop: 'var(--spacing-section-default)', paddingBottom: 'var(--spacing-section-default)', paddingLeft: '0px', paddingRight: '0px' }}>
        <div className="mx-auto px-4" style={{ maxWidth: 'var(--container-max-width)' }}>
          <h2 className="font-bold mb-12 text-center uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)', fontSize: 'var(--font-size-h1)', lineHeight: 'var(--line-height-h1)' }}>
            Things that happened
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-subtle)' }}>
              <IconWrapper size={80} className="mb-4">
                <TrophyIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
              </IconWrapper>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                Someone lost 60 pounds. They kept showing up. That's what it takes.
              </p>
            </div>
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-subtle)' }}>
              <IconWrapper size={80} className="mb-4">
                <TrophyIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
              </IconWrapper>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                First member had sciatica. After six months, it got better. They kept coming.
              </p>
            </div>
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-subtle)' }}>
              <IconWrapper size={80} className="mb-4">
                <TrophyIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
              </IconWrapper>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                Raised some money for a local charity. Members chipped in. That was nice.
              </p>
            </div>
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-subtle)' }}>
              <IconWrapper size={80} className="mb-4">
                <TrophyIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
              </IconWrapper>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                Had a Christmas party. People came. It was fine.
              </p>
            </div>
            <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-subtle)' }}>
              <IconWrapper size={80} className="mb-4">
                <TrophyIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
              </IconWrapper>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                Someone got stronger. Won a golf tournament. Probably helped.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gym Photos Section - Inside Average Joe's Gym */}
      <section style={{ backgroundColor: 'var(--color-bg-dark-section)', paddingTop: 'var(--spacing-section-default)', paddingBottom: 'var(--spacing-section-default)', paddingLeft: '0px', paddingRight: '0px' }}>
        <div className="mx-auto px-4" style={{ maxWidth: 'var(--container-max-width)' }}>
          <h2 className="font-bold mb-12 text-center uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-light)', fontSize: 'var(--font-size-h1)', lineHeight: 'var(--line-height-h1)' }}>
            The gym
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="w-full aspect-video flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <IconWrapper size={120}>
                <PhotoIcon style={{ color: 'var(--color-text-muted)', width: '100%', height: '100%' }} />
              </IconWrapper>
            </div>
            <div className="w-full aspect-video flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <IconWrapper size={120}>
                <PhotoIcon style={{ color: 'var(--color-text-muted)', width: '100%', height: '100%' }} />
              </IconWrapper>
            </div>
            <div className="w-full aspect-video flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <IconWrapper size={120}>
                <PhotoIcon style={{ color: 'var(--color-text-muted)', width: '100%', height: '100%' }} />
              </IconWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* Who You Are Section */}
      <section style={{ backgroundColor: 'var(--color-bg-light-gray)', paddingTop: 'var(--spacing-section-default)', paddingBottom: 'var(--spacing-section-default)', paddingLeft: '0px', paddingRight: '0px' }}>
        <div className="mx-auto px-4" style={{ maxWidth: 'var(--container-max-width)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbKSagQoVyvRnNJfs4kZRJQDk-gb5V8UHUCA&s" alt="Average Joe's Gym" width={300} height={100} className="mb-8" style={{ width: 'auto', height: 'auto' }} />
              <h2 className="font-bold mb-8" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)', fontSize: 'var(--font-size-h1)', lineHeight: 'var(--line-height-h1)' }}>
                Is this for you
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <UserGroupIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>You don't like gyms</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <CheckBadgeIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>You want to get stronger</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <ShieldCheckIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>You hate mirrors and egos</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <HeartIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>You want to train with other people</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <ClockIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>You're busy</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <ClockIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>25 minutes works for you</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <UserGroupIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>You don't want to train alone</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <HeartIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>You want to train with regular people</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <SparklesIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>You don't know what to do</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconWrapper size={40}>
                    <SparklesIcon style={{ color: 'var(--color-accent-primary)', width: '100%', height: '100%' }} />
                  </IconWrapper>
                  <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>You want someone to tell you what to do</p>
                </div>
              </div>
            </div>
            <div className="w-full aspect-square flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              <IconWrapper size={200}>
                <BuildingStorefrontIcon style={{ color: 'var(--color-text-muted)', width: '100%', height: '100%' }} />
              </IconWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* Get Results Section */}
      <section style={{ backgroundColor: 'var(--color-bg-dark-section)', paddingTop: 'var(--spacing-section-default)', paddingBottom: 'var(--spacing-section-default)', paddingLeft: '0px', paddingRight: '0px' }}>
        <div className="mx-auto px-4" style={{ maxWidth: 'var(--container-max-width)' }}>
          <h2 className="font-bold mb-8 text-center uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-light)', fontSize: 'var(--font-size-h1)', lineHeight: 'var(--line-height-h1)' }}>
            Try it
          </h2>
          <p className="mb-8 text-center" style={{ color: 'var(--color-text-light)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
            Come train. See if it works for you. That's all.
          </p>
          <div className="text-center">
            <Link href={isAuthenticated ? '/schedule' : '/login'}>
              <ActionButton className="text-lg px-8 py-4">
                Book a Session
              </ActionButton>
            </Link>
          </div>
        </div>
      </section>

      {/* We Promise Section */}
      <section style={{ backgroundColor: 'var(--color-bg-light-gray-alt)', paddingTop: 'var(--spacing-section-default)', paddingBottom: 'var(--spacing-section-default)', paddingLeft: '0px', paddingRight: '0px' }}>
        <div className="mx-auto px-4" style={{ maxWidth: 'var(--container-max-width)' }}>
          <h2 className="font-bold mb-8 text-center uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark)', fontSize: 'var(--font-size-h1)', lineHeight: 'var(--line-height-h1)' }}>
            That's it
          </h2>
          <p className="mb-8 text-center" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
            Show up. Train. Leave stronger. Repeat.
          </p>
          <div className="text-center">
            <Link href={isAuthenticated ? '/schedule' : '/login'}>
              <ActionButton className="text-lg px-8 py-4">
                Train With Us
              </ActionButton>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
