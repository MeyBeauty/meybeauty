import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { listenPromotions } from '../firebase/collections.js';

const PromotionsContext = createContext(null);

export function PromotionsProvider({ children }) {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const unsubscribe = listenPromotions(
      (data) => {
        if (!mounted) return;
        setPromotions(data || []);
        setLoading(false);
      },
      (err) => {
        if (!mounted) return;
        setError(err?.message || 'Erreur de chargement des promotions');
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, []);

  // Get active promotions only
  const activePromotions = useMemo(() => {
    const now = new Date().toISOString();
    return promotions.filter((p) => {
      if (p.status !== 'active') return false;
      if (p.startDate && p.startDate > now) return false;
      if (p.endDate && p.endDate < now) return false;
      return true;
    });
  }, [promotions]);

  // Get promotion for a specific product
  const getProductPromotion = useCallback((productId) => {
    return activePromotions.find((p) => 
      p.productIds?.includes(productId) || p.applyToAll
    ) || null;
  }, [activePromotions]);

  // Calculate discounted price
  const calculateDiscountedPrice = useCallback((originalPriceCents, promotion) => {
    if (!promotion) return originalPriceCents;
    
    const original = Number(originalPriceCents) || 0;
    
    if (promotion.discountType === 'percentage') {
      const discount = Math.floor(original * (promotion.discountValue / 100));
      return Math.max(0, original - discount);
    } else if (promotion.discountType === 'fixed') {
      const discountCents = Math.round(promotion.discountValue * 100);
      return Math.max(0, original - discountCents);
    }
    
    return original;
  }, []);

  // Calculate savings
  const calculateSavings = useCallback((originalPriceCents, promotion) => {
    if (!promotion) return { amount: 0, percentage: 0 };
    
    const original = Number(originalPriceCents) || 0;
    const discounted = calculateDiscountedPrice(original, promotion);
    const savings = original - discounted;
    const percentage = original > 0 ? Math.round((savings / original) * 100) : 0;
    
    return { amount: savings, percentage };
  }, [calculateDiscountedPrice]);

  // Get time remaining for countdown
  const getTimeRemaining = useCallback((endDate) => {
    if (!endDate) return null;
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
  }, []);

  const value = useMemo(
    () => ({
      promotions,
      activePromotions,
      loading,
      error,
      getProductPromotion,
      calculateDiscountedPrice,
      calculateSavings,
      getTimeRemaining,
    }),
    [
      promotions,
      activePromotions,
      loading,
      error,
      getProductPromotion,
      calculateDiscountedPrice,
      calculateSavings,
      getTimeRemaining,
    ]
  );

  return <PromotionsContext.Provider value={value}>{children}</PromotionsContext.Provider>;
}

export function usePromotions() {
  const ctx = useContext(PromotionsContext);
  if (!ctx) throw new Error('usePromotions must be used within PromotionsProvider');
  return ctx;
}
