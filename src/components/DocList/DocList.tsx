import React from 'react';
import Link from '@docusaurus/Link';
import type { LucideIcon } from 'lucide-react';
import styles from './DocList.module.css';

type DocItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
};

export default function DocList({ items }: { items: DocItem[] }) {
  return (
    <ul className={styles.list}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.title}>
            <Link to={item.to} className={styles.item}>
              <div className={styles.iconWrapper}>
                <Icon size={18} strokeWidth={1.5} />
              </div>
              <div className={styles.content}>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.description}>{item.description}</span>
              </div>
              <span className={styles.arrow}>→</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}