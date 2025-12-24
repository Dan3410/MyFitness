import { FC, ReactNode } from 'react';
import styles from './mf-form-field.module.scss';
import { InputTheme } from '../../themes/interfaces';
import { ComponentTheme } from '../../themes/enums';
import { profileAndHealthInputTheme } from '../../themes/profileHealth';
import { dietInputTheme } from '../../themes/diet';
import { workoutInputTheme } from '../../themes/workout';

interface MFFormFieldProps {
  theme: ComponentTheme,
  children: ReactNode,
  disabled?: boolean
}

//TODO: Create an select and date to allow a more stylish options and calendar
//TODO: Agregar errores de formulario
const MFFormField: FC<MFFormFieldProps> = ({
  theme,
  children,
  disabled = false
}) => {

  const inputTheme: InputTheme = theme == ComponentTheme.profileAndHeath ? profileAndHealthInputTheme :
    theme == ComponentTheme.diet ? dietInputTheme : workoutInputTheme;

  return (
    <>
      <div className={styles.MFFormField}
        style={{
          borderColor: disabled ? 'transparent' : inputTheme.borderColor,
          backgroundColor: inputTheme.backgroundColor,
          color: inputTheme.textColor,
          opacity: disabled ? 0.75 : 1,
          pointerEvents: disabled ? "none" : "all",
        }}>
        {children}
      </div>
    </>
  )
};

export default MFFormField;
