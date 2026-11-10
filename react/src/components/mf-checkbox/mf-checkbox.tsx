import { ChangeEventHandler, FC, ReactNode } from 'react';
import styles from './mf-checkbox.module.scss';
import type { ColorVariant } from '../../models/colorVariant';

interface MFCheckboxProps {
  children: ReactNode,
  theme?: ColorVariant,
  disabled?: boolean,
  checked?: boolean,
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const MFCheckbox: FC<MFCheckboxProps> = ({
  children,
  theme,
  disabled = false,
  checked = false,
  onChange,
}) => {

  return (
    <div className={`${styles.mfCheckbox} ${styles[theme || 'primary']} ${disabled ? styles.disabled : ''}`}>
      <input
        className={styles.checkboxInput}
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={onChange}
      />
      <span className={`${styles.checkboxLabel}` }>{children}</span>
    </div>
  );
};

export default MFCheckbox;
