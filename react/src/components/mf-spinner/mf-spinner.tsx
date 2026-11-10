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
  <div className={`${styles.spinnerContainer} ${styles[theme]}`} role="status" aria-label={label}>
    <span className={styles.spinner} aria-hidden="true" />
  </div>
);

export default MFSpinner;
