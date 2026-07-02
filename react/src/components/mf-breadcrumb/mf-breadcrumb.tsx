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
    <nav aria-label="breadcrumb" className={styles.breadcrumb}>
      {items.map((item, index) => {
        const isLast = index === lastIndex;
        return (
          <span key={`${item.label}-${index}`} className={styles.breadcrumbItem}>
            {isLast || !item.to ? (
              <span className={styles.breadcrumbCurrent}>{item.label}</span>
            ) : (
              <Link to={item.to} className={styles.breadcrumbLink}>{item.label}</Link>
            )}
            {!isLast && <span className={styles.breadcrumbSeparator}>/</span>}
          </span>
        );
      })}
    </nav>
  );
};

export default MFBreadcrumb;
