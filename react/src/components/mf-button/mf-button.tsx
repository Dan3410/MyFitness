import type { FC, ReactNode } from 'react'
import styles from "./mf-button.module.scss"
import { ComponentTheme } from '../../themes/enums';

interface MFButtonProps {
   theme?: ComponentTheme,
   //   redirectUrl?: string,
   children: ReactNode,
   width?: string,
   height?: string,
   fontSize?: string,
   isDisabled?: boolean,
   onClickEvent?: (...args: never[]) => void;
   type?: "button" | "submit" | "reset" | undefined
}

const MFButton: FC<MFButtonProps> = ({
   theme,
   children,
   width = 'fit-content',
   height = "fit-content",
   fontSize = '14px',
   isDisabled = false,
   type = undefined,
   onClickEvent
}) => {

   const handleClick = () => {
      if (onClickEvent)
         onClickEvent()
   }

   return (<>
      <button className={`${styles.mfButtonContainer} ${styles[theme || ComponentTheme.generic]}`} disabled={isDisabled}
         onClick={!isDisabled ? handleClick : () => { }} type={type}
         style={{
            width: width,
            height: height,
            fontSize: fontSize
         }}>
         {children}
      </button>
   </>
   )
};

export default MFButton;
