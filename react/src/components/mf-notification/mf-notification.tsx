import type { FC } from 'react'
import styles from './mf-notification.module.scss'

export type MFNotificationType = 'inform' | 'failure' | 'success'

interface MFNotificationProps {
  type: MFNotificationType
  message: string
}

const notificationIcons: Record<MFNotificationType, string> = {
  inform: '!',
  failure: 'X',
  success: '✓',
}

const MFNotification: FC<MFNotificationProps> = ({ type, message }) => {
  return (
    <div className={`${styles.MFNotification} ${styles[type]}`} role="status">
      <span className={styles.MFNotificationIcon} aria-hidden="true">
        {notificationIcons[type]}
      </span>
      <span className={styles.MFNotificationMessage}>
        {message}
      </span>
    </div>
  )
}

export default MFNotification
