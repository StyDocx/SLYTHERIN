import React from 'react';

interface OrnateFrameProps {
  variant: 'infobar' | 'card';
  className?: string;
  children: React.ReactNode;
}

export const OrnateFrame: React.FC<OrnateFrameProps> = ({
  variant,
  className = '',
  children,
}) => {
  return (
    <div className={`ornate-frame ornate-frame--${variant} ${className}`}>
      {/* Stretchable Double Antique-Gold Rail Lines */}
      <div className="ornate-frame__outer-rail" aria-hidden="true" />
      <div className="ornate-frame__inner-rail" aria-hidden="true" />

      {/* 4 Fixed-Size Gothic Corner Flourish SVGs */}
      <svg
        className="ornate-frame__corner ornate-frame__corner--tl"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M1 26 V11 L11 1 H26"
          stroke="var(--champagne-gold)"
          strokeWidth="1.4"
        />
        <path
          d="M4.5 26 V13 L13 4.5 H26"
          stroke="var(--antique-gold)"
          strokeWidth="0.9"
        />
        <path
          d="M5 10 L10 5 M8 11 C10 9 12 9 13 11"
          stroke="var(--champagne-gold)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <circle cx="10.5" cy="10.5" r="1.3" fill="var(--warm-ivory)" />
      </svg>

      <svg
        className="ornate-frame__corner ornate-frame__corner--tr"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M27 26 V11 L17 1 H2"
          stroke="var(--champagne-gold)"
          strokeWidth="1.4"
        />
        <path
          d="M23.5 26 V13 L15 4.5 H2"
          stroke="var(--antique-gold)"
          strokeWidth="0.9"
        />
        <path
          d="M23 10 L18 5 M20 11 C18 9 16 9 15 11"
          stroke="var(--champagne-gold)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <circle cx="17.5" cy="10.5" r="1.3" fill="var(--warm-ivory)" />
      </svg>

      <svg
        className="ornate-frame__corner ornate-frame__corner--bl"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M1 2 V17 L11 27 H26"
          stroke="var(--champagne-gold)"
          strokeWidth="1.4"
        />
        <path
          d="M4.5 2 V15 L13 23.5 H26"
          stroke="var(--antique-gold)"
          strokeWidth="0.9"
        />
        <path
          d="M5 18 L10 23 M8 17 C10 19 12 19 13 17"
          stroke="var(--champagne-gold)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <circle cx="10.5" cy="17.5" r="1.3" fill="var(--warm-ivory)" />
      </svg>

      <svg
        className="ornate-frame__corner ornate-frame__corner--br"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M27 2 V17 L17 27 H2"
          stroke="var(--champagne-gold)"
          strokeWidth="1.4"
        />
        <path
          d="M23.5 2 V15 L15 23.5 H2"
          stroke="var(--antique-gold)"
          strokeWidth="0.9"
        />
        <path
          d="M23 18 L18 23 M20 17 C18 19 16 19 15 17"
          stroke="var(--champagne-gold)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <circle cx="17.5" cy="17.5" r="1.3" fill="var(--warm-ivory)" />
      </svg>

      {/* Top & Bottom Center Warm Gold Edge Illumination Nodes */}
      <div className="ornate-frame__gold-node ornate-frame__gold-node--top" aria-hidden="true">
        <span className="ornate-frame__gold-line" />
        <span className="ornate-frame__gold-dot" />
      </div>
      <div className="ornate-frame__gold-node ornate-frame__gold-node--bottom" aria-hidden="true">
        <span className="ornate-frame__gold-line" />
        <span className="ornate-frame__gold-dot" />
      </div>

      {/* Frame Content */}
      <div className="ornate-frame__content">{children}</div>
    </div>
  );
};
