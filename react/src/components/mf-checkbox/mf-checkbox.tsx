import { ChangeEventHandler, CSSProperties, FC, ReactNode } from 'react';
import styles from './mf-checkbox.module.scss';
import { ComponentTheme } from '../../themes/enums';
import { CheckboxTheme } from '../../themes/interfaces';
import { profileAndHealthCheckboxTheme } from '../../themes/profileHealth';
import { workoutCheckboxTheme } from '../../themes/workout';
import { dietCheckboxTheme } from '../../themes/diet';

interface MFCheckboxProps {
  children: ReactNode,
  theme?: ComponentTheme,
  disabled?: boolean,
  checked?: boolean,
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const MFCheckbox: FC<MFCheckboxProps> = ({ children, theme, disabled = false, checked = false, onChange }) => {

  const checkboxTheme: CheckboxTheme = theme == ComponentTheme.profileAndHealth ? profileAndHealthCheckboxTheme :
    theme == ComponentTheme.diet ? dietCheckboxTheme : workoutCheckboxTheme;

  const checkboxStyle: CSSProperties = {
    ['--checkbox-fill-color' as string]: checkboxTheme.fillColor,
    ['--checkbox-background-color' as string]: disabled ? 'transparent' : checkboxTheme.backgroundColor,
    ['--checkbox-border-color' as string]: checkboxTheme.borderColor,
    accentColor: checkboxTheme.fillColor,
    opacity: disabled ? 0.75 : 1,
    pointerEvents: disabled ? 'none' : 'all',
  };

  return (
    <div className={styles.mfCheckbox}>
      <input
        className={styles.checkboxInput}
        style={checkboxStyle}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span className={styles.checkboxLabel}>{children}</span>
    </div>
  );
};

export default MFCheckbox;
