import { Children, cloneElement, isValidElement, type FC, type ReactElement, type ReactNode } from 'react';
import styles from './mf-form-field.module.scss';
import { ComponentTheme } from '../../models/componentTheme';

const setControlsDisabled = (children: ReactNode): ReactNode => (
  Children.map(children, (child) => {
    if (!isValidElement(child)) return child;

    const element = child as ReactElement<{ children?: ReactNode; disabled?: boolean }>;
    if (
      typeof element.type === 'string'
      && ['input', 'select', 'textarea', 'button'].includes(element.type)
    ) {
      return cloneElement(element, { disabled: true });
    }

    return element.props.children
      ? cloneElement(element, undefined, setControlsDisabled(element.props.children))
      : child;
  })
);

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
        {disabled ? setControlsDisabled(children) : children}
      </div>
    </>
  )
};

export default MFFormField;
