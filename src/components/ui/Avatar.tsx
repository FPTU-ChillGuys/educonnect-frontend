import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User avatar',
  size = 'md',
  className = '',
  status,
}) => {
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  // If no image is provided, create an initial avatar
  const createInitials = () => {
    if (!alt) return 'U';
    return alt
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold`}
        >
          {createInitials()}
        </div>
      )}
      
      {status && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-white ${statusColors[status]}`}
          style={{ 
            width: size === 'xs' ? '0.5rem' : size === 'sm' ? '0.625rem' : '0.75rem', 
            height: size === 'xs' ? '0.5rem' : size === 'sm' ? '0.625rem' : '0.75rem'
          }}
        />
      )}
    </div>
  );
};

export default Avatar;