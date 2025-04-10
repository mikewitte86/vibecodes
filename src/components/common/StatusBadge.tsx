import React from 'react';
import { Badge } from './Badge';
type StatusType = 'success' | 'warning' | 'error' | 'default' | 'info';
interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  className?: string;
}
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = ''
}) => {
  const getVariant = (): StatusType => {
    const s = status.toLowerCase();
    if (['active', 'completed', 'success', 'low'].includes(s)) return 'success';
    if (['pending', 'medium', 'warning'].includes(s)) return 'warning';
    if (['inactive', 'error', 'high'].includes(s)) return 'error';
    return 'default';
  };
  return <Badge variant={getVariant()} className={`${size === 'sm' ? 'text-xs' : 'text-sm'} ${className}`}>
      {status}
    </Badge>;
};