import React from "react";

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

export const HomeIcon: React.FC<IconProps> = ({ className, size = 24, color = "currentColor" }) => (
  <svg 
    className={className} 
    width={size} 
    height={size}
    viewBox="0 0 24 24" 
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

export const BookIcon: React.FC<IconProps> = ({ className, size = 24, color = "currentColor" }) => (
  <svg 
    className={className} 
    width={size} 
    height={size}
    viewBox="0 0 24 24" 
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

export const CameraIcon: React.FC<IconProps> = ({ className, size = 24, color = "currentColor" }) => (
  <svg 
    className={className} 
    width={size} 
    height={size}
    viewBox="0 0 24 24" 
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

export const ChartIcon: React.FC<IconProps> = ({ className, size = 24, color = "currentColor" }) => (
  <svg 
    className={className} 
    width={size} 
    height={size}
    viewBox="0 0 24 24" 
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ className, size = 24, color = "currentColor" }) => (
  <svg 
    className={className} 
    width={size} 
    height={size}
    viewBox="0 0 24 24" 
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

export const BarcodeIcon: React.FC<IconProps> = ({ className, size = 24, color = "currentColor" }) => (
  <svg 
    className={className} 
    width={size} 
    height={size}
    viewBox="0 0 24 24" 
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 7V4h3"></path>
    <path d="M4 20v-3h3"></path>
    <path d="M20 4h-3"></path>
    <path d="M20 20h-3"></path>
    <rect x="5" y="8" width="2" height="8"></rect>
    <rect x="9" y="8" width="2" height="8"></rect>
    <rect x="13" y="8" width="2" height="8"></rect>
    <rect x="17" y="8" width="2" height="8"></rect>
  </svg>
);

export const FireIcon: React.FC<IconProps> = ({ className, size = 24, color = "currentColor" }) => (
  <svg 
    className={className} 
    width={size} 
    height={size}
    viewBox="0 0 24 24" 
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3s.5-1.5 1-2.5c.5 1 1.5 2 2.5 2 .5 0 1 0 1.5-.5 0 0 .5 0 .5 1s1 1 1 1 .5 1 .5 1-.5.5-1.5 1c-1 .5-2.5 2.5-2.5 4.5s1.5 3 3 3c.5 0 1-1 1-1"></path>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
  </svg>
);

export const ShoeIcon: React.FC<IconProps> = ({ className, size = 24, color = "currentColor" }) => (
  <svg 
    className={className} 
    width={size} 
    height={size}
    viewBox="0 0 24 24" 
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 14l2-1 1.5 1 1.5-1 1.5 1 1.5-1 1.5 1 1.5-1 1.5 1 1.5-1 1.5 1 1.5-1 1.5 1 2 -1"></path>
    <path d="M3 18v1c0 1 .5 1 1 1h16c.5 0 1 0 1-1v-1c0-1-.5-2-2-2H5c-1.5 0-2 1-2 2z"></path>
    <path d="M9 12v-3c0-2 2.5-2 2.5-4"></path>
    <path d="M14.5 12v-3c0-2 2.5-2 2.5-4"></path>
  </svg>
);

export const ProteinIcon: React.FC<IconProps> = ({ className, size = 24, color = "currentColor" }) => (
  <svg 
    className={className} 
    width={size} 
    height={size}
    viewBox="0 0 24 24" 
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 11l-4.5-4.5c-1-1-1-3 0-4s3-1 4 0L20 8"></path>
    <path d="M16 18l4.5-4.5c1-1 1-3 0-4s-3-1-4 0L14 12"></path>
    <path d="M19 15l-2 2"></path>
    <path d="M15 11l-2 2"></path>
    <path d="M6 13c-2 0-2 4-2 6 0 2.5 2 2.5 2 2.5"></path>
    <path d="M10.5 13c2 0 2 4 2 6 0 2.5-2 2.5-2 2.5"></path>
    <path d="M8.5 21.5V13"></path>
  </svg>
);

export const WaterIcon: React.FC<IconProps> = ({ className, size = 24, color = "currentColor" }) => (
  <svg 
    className={className} 
    width={size} 
    height={size}
    viewBox="0 0 24 24" 
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2v6"></path>
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-4-3-7-2 3-3 5-3 7a7 7 0 0 0 7 7c-2 0-4-1-7-3-3 2-5 3-7 3a7 7 0 0 0 7-7c0-2-1-4-3-7-2 3-3 5-3 7a7 7 0 0 0-7 7c2 0 4-1 7-3 3 2 5 3 7 3"></path>
  </svg>
);
