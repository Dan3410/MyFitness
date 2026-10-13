import type { FC } from 'react'
import { Link } from 'react-router-dom'
import defaultProfileImage from '../../../../assets/defaultProfileImage.jpg'
import MFCheckbox from '../../../../components/mf-checkbox/mf-checkbox'
import MFExpandablePanel from '../../../../components/mf-expandable-panel/mf-expandable-panel'
import { ComponentTheme } from '../../../../models/componentTheme'
import type { TrainerStudentRelationship } from '../../../../models/user'
import styles from './trainer-student-section.module.scss'

interface TrainerStudentSectionProps {
  isTrainer: boolean
  isOwner: boolean
  edit: boolean
  users: TrainerStudentRelationship[]
  selectedUserIds: string[]
  onSelectionChange: (relationship: TrainerStudentRelationship, selected: boolean) => void
}

const TrainerStudentSection: FC<TrainerStudentSectionProps> = ({
  isTrainer,
  isOwner,
  edit,
  users,
  selectedUserIds,
  onSelectionChange,
}) => {
  const trainerUsers = users.filter((user) => user.relationshipType === 'TRAINER')
  const studentUsers = users.filter((user) => user.relationshipType === 'STUDENT')

  const renderUsers = (relationshipUsers: TrainerStudentRelationship[]) => (
    <ul>
      {relationshipUsers.map((user) => (
        <li key={`${user.relationshipType}:${user.id}`}>
          {edit ? (
            <MFCheckbox
              theme={ComponentTheme.profileAndHealth}
              checked={selectedUserIds.includes(`${user.relationshipType}:${user.id}`)}
              onChange={(event) => onSelectionChange(user, event.target.checked)}
            >
              <div className={styles.relationshipUser}>
                <div className={styles.profileEntry}>
                  <img src={user.profileImage || defaultProfileImage} alt="" />
                  <span>{user.name}</span>
                </div>
                {user.isTrainer && <span className={styles.trainerLabel}>Entrenador</span>}
              </div>
            </MFCheckbox>
          ) : (
            <div className={styles.relationshipUser}>
              <Link
                className={styles.profileLink}
                to={`/users/profile?id=${encodeURIComponent(user.id)}`}
              >
                <img src={user.profileImage || defaultProfileImage} alt="" />
                <span>{user.name}</span>
              </Link>
              {user.isTrainer && <span className={styles.trainerLabel}>Entrenador</span>}
            </div>
          )}
        </li>
      ))}
    </ul>
  )

  return (
    <MFExpandablePanel title="Entrenadores / Alumnos" theme={ComponentTheme.profileAndHealth}>
      <section className={styles.relationshipSection}>
        {edit && <p>Destilda las casillas para remover entrenadores o alumnos.</p>}
        {isTrainer ? (
          <>
            <div className={styles.relationshipGroup}>
              <h5>{isOwner ? 'Tus entrenadores' : 'Entrenadores'}</h5>
              {trainerUsers.length > 0
                ? renderUsers(trainerUsers)
                : <p>{isOwner ? 'No tienes entrenadores vinculados.' : 'Este usuario no tiene entrenadores.'}</p>}
            </div>
            <div className={styles.relationshipGroup}>
              <h5>{isOwner ? 'Tus alumnos' : 'Alumnos'}</h5>
              {studentUsers.length > 0
                ? renderUsers(studentUsers)
                : <p>{isOwner ? 'No tienes alumnos vinculados.' : 'Este usuario no tiene alumnos.'}</p>}
            </div>
          </>
        ) : users.length > 0 ? (
          renderUsers(trainerUsers)
        ) : (
          <p>{isOwner ? 'No tienes entrenadores vinculados.' : 'Este usuario no tiene entrenadores.'}</p>
        )}
      </section>
    </MFExpandablePanel>
  )
}

export default TrainerStudentSection
