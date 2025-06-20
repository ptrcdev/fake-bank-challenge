import React from 'react';
import { cn } from '@/lib/utils';
import { CreditCard, Lock } from 'lucide-react';

interface BankSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'card' | 'lock';
}

const BankSpinner: React.FC<BankSpinnerProps> = ({ 
  size = 'md', 
  className, 
  variant = 'card' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32
  };

  if (variant === 'lock') {
    return (
      <div className={cn('relative', sizeClasses[size], className)}>
        {/* Outer spinning ring */}
        <div className="absolute inset-0 border-2 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
        
        {/* Lock icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Lock 
            size={iconSizes[size]} 
            className="text-blue-600 animate-pulse" 
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      {/* Credit card spinning */}
      <div className="absolute inset-0 flex items-center justify-center animate-spin">
        <CreditCard 
          size={iconSizes[size]} 
          className="text-blue-600 drop-shadow-sm" 
        />
      </div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
    </div>
  );
};

export { BankSpinner };