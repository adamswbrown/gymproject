'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getPublicSchedule, createBooking } from '@/lib/api';
import type { ScheduleResponse } from '@/lib/api';

export default function Home() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<ScheduleResponse[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        const data = await getPublicSchedule({
          from: firstDay.toISOString(),
          to: lastDay.toISOString(),
        });
        setSessions(data);
      } catch (err) {
        console.error('Failed to load schedule:', err);
      } finally {
        setScheduleLoading(false);
      }
    };

    loadSchedule();
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleBook = async (sessionId: string) => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/');
      return;
    }

    if (user?.role !== 'MEMBER') {
      router.push('/dashboard');
      return;
    }

    try {
      setBookingError(null);
      await createBooking(sessionId);
      // Reload schedule
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const data = await getPublicSchedule({
        from: firstDay.toISOString(),
        to: lastDay.toISOString(),
      });
      setSessions(data);
    } catch (err: any) {
      setBookingError(err.message || 'Failed to book class');
    }
  };

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      router.push('/register');
    } else if (user?.role === 'MEMBER') {
      const scheduleElement = document.getElementById('schedule');
      if (scheduleElement) {
        scheduleElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <>
      {/*==================== HOME ====================*/}
      <section className="home section" id="home">
        <div className="home__container container grid">
          <div className="home__data">
            <span className="home__subtitle">MAKE YOUR</span>
            <h1 className="home__title">BODY SHAPE</h1>
            <p className="home__description">
              In here we will help you to shape and build your ideal 
              body and live your life to the fullest.
            </p>
            <a href="#schedule" className="button" onClick={(e) => {
              e.preventDefault();
              handleGetStarted();
            }}>
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/*==================== PROGRAM ====================*/}
      <section className="program section" id="program">
        <div className="container">
          <div className="section__data">
            <span className="section__subtitle">Our Program</span>
            <div className="section__titles">
              <h2 className="section__title-border">BUILD YOUR</h2>
              <h2 className="section__title">BEST BODY</h2>
            </div>
          </div>

          <div className="program__container grid">
            <article className="program__card">
              <div className="program__shape">
                <img src="/images/program1.png" alt="" className="program__img" />
              </div>
              <h3 className="program__title">Flex Muscle</h3>
              <p className="program__description">
                Creating tension that's temporarily making the muscle 
                fibers smaller or contracted.
              </p>
            </article>

            <article className="program__card">
              <div className="program__shape">
                <img src="/images/program2.png" alt="" className="program__img" />
              </div>
              <h3 className="program__title">Cardio Exercise</h3>
              <p className="program__description">
                Exercise your heart rate up and keeps it 
                up for a prolonged period of time.
              </p>
            </article>

            <article className="program__card">
              <div className="program__shape">
                <img src="/images/program3.png" alt="" className="program__img" />
              </div>
              <h3 className="program__title">Basic Yoga</h3>
              <p className="program__description">
                Diaphragmatic this is the most common breathing 
                technique you'll find in yoga.
              </p>
            </article>

            <article className="program__card">
              <div className="program__shape">
                <img src="/images/program4.png" alt="" className="program__img" />
              </div>
              <h3 className="program__title">Weight Lifting</h3>
              <p className="program__description">
                Attempts a maximum weight single lift of a 
                barbell loaded with weight plates.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/*==================== CHOOSE US ====================*/}
      <section className="choose section" id="choose">
        <div className="choose__overflow">
          <div className="choose__container container grid">
            <div className="choose__content">
              <div className="section__data">
                <span className="section__subtitle">Best Reason</span>
                <div className="section__titles">
                  <h2 className="section__title-border">WHY</h2>
                  <h2 className="section__title">CHOOSE US ?</h2>
                </div>
              </div>

              <p className="choose__description">
                Choose your favorite class and start now. Remember the 
                only bad workout is the one you didn't do.
              </p>

              <div className="choose__data">
                <div className="choose__group">
                  <h3 className="choose__number">200+</h3>
                  <p className="choose__subtitle">Total Members</p>
                </div>

                <div className="choose__group">
                  <h3 className="choose__number">50+</h3>
                  <p className="choose__subtitle">Best trainers</p>
                </div>

                <div className="choose__group">
                  <h3 className="choose__number">25+</h3>
                  <p className="choose__subtitle">Programs</p>
                </div>

                <div className="choose__group">
                  <h3 className="choose__number">100+</h3>
                  <p className="choose__subtitle">Awards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*==================== PRICING ====================*/}
      <section className="pricing section" id="pricing">
        <div className="container">
          <div className="section__data">
            <span className="section__subtitle">Pricing</span>
            <div className="section__titles">
              <h2 className="section__title-border">OUR</h2>
              <h2 className="section__title">SPECIAL PLAN</h2>
            </div>
          </div>

          <div className="pricing__container grid">
            <article className="pricing__card">
              <div className="pricing__shape">
                <img src="/images/pricing1.png" alt="" className="pricing__img" />
              </div>
              <h3 className="pricing__title">BASIC PACKAGE</h3>
              <h3 className="pricing__number">$120</h3>
              <ul className="pricing__list">
                <li className="pricing__item">
                  <i className="ri-checkbox-circle-line"></i>
                  <span>5 Days In A Week</span>
                </li>
                <li className="pricing__item">
                  <i className="ri-checkbox-circle-line"></i>
                  <span>01 Sweatshirt</span>
                </li>
                <li className="pricing__item">
                  <i className="ri-checkbox-circle-line"></i>
                  <span>01 Bottle of Protein</span>
                </li>
              </ul>
              <Link href="/register" className="button pricing__button">
                Purchase Now
              </Link>
            </article>

            <article className="pricing__card">
              <div className="pricing__shape">
                <img src="/images/pricing2.png" alt="" className="pricing__img" />
              </div>
              <h3 className="pricing__title">PREMIUM PACKAGE</h3>
              <h3 className="pricing__number">$240</h3>
              <ul className="pricing__list">
                <li className="pricing__item">
                  <i className="ri-checkbox-circle-line"></i>
                  <span>5 Days In A Week</span>
                </li>
                <li className="pricing__item">
                  <i className="ri-checkbox-circle-line"></i>
                  <span>01 Sweatshirt</span>
                </li>
                <li className="pricing__item">
                  <i className="ri-checkbox-circle-line"></i>
                  <span>01 Bottle of Protein</span>
                </li>
                <li className="pricing__item">
                  <i className="ri-checkbox-circle-line"></i>
                  <span>Access to Videos</span>
                </li>
              </ul>
              <Link href="/register" className="button pricing__button">
                Purchase Now
              </Link>
            </article>

            <article className="pricing__card">
              <div className="pricing__shape">
                <img src="/images/pricing3.png" alt="" className="pricing__img" />
              </div>
              <h3 className="pricing__title">DIAMOND PACKAGE</h3>
              <h3 className="pricing__number">$420</h3>
              <ul className="pricing__list">
                <li className="pricing__item">
                  <i className="ri-checkbox-circle-line"></i>
                  <span>5 Days In A Week</span>
                </li>
                <li className="pricing__item">
                  <i className="ri-checkbox-circle-line"></i>
                  <span>01 Sweatshirt</span>
                </li>
                <li className="pricing__item">
                  <i className="ri-checkbox-circle-line"></i>
                  <span>01 Bottle of Protein</span>
                </li>
                <li className="pricing__item">
                  <i className="ri-checkbox-circle-line"></i>
                  <span>Access to Videos</span>
                </li>
                <li className="pricing__item">
                  <i className="ri-checkbox-circle-line"></i>
                  <span>Muscle Stretching</span>
                </li>
              </ul>
              <Link href="/register" className="button pricing__button">
                Purchase Now
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/*==================== SCHEDULE ====================*/}
      <section className="section" id="schedule">
        <div className="container">
          <div className="section__data">
            <span className="section__subtitle">Schedule</span>
            <div className="section__titles">
              <h2 className="section__title-border">CLASS</h2>
              <h2 className="section__title">SCHEDULE</h2>
            </div>
          </div>

          {bookingError && (
            <div style={{ 
              padding: '1rem', 
              marginBottom: '2rem',
              backgroundColor: 'hsla(0, 80%, 64%, 0.1)',
              border: '2px solid hsl(0, 80%, 64%)',
              color: 'hsl(0, 80%, 64%)',
              textAlign: 'center'
            }}>
              {bookingError}
            </div>
          )}

          {scheduleLoading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-color-light)' }}>
              Loading schedule...
            </p>
          ) : sessions.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-color-light)' }}>
              No sessions scheduled.
            </p>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {sessions.slice(0, 10).map((session) => (
                <article 
                  key={session.id}
                  className="program__card"
                  style={{ padding: '1.5rem' }}
                >
                  <h3 className="program__title">{session.classType.name}</h3>
                  <p className="program__description" style={{ marginBottom: '1rem' }}>
                    {formatDate(session.startsAt)} • {formatTime(session.startsAt)} - {formatTime(session.endsAt)}
                  </p>
                  {session.instructor.name && (
                    <p className="program__description" style={{ marginBottom: '1rem' }}>
                      Instructor: {session.instructor.name}
                    </p>
                  )}
                  <p className="program__description" style={{ marginBottom: '1.5rem' }}>
                    {session.remainingCapacity} spots available
                  </p>
                  {isAuthenticated && user?.role === 'MEMBER' ? (
                    <button
                      className="button"
                      onClick={() => handleBook(session.id)}
                      style={{ width: '100%' }}
                    >
                      Book Now
                    </button>
                  ) : user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR' ? (
                    <Link href="/dashboard" className="button" style={{ display: 'block', textAlign: 'center', width: '100%' }}>
                      View Dashboard
                    </Link>
                  ) : (
                    <Link href="/login" className="button" style={{ display: 'block', textAlign: 'center', width: '100%' }}>
                      Log in to book
                    </Link>
                  )}
                </article>
              ))}
            </div>
          )}

          {sessions.length > 10 && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link href="/schedule" className="button">
                View Full Schedule
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
