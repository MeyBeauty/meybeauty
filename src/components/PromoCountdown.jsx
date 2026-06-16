import { useEffect, useState, useMemo } from 'react';
import { Clock } from 'lucide-react';

export default function PromoCountdown({ endDate, compact = false }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!endDate) return;

    const calculateTimeLeft = () => {
      const end = new Date(endDate).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) return null;

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (!remaining) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const isUrgent = useMemo(() => {
    if (!timeLeft) return false;
    return timeLeft.days === 0 && timeLeft.hours < 24;
  }, [timeLeft]);

  if (!timeLeft) return null;

  const formatNumber = (n) => String(n).padStart(2, '0');

  if (compact) {
    return (
      <div className={`promo-countdown ${isUrgent ? 'urgent' : ''}`}>
        <Clock size={14} />
        <span className="countdown-value">{timeLeft.days}j {formatNumber(timeLeft.hours)}h</span>
      </div>
    );
  }

  return (
    <div className={`promo-countdown ${isUrgent ? 'urgent' : ''}`}>
      <div className="countdown-boxes">
        <div className="countdown-box">
          <span className="countdown-box-value">{formatNumber(timeLeft.days)}</span>
          <span className="countdown-box-label">J</span>
        </div>
        <div className="countdown-box">
          <span className="countdown-box-value">{formatNumber(timeLeft.hours)}</span>
          <span className="countdown-box-label">H</span>
        </div>
        <div className="countdown-box">
          <span className="countdown-box-value">{formatNumber(timeLeft.minutes)}</span>
          <span className="countdown-box-label">M</span>
        </div>
        <div className="countdown-box">
          <span className="countdown-box-value">{formatNumber(timeLeft.seconds)}</span>
          <span className="countdown-box-label">S</span>
        </div>
      </div>
    </div>
  );
}
