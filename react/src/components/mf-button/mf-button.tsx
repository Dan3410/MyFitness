import type { FC, ReactNode } from 'react'
import styles from "./mf-button.module.scss"
import type { ButtonTheme } from '../../themes/interfaces';
import { ComponentTheme } from '../../themes/enums';
import { profileAndHealthButtonTheme } from '../../themes/profileHealth';
import { workoutButtonTheme } from '../../themes/workout';
import { dietButtonTheme } from '../../themes/diet';
import { cancelButtonTheme } from '../../themes/generic';

interface MFButtonProps {
   theme: ComponentTheme,
   //   redirectUrl?: string,
   children: ReactNode,
   width?: string,
   height?: string,
   fontSize?: string,
   isDisabled?: boolean,
   onClickEvent?: (...args: never[]) => void;
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

   const buttonTheme: ButtonTheme = theme == ComponentTheme.profileAndHeath ? profileAndHealthButtonTheme :
      theme == ComponentTheme.diet ? dietButtonTheme : theme == ComponentTheme.workout ? workoutButtonTheme : cancelButtonTheme;

   const handleClick = () => {
      if (onClickEvent)
         onClickEvent()
   }

   //Ver porque no levanta el valor de disabled. Aca habría que agregar estilos cuando este desabilitado
   return (<>
      {isDisabled}
      <button className={styles.mfButtonContainer} disabled={isDisabled}
         onClick={!isDisabled ? handleClick : () => { }}
         style={{
            width: width,
            backgroundColor: buttonTheme.backgroundColor,
            height: height,
            color: buttonTheme.textColor,
            fontSize: fontSize
         }}>
         {children}
      </button>
   </>
   )
};

export default MFButton;
