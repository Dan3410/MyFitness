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
    <div className={`${styles.MFCheckbox} ${styles[`MFCheckbox--${(theme || 'primary').charAt(0).toUpperCase()}${(theme || 'primary').slice(1)}`]} ${disabled ? styles['MFCheckbox--Disabled'] : ''}`}>
      <input
        className={styles.MFCheckbox__Input}
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={onChange}
      />
      <span className={styles.MFCheckbox__Label}>{children}</span>
    </div>
  );
};

export default MFCheckbox;
