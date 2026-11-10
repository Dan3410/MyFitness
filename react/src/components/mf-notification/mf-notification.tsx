import type { FC } from 'react'
import styles from './mf-notification.module.scss'

export type MFNotificationType = 'inform' | 'warning' | 'failure' | 'success'

interface MFNotificationProps {
  type: MFNotificationType
  message: string
}

const notificationIcons: Record<MFNotificationType, string> = {
  inform: '!',
  warning: '!',
  failure: 'X',
  success: '✓',
}

const MFNotification: FC<MFNotificationProps> = ({ type, message }) => {
  return (
    <div className={`${styles.MFNotification} ${styles[`MFNotification--${type.charAt(0).toUpperCase()}${type.slice(1)}`]}`} role="status">
      <span className={styles.MFNotification__Icon} aria-hidden="true">
        {notificationIcons[type]}
      </span>
      <span className={styles.MFNotification__Message}>
        {message}
      </span>
    </div>
  )
}

export default MFNotification
