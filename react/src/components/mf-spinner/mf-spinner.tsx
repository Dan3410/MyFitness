import type { FC } from 'react';
import type { ColorVariant } from '../../models/colorVariant';
import styles from './mf-spinner.module.scss';

interface MFSpinnerProps {
  theme?: ColorVariant;
  label?: string;
}

const MFSpinner: FC<MFSpinnerProps> = ({
  theme = 'primary',
  label = 'Cargando',
}) => (
  <div className={`${styles.MFSpinner} ${styles[`MFSpinner--${theme.charAt(0).toUpperCase()}${theme.slice(1)}`]}`} role="status" aria-label={label}>
    <span className={styles.MFSpinner__Spinner} aria-hidden="true" />
  </div>
);

export default MFSpinner;
