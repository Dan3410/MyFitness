import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultProfileImage from '../../assets/defaultProfileImage.jpg';
import type { UserSearchResult } from '../../models/user';
import MFTag from '../mf-tag/mf-tag';
import styles from './user-card.module.scss';

interface UserCardProps {
  user: UserSearchResult;
  searchName?: string;
  isAdministrator?: boolean;
}

const UserCard: FC<UserCardProps> = ({ user, searchName, isAdministrator = false }) => {
  const navigate = useNavigate();
  const profileUrl = `/users/profile?id=${encodeURIComponent(user.id)}${
    searchName ? `&name=${encodeURIComponent(searchName)}` : ''
  }`;

  return (
    <article className={styles.UserCard}>
      <button
        className={styles.UserCard__ProfileLink}
        type="button"
        onClick={() => navigate(profileUrl)}
      >
        <img src={user.profileImage || defaultProfileImage} alt="" />
        <span className={styles.UserCard__Details}>
          <span className={styles.UserCard__Name}>{user.name}</span>
          {isAdministrator
            ? <MFTag theme="secondary">Administrador</MFTag>
            : user.isTrainer && <MFTag theme="secondary">Entrenador</MFTag>}
        </span>
      </button>
    </article>
  );
};

export default UserCard;
