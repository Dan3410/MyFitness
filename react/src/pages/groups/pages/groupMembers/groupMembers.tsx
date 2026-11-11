import { useEffect, useState, type FC } from 'react';
import { useParams } from 'react-router-dom';
import MFBreadcrumb from '../../../../components/mf-breadcrumb/mf-breadcrumb';
import MFSpinner from '../../../../components/mf-spinner/mf-spinner';
import UserCard from '../../../../components/user-card/user-card';
import type { StudentGroup } from '../../../../models/studentGroup';
import { studentGroupsService } from '../../../../services/studentGroupsService';
import styles from './groupMembers.module.scss';

const GroupMembers: FC = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState<StudentGroup>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!groupId) return;
    let active = true;
    Promise.all([
      studentGroupsService.getGroup(groupId),
      studentGroupsService.getMembers(groupId),
    ]).then(([groupData, members]) => {
      if (active) setGroup({ ...groupData, members });
    }).catch(() => {
      if (active) setError(true);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [groupId]);

  if (loading) return <MFSpinner theme="primary" />;

  return (
    <main className={styles.GroupMembers}>
      <div className="PageHeader">
        <MFBreadcrumb items={[
          { label: 'Inicio', to: '/' },
          { label: 'Grupos', to: '/groups' },
          { label: 'Miembros' },
        ]} />
        <h2>Miembros de {group?.name ?? 'grupo'}</h2>
      </div>
      {error || !group ? <p role="alert">No se pudieron cargar los miembros del grupo.</p> : group.members.length === 0 ? (
        <p>Este grupo todavía no tiene miembros.</p>
      ) : (
        <ul className={styles.GroupMembers__List}>
          {group.members.map((member) => (
            <li key={member.id}>
              <UserCard user={member} isAdministrator={member.id === group.trainerId} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default GroupMembers;
