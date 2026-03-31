import { v4 as uuidv4 } from 'uuid';
import type { OrderItem } from '../types';

export const generateId = () => uuidv4();

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const calculateOrderTotal = (items: OrderItem[], discount: number): number => {
  const subtotal = calculateOrderSubtotal(items);
  return subtotal - discount;
};

export const calculateOrderSubtotal = (items: OrderItem[]): number => {
  return items.reduce((sum, item) => {
    if (item.type === 'Stitching') {
      return sum + (item.stitchingCharge || 0);
    }
    return sum + ((item.quantity || 0) * (item.price || 0));
  }, 0);
};

export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const debounce = <T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): { (...args: Parameters<T>): void; cancel: () => void } => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
  };

  return debounced;
};
