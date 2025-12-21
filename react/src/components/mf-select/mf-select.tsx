import React, { FC } from 'react';
import styles from './mf-select.module.scss';

interface MFSelectProps {}

const MFSelect: FC<MFSelectProps> = () => (
  <div className={styles.mfSelect}>
    mf-select Component
  </div>
);

export default MFSelect;
