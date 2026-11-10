import type { ButtonHTMLAttributes, FC, ReactNode } from 'react'
import styles from "./mf-button.module.scss"
import type { ColorVariant } from '../../models/colorVariant';

interface MFButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className' | 'disabled' | 'onClick' | 'style' | 'type'> {
   theme?: ColorVariant,
   children: ReactNode,
   width?: string,
   height?: string,
   fontSize?: string,
   isDisabled?: boolean,
   onClickEvent?: () => void;
   type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
   className?: string
}

const MFButton: FC<MFButtonProps> = ({
   theme,
   children,
   className,
   width = 'fit-content',
   height = "fit-content",
   fontSize = '14px',
   isDisabled = false,
   type = undefined,
   onClickEvent,
   ...buttonProps
}) => {
   return (
      <button
         {...buttonProps}
         className={`${styles.mfButtonContainer} ${styles[theme || 'primary']} ${className || ''}`.trim()}
         disabled={isDisabled}
         onClick={onClickEvent}
         type={type}
         style={{
            width: width,
            height: height,
            fontSize: fontSize
         }}
      >
         {children}
      </button>
   )
};

export default MFButton;
