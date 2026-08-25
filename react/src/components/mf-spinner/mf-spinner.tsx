import type { FC } from 'react';
import { ComponentTheme } from '../../themes/enums';
import styles from './mf-spinner.module.scss';

interface MFSpinnerProps {
  theme?: ComponentTheme;
  label?: string;
}

const MFSpinner: FC<MFSpinnerProps> = ({
  theme = ComponentTheme.profileAndHealth,
  label = 'Cargando',
}) => (
  <div className={`${styles.spinnerContainer} ${styles[theme]}`} role="status" aria-label={label}>
    <span className={styles.spinner} aria-hidden="true" />
  </div>
);

export default MFSpinner;
