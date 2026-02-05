'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Calendar, Clock, Check, ArrowLeft, Video } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #F0F9FF 0%, #FFFBF7 100%);
  padding: 100px 24px;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const BookingCard = styled(motion.div)`
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.08);
  padding: 40px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1.5fr 1fr;
  }
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 24px;
`;

const DateBtn = styled.button<{ selected?: boolean; disabled?: boolean }>`
  aspect-ratio: 1;
  border-radius: 12px;
  border: 1px solid ${({ selected, theme }) => selected ? theme.colors.primary : theme.colors.border};
  background: ${({ selected, theme }) => selected ? `${theme.colors.primary}10` : 'white'};
  color: ${({ selected, theme }) => selected ? theme.colors.primary : theme.colors.text};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;

const TimeBtn = styled.button<{ selected?: boolean }>`
  padding: 12px;
  border-radius: 12px;
  border: 1px solid ${({ selected, theme }) => selected ? theme.colors.primary : theme.colors.border};
  background: ${({ selected, theme }) => selected ? `${theme.colors.primary}10` : 'white'};
  color: ${({ selected, theme }) => selected ? theme.colors.primary : theme.colors.text};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  text-align: center;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateX(4px);
  }
`;

const ConfirmationBox = styled(motion.div)`
  text-align: center;
  padding: 40px;
`;

export default function BookingPage() {
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [step, setStep] = useState(1);

    const dates = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            day: d.getDate(),
            weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
            full: d,
            disabled: d.getDay() === 0 // Sunday disabled
        };
    });

    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM',
        '02:00 PM', '03:00 PM', '04:00 PM'
    ];

    const handleBook = () => {
        setStep(2);
    };

    if (step === 2) {
        return (
            <PageWrapper>
                <Container>
                    <BookingCard
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <ConfirmationBox>
                            <div style={{
                                width: 80, height: 80, background: '#22C55E15',
                                borderRadius: '50%', margin: '0 auto 24px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Check size={40} color="#22C55E" />
                            </div>
                            <h2 style={{ fontSize: 28, marginBottom: 12 }}>Booking Confirmed!</h2>
                            <p style={{ color: '#6B7280', marginBottom: 32 }}>
                                Your session has been scheduled for<br />
                                <strong>{dates[selectedDate!].full.toLocaleDateString()} at {selectedTime}</strong>
                            </p>
                            <Link href="/video">
                                <Button>Return to Video Dashboard</Button>
                            </Link>
                        </ConfirmationBox>
                    </BookingCard>
                </Container>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <Container>
                <Link href="/video" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#666', marginBottom: 24, textDecoration: 'none' }}>
                    <ArrowLeft size={18} /> Back to counselors
                </Link>

                <BookingCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Header>
                        <Title>Schedule Your Session</Title>
                        <Subtitle>Select a date and time that works best for you</Subtitle>
                    </Header>

                    <Grid>
                        <div>
                            <SectionTitle><Calendar size={18} /> Select Date</SectionTitle>
                            <DateGrid>
                                {dates.map((date, i) => (
                                    <DateBtn
                                        key={i}
                                        selected={selectedDate === i}
                                        disabled={date.disabled}
                                        onClick={() => !date.disabled && setSelectedDate(i)}
                                    >
                                        <span style={{ fontSize: 12, opacity: 0.7 }}>{date.weekday}</span>
                                        <span style={{ fontWeight: 600, fontSize: 16 }}>{date.day}</span>
                                    </DateBtn>
                                ))}
                            </DateGrid>
                        </div>

                        <div>
                            <SectionTitle><Clock size={18} /> Select Time</SectionTitle>
                            <TimeGrid>
                                {timeSlots.map((time) => (
                                    <TimeBtn
                                        key={time}
                                        selected={selectedTime === time}
                                        onClick={() => setSelectedTime(time)}
                                    >
                                        {time}
                                    </TimeBtn>
                                ))}
                            </TimeGrid>
                        </div>
                    </Grid>

                    <div style={{ marginTop: 40, borderTop: '1px solid #eee', paddingTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            size="lg"
                            disabled={selectedDate === null || selectedTime === null}
                            onClick={handleBook}
                            rightIcon={<Video size={18} />}
                        >
                            Confirm Booking
                        </Button>
                    </div>
                </BookingCard>
            </Container>
        </PageWrapper>
    );
}
