import type { FC, ReactNode } from 'react'
import styles from "./mf-button.module.scss"
import type { ButtonTheme } from '../../themes/interfaces';

interface MFButtonProps {
   theme: ButtonTheme,
   //   redirectUrl?: string,
   children: ReactNode,
   width?: string,
   height?: string,
   fontSize?: string,
   isDisabled?: boolean,
   onClickEvent?: () => void;
}

const MFButton: FC<MFButtonProps> = ({
   theme,
   children,
   width = 'fit-content',
   height = "fit-content",
   fontSize = '14px',
   isDisabled = false,
   onClickEvent
}) => {

   const handleClick = () => {
      if(onClickEvent)
         onClickEvent()
   }

   //Ver porque no levanta el valor de disabled. Aca habría que agregar estilos cuando este desabilitado
   return (<>
      {isDisabled}
      <button className={styles.mfButtonContainer} disabled={isDisabled}
         onClick={!isDisabled ? handleClick : () => { }}
         style={{
            width: width,
            backgroundColor: theme.backgroundColor,
            height: height,
            color: theme.textColor,
            fontSize: fontSize
         }}>
         {children}
      </button>
   </>
   )
};

export default MFButton;
