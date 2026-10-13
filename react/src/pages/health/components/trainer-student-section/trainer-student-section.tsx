import type { FC } from 'react'
import { Link } from 'react-router-dom'
import defaultProfileImage from '../../../../assets/defaultProfileImage.jpg'
import MFCheckbox from '../../../../components/mf-checkbox/mf-checkbox'
import MFExpandablePanel from '../../../../components/mf-expandable-panel/mf-expandable-panel'
import { ComponentTheme } from '../../../../models/componentTheme'
import type { UserSearchResult } from '../../../../models/user'
import styles from './trainer-student-section.module.scss'

interface TrainerStudentSectionProps {
  isTrainer: boolean
  isOwner: boolean
  edit: boolean
  users: UserSearchResult[]
  selectedUserIds: string[]
  onSelectionChange: (userId: string, selected: boolean) => void
}

const TrainerStudentSection: FC<TrainerStudentSectionProps> = ({
  isTrainer,
  isOwner,
  edit,
  users,
  selectedUserIds,
  onSelectionChange,
}) => {
  const relationship = isTrainer ? 'estudiante' : 'entrenador'
  const title = isOwner
    ? isTrainer ? 'Mis alumnos' : 'Mis entrenadores'
    : isTrainer ? 'Alumnos' : 'Entrenadores'

  return (
    <MFExpandablePanel title={title} theme={ComponentTheme.profileAndHealth}>
      <section className={styles.relationshipSection}>
        {edit && <p>Destilda las casillas para remover al {relationship}.</p>}
        {users.length === 0 ? (
          <p>{isOwner
            ? isTrainer ? 'No tienes alumnos vinculados.' : 'No tienes entrenadores vinculados.'
            : isTrainer ? 'Este usuario no tiene alumnos.' : 'Este usuario no tiene entrenadores.'}</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {edit ? (
                  <MFCheckbox
                    theme={ComponentTheme.profileAndHealth}
                    checked={selectedUserIds.includes(user.id)}
                    onChange={(event) => onSelectionChange(user.id, event.target.checked)}
                  >
                    <Link
                      className={styles.profileLink}
                      to={`/users/profile?id=${encodeURIComponent(user.id)}`}
                    >
                      <img src={user.profileImage || defaultProfileImage} alt="" />
                      <span>{user.name}</span>
                    </Link>
                  </MFCheckbox>
                ) : (
                  <Link
                    className={styles.profileLink}
                    to={`/users/profile?id=${encodeURIComponent(user.id)}`}
                  >
                    <img src={user.profileImage || defaultProfileImage} alt="" />
                    <span>{user.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </MFExpandablePanel>
  )
}

export default TrainerStudentSection
