import React from 'react';

interface ChamferButtonProps {
  variant: 'nav' | 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  href?: string;
  ariaLabel?: string;
  className?: string;
  children: React.ReactNode;
}

export const ChamferButton: React.FC<ChamferButtonProps> = ({
  variant,
  type = 'button',
  onClick,
  href,
  ariaLabel,
  className = '',
  children,
}) => {
  const frameSvg = () => {
    if (variant === 'primary') {
      // 272 x 56 Deep Emerald Chamfered Button with Double Antique-Gold Gothic Frame
      return (
        <svg
          className="chamfer-btn__frame"
          viewBox="0 0 272 56"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon
            points="18,1.5 254,1.5 270.5,28 254,54.5 18,54.5 1.5,28"
            fill="none"
            stroke="var(--champagne-gold)"
            strokeWidth="1.6"
          />
          <polygon
            points="20,4.5 252,4.5 266,28 252,51.5 20,51.5 6,28"
            fill="none"
            stroke="var(--antique-gold)"
            strokeWidth="0.9"
            strokeOpacity="0.75"
          />
          <circle cx="10.5" cy="28" r="1.4" fill="var(--champagne-gold)" />
          <circle cx="261.5" cy="28" r="1.4" fill="var(--champagne-gold)" />
        </svg>
      );
    }

    if (variant === 'secondary') {
      // 262 x 56 Warm Ivory / Champagne-Gold Chamfered Button with Double Antique-Gold & Dark Forest Frame
      return (
        <svg
          className="chamfer-btn__frame"
          viewBox="0 0 262 56"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon
            points="18,1.5 244,1.5 260.5,28 244,54.5 18,54.5 1.5,28"
            fill="none"
            stroke="var(--antique-gold)"
            strokeWidth="1.6"
          />
          <polygon
            points="20,4.5 242,4.5 256,28 242,51.5 20,51.5 6,28"
            fill="none"
            stroke="#59431C"
            strokeWidth="1"
            strokeOpacity="0.68"
          />
          <circle cx="10.5" cy="28" r="1.4" fill="#59431C" />
          <circle cx="251.5" cy="28" r="1.4" fill="#59431C" />
        </svg>
      );
    }

    // variant === 'nav': 176 x 44 Chamfered Navigation Button
    return (
      <svg
        className="chamfer-btn__frame"
        viewBox="0 0 176 44"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon
          points="14,1.5 162,1.5 174.5,22 162,42.5 14,42.5 1.5,22"
          fill="none"
          stroke="var(--champagne-gold)"
          strokeWidth="1.3"
        />
        <polygon
          points="16,4 160,4 170.5,22 160,40 16,40 5.5,22"
          fill="none"
          stroke="var(--antique-gold)"
          strokeWidth="0.8"
          strokeOpacity="0.65"
        />
        <circle cx="9.5" cy="22" r="1.1" fill="var(--champagne-gold)" />
        <circle cx="166.5" cy="22" r="1.1" fill="var(--champagne-gold)" />
      </svg>
    );
  };

  const classes = `chamfer-btn chamfer-btn--${variant} ${className}`.trim();

  if (href) {
    return (
      <a href={href} onClick={onClick} aria-label={ariaLabel} className={classes}>
        {frameSvg()}
        <span className="chamfer-btn__inner">{children}</span>
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={classes}
    >
      {frameSvg()}
      <span className="chamfer-btn__inner">{children}</span>
    </button>
  );
};
