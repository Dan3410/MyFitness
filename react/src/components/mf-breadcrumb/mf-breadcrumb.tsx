import { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './mf-breadcrumb.module.scss';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface MFBreadcrumbProps {
  items: BreadcrumbItem[];
}

const MFBreadcrumb: FC<MFBreadcrumbProps> = ({ items }) => {
  const lastIndex = items.length - 1;

  return (
    <nav aria-label="breadcrumb" className={styles.MFBreadcrumb}>
      {items.map((item, index) => {
        const isLast = index === lastIndex;
        return (
          <span key={`${item.label}-${index}`} className={styles.MFBreadcrumb__Item}>
            {isLast || !item.to ? (
              <span className={styles.MFBreadcrumb__Current}>{item.label}</span>
            ) : (
              <Link to={item.to} className={styles.MFBreadcrumb__Link}>{item.label}</Link>
            )}
            {!isLast && <span className={styles.MFBreadcrumb__Separator}>/</span>}
          </span>
        );
      })}
    </nav>
  );
};

export default MFBreadcrumb;
