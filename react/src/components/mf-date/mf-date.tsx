import React, { FC } from 'react';
import styles from './mf-date.module.scss';

interface MFDateProps {}

const MFDate: FC<MFDateProps> = () => (
  <div className={styles.mfDate}>
    mf-date Component
  </div>
);

export default MFDate;
