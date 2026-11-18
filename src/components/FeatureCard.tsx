import React from 'react';
import { OrnateFrame } from './OrnateFrame';
import { CardCircleArrowIcon } from './IconSet';

export interface FeatureCardProps {
  id: string;
  href: string;
  icon: React.ReactNode;
  title: string;
  caption: string;
  onSelect: (id: string) => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  id,
  href,
  icon,
  title,
  caption,
  onSelect,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onSelect(id);
  };

  return (
    <li className="feature-cards__item">
      <a
        href={href}
        onClick={handleClick}
        className="feature-card-link"
        aria-label={`${title} — ${caption}`}
      >
        <OrnateFrame variant="card" className="feature-card-frame">
          <div className="feature-card__body">
            <span className="feature-card__icon" aria-hidden="true">
              {icon}
            </span>
            <h2 className="feature-card__title">{title}</h2>
            <p className="feature-card__caption">{caption}</p>
          </div>
          <span className="feature-card__arrow" aria-hidden="true">
            <CardCircleArrowIcon />
          </span>
        </OrnateFrame>
      </a>
    </li>
  );
};
