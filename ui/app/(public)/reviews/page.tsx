'use client';

import { ActionButton } from '@/components/ui/ActionButton';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function ReviewsPage() {
  const { isAuthenticated } = useAuth();

  const testimonials = [
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
  ];

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <h1 className="font-oswald uppercase font-bold text-4xl sm:text-5xl text-center" style={{ color: 'var(--color-text-dark)' }}>
            What people say
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="p-6" 
                style={{ 
                  backgroundColor: 'var(--color-bg-secondary)', 
                  border: '1px solid var(--color-border-subtle)' 
                }}
              >
                <p className="mb-4 italic font-inter text-base leading-7" style={{ color: 'var(--color-text-primary)' }}>
                  "{testimonial.text}"
                </p>
                <p className="font-semibold font-inter text-base leading-7" style={{ color: 'var(--color-text-dark)' }}>
                  {testimonial.name}
                </p>
              </div>
            ))}
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
