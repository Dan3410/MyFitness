import type { FC, ReactNode } from 'react'
import type { ColorVariant } from '../../models/colorVariant'
import styles from './mf-tag.module.scss'

interface MFTagProps {
  children: ReactNode
  theme?: ColorVariant
  className?: string
}

const MFTag: FC<MFTagProps> = ({ children, theme = 'primary', className }) => (
  <span className={`${styles.mfTag} ${styles[theme]} ${className || ''}`.trim()}>
    {children}
  </span>
)

export default MFTag
