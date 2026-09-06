import { FC, useState } from 'react';
import styles from './mf-header.module.scss';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
interface MFHeaderProps {
}

const MFHeader: FC<MFHeaderProps> = ({}) => {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const goToProfile = () => {
    setIsMenuOpen(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
  };

  return (
    <>
      <div className={styles['MFHeader']}>
        <div className={styles.userMenu}>
          <button
            type="button"
            className={styles.userMenuTrigger}
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            Hola {session?.name} {session?.lastName}!
          </button>
          {isMenuOpen && (
            <div className={styles.userMenuDropdown} role="menu">
              <button type="button" role="menuitem" onClick={goToProfile}>Perfil</button>
              <button type="button" role="menuitem" onClick={handleLogout}>Cerrar sesión</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
};

export default MFHeader;
