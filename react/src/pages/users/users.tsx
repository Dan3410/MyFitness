import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MFBreadcrumb from '../../components/mf-breadcrumb/mf-breadcrumb';
import MFSpinner from '../../components/mf-spinner/mf-spinner';
import UserCard from '../../components/user-card/user-card';
import { profileService } from '../../services/profileService';
import type { UserSearchResult } from '../../models/user';
import styles from './users.module.scss';

const Users: FC = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name')?.trim() || '';
  const [users, setUsers] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    if (!name) {
      setUsers([]);
      setLoading(false);
      setLoadError(false);
      return () => { active = false };
    }

    setLoading(true);
    setLoadError(false);
    profileService.searchUsers(name)
      .then((data) => {
        if (active) setUsers(data);
      })
      .catch(() => {
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false };
  }, [name]);

  return (
    <div className={styles.UsersPage}>
      <div className={styles.UsersPage__PageHeader}>
        <MFBreadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Usuarios' }]} />
        <h2>Usuarios</h2>
      </div>
      {!name && <p>Introduce un nombre para buscar usuarios.</p>}
      {loading && <MFSpinner />}
      {loadError && <p>No se pudieron cargar los usuarios.</p>}
      {!loading && !loadError && name && users.length === 0 && <p>No se encontraron usuarios.</p>}
      {!loading && !loadError && users.length > 0 && (
        <div className={styles.UsersPage__UserList}>
          {users.map((user) => (
            <UserCard key={user.id} user={user} searchName={name} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
