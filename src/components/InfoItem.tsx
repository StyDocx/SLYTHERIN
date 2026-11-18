import React from 'react';

export interface InfoItemProps {
  icon: React.ReactNode;
  text: string;
}

export const InfoItem: React.FC<InfoItemProps> = ({ icon, text }) => {
  return (
    <li className="info-bar__item">
      <span className="info-bar__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="info-bar__text">{text}</span>
    </li>
  );
};

