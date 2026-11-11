import { useEffect, useState, type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MFButton from '../../../../components/mf-button/mf-button';
import MFBreadcrumb from '../../../../components/mf-breadcrumb/mf-breadcrumb';
import MFFormField from '../../../../components/mf-form-field/mf-form-field';
import MFSpinner from '../../../../components/mf-spinner/mf-spinner';
import type { StudentGroup, StudentGroupActivity } from '../../../../models/studentGroup';
import { profileService } from '../../../../services/profileService';
import { studentGroupsService } from '../../../../services/studentGroupsService';
import styles from './groups.module.scss';

const Groups: FC = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<StudentGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState(groupId ?? '');
  const [activities, setActivities] = useState<StudentGroupActivity[]>([]);
  const [isTrainer, setIsTrainer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const loadGroups = async () => {
      try {
        const [groupList, profile] = await Promise.all([
          studentGroupsService.getGroups(),
          profileService.getUserData(),
        ]);
        if (!active) return;
        setGroups(groupList);
        setIsTrainer(Boolean(profile.isTrainer));
        const initialGroupId = groupId && groupList.some((group) => group.id === groupId)
          ? groupId
          : groupList[0]?.id ?? '';
        setSelectedGroupId(initialGroupId);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadGroups();
    return () => { active = false; };
  }, [groupId]);

  useEffect(() => {
    if (!selectedGroupId) {
      setActivities([]);
      return;
    }
    let active = true;
    studentGroupsService.getActivities(selectedGroupId).then((items) => {
      if (active) {
        setActivities(items);
        setError(false);
      }
    }).catch(() => {
      if (active) setError(true);
    });
    return () => { active = false; };
  }, [selectedGroupId]);

  const selectedGroup = groups.find((group) => group.id === selectedGroupId);

  if (loading) return <MFSpinner theme="primary" />;

  return (
    <main className={styles.GroupsPage}>
      <div className="PageHeader">
        <MFBreadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Grupos' }]} />
        <h2>Grupos</h2>
      </div>
      {error && <p role="alert">No se pudieron cargar los datos del grupo.</p>}
      <div className={styles.GroupsPage__Selector}>
        <MFFormField theme="primary">
          <label htmlFor="groups-selector">Grupo</label>
          <select
            id="groups-selector"
            value={selectedGroupId}
            onChange={(event) => {
              const nextId = event.target.value;
              setSelectedGroupId(nextId);
              navigate(nextId ? `/groups/${encodeURIComponent(nextId)}` : '/groups');
            }}
          >
            <option value="">Seleccionar grupo</option>
            {groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
          </select>
        </MFFormField>
        {isTrainer && (
          <MFButton theme="primary" type="button" onClickEvent={() => navigate('/group/new')}>
            Nuevo grupo
          </MFButton>
        )}
      </div>

      {selectedGroup ? (
        <>
          <div className={styles.GroupsPage__Heading}>
            <h2>{selectedGroup.name}</h2>
            <MFButton
              theme="secondary"
              type="button"
              onClickEvent={() => navigate(`/groups/${encodeURIComponent(selectedGroup.id)}/members`)}
            >
              Miembros
            </MFButton>
            {selectedGroup.administrator && (
              <MFButton
                type="button"
                onClickEvent={() => navigate(`/groups/${encodeURIComponent(selectedGroup.id)}/edit`)}
              >
                Editar
              </MFButton>
            )}
          </div>
          <section className={styles.GroupsPage__ActivitySection} aria-labelledby="group-activity-title">
            <h2 id="group-activity-title">Actividad del grupo</h2>
            {activities.length === 0 ? <p>Aún no hay actividad en este grupo.</p> : (
              <ul className={styles.GroupsPage__ActivityList}>
                {activities.map((activity) => (
                  <li className={styles.GroupsPage__ActivityItem} key={activity.id}>
                    {activity.message}
                    <time dateTime={activity.createdAt}>
                      {new Date(activity.createdAt).toLocaleString()}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : (
        <p>{groups.length === 0 ? 'Todavía no tienes grupos.' : 'Selecciona un grupo para ver su actividad.'}</p>
      )}
    </main>
  );
};

export default Groups;
