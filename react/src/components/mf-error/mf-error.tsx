import type { FC, ReactNode } from 'react'
import styles from "./mf-error.module.scss"

interface MFErrorProps {
   hidden: boolean;
   children: ReactNode,
}

const MFError: FC<MFErrorProps> = ({ hidden, children }) => {

   return (<>
      <div hidden={hidden} className={styles.MFError}>
         <span className={styles.MFErrorIcon}><label>X</label></span>
         {children}
      </div>
   </>
   )
};

export default MFError;
