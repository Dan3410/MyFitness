import { FC, ReactNode } from 'react';
import styles from './mf-input.module.scss';
import { InputTheme } from '../../themes/interfaces';
import { ComponentTheme } from '../../themes/enums';
import { profileAndHealthInputTheme } from '../../themes/profileHealth';
import { dietInputTheme } from '../../themes/diet';
import { workoutInputTheme } from '../../themes/workout';

interface MFInputProps {
  theme: ComponentTheme,
  children: ReactNode,
}

const MFInput: FC<MFInputProps> = ({
  theme,
  children
}) => {

  const inputTheme: InputTheme = theme == ComponentTheme.profileAndHeath ? profileAndHealthInputTheme :
      theme == ComponentTheme.diet ? dietInputTheme : workoutInputTheme;

  return (
    <>
      <div className={styles.mfInput} style={{borderColor: inputTheme.borderColor}}>
        {children}
      </div>
    </>
  )
};

export default MFInput;
