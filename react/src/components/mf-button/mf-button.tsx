import type { FC, ReactNode } from 'react'
import styles from "./mf-button.module.scss"
import type { ButtonTheme } from '../../themes/theme.interfaces';

interface MFButtonProps {
   theme: ButtonTheme,
//   redirectUrl?: string,
   children: ReactNode,
   width?: string,
   height?: string,
   fontSize?: string,
   onClickEvent?: () => void;
}

const MFButton: FC<MFButtonProps> = ({
   theme, 
   children, 
   width = 'fit-content',
   height = "fit-content",
   fontSize = '14px',
   onClickEvent
}) => {

   const handleClick = () => {
      onClickEvent && onClickEvent()
   }

   return (<>
   <div className={styles.mfButtonContainer} 
      onClick={handleClick}
      style={{width: width, backgroundColor: theme.backgroundColor, height: height}}>
      <label className={styles.text} style={{color: theme.textColor, fontSize: fontSize}}>
         {children}
      </label>
   </div>
   </> 
   )
};

export default MFButton;
