import { FC, ReactNode } from 'react';
import styles from './mf-form-field.module.scss';
import { ComponentTheme } from '../../models/componentTheme';

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

  return (
    <>
      <div className={`${styles.MFFormField} ${styles[theme]} ${disabled ? styles.disabled : ''}`}>
        {children}
      </div>
    </>
  )
};

export default MFFormField;
