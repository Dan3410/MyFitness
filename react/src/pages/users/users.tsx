import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import defaultProfileImage from '../../assets/defaultProfileImage.jpg';
import MFBreadcrumb from '../../components/mf-breadcrumb/mf-breadcrumb';
import MFSpinner from '../../components/mf-spinner/mf-spinner';
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
    <div className={styles.usersPage}>
      <div className={styles.pageHeader}>
        <MFBreadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Usuarios' }]} />
        <h2>Usuarios</h2>
      </div>
      {!name && <p>Introduce un nombre para buscar usuarios.</p>}
      {loading && <MFSpinner />}
      {loadError && <p>No se pudieron cargar los usuarios.</p>}
      {!loading && !loadError && name && users.length === 0 && <p>No se encontraron usuarios.</p>}
      {!loading && !loadError && users.length > 0 && (
        <div className={styles.userList}>
          {users.map((user, index) => (
            <div className={styles.userItem} key={`${user.name}-${index}`}>
              <img src={user.profileImage || defaultProfileImage} alt="" />
              <span>{user.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
