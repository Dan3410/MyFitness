import { ChangeEventHandler, FC, ReactNode } from 'react';
import styles from './mf-checkbox.module.scss';
import { ComponentTheme } from '../../models/componentTheme';

interface MFCheckboxProps {
  children: ReactNode,
  theme?: ComponentTheme,
  disabled?: boolean,
  checked?: boolean,
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const MFCheckbox: FC<MFCheckboxProps> = ({ children, theme, disabled = false, checked = false, onChange }) => {

  return (
    <div className={`${styles.mfCheckbox} ${styles[theme || ComponentTheme.workout]} ${disabled ? styles.disabled : ''}`}>
      <input
        className={styles.checkboxInput}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span className={styles.checkboxLabel}>{children}</span>
    </div>
  );
};

export default MFCheckbox;
