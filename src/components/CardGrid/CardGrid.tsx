import React from 'react';
import Link from '@docusaurus/Link';
import type { LucideIcon } from 'lucide-react';
import styles from './CardGrid.module.css';

type Card = {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
};

export default function CardGrid({ cards }: { cards: Card[] }) {
  return (
    <div className={styles.grid}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link to={card.to} className={styles.card} key={card.title}>
            <div className={styles.iconWrapper}>
              <Icon size={24} strokeWidth={1.5} />
            </div>
            <h3 className={styles.title}>{card.title}</h3>
            <p className={styles.description}>{card.description}</p>
          </Link>
        );
      })}
    </div>
  );
}