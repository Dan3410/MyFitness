import { FormEvent, FC, useEffect, useRef, useState } from 'react';
import styles from './mf-header.module.scss';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MFFormField from '../mf-form-field/mf-form-field';
import { ComponentTheme } from '../../models/componentTheme';
interface MFHeaderProps {
}

const MFHeader: FC<MFHeaderProps> = ({ }) => {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, []);

  const goToWorkout = () => {
    setIsHamburgerOpen(false);
    navigate('/workout/list');
  };

  const goToCalendar = () => {
    setIsHamburgerOpen(false);
    navigate('/calendar');
  };

  const goToHome = () => {
    setIsHamburgerOpen(false);
    navigate('/');
  };

  const goToProfile = () => {
    setIsMenuOpen(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
  };

  const handleUserSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = userSearch.trim();
    if (name) navigate(`/users?name=${encodeURIComponent(name)}`);
  };

  return (
    <>
      <div className={styles['MFHeader']}>
        <div className={styles.hamburgerMenu}>
          <button
            type="button"
            className={styles.hamburgerTrigger}
            aria-label="Abrir menú principal"
            aria-expanded={isHamburgerOpen}
            aria-haspopup="menu"
            onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div hidden={!isHamburgerOpen}
            className={styles.pageOverlay}
            aria-label="Cerrar menú principal"
            onClick={() => setIsHamburgerOpen(false)}
          />
          <div className={`${styles.hamburgerPanel} ${isHamburgerOpen ? '' : styles.hamburgerPanel__closed}`} role="menu">
            <div className={styles.hamburgerPanel__content}>
              <button type="button" role="menuitem" onClick={goToHome}>Inicio</button>
              <button type="button" role="menuitem" onClick={goToWorkout}>Rutina de ejercicios</button>
              <button type="button" role="menuitem" onClick={goToCalendar}>Calendario</button>
            </div>
          </div>
        </div>
        <form className={styles.userSearch} onSubmit={handleUserSearch} role="search">
          <MFFormField theme={ComponentTheme.generic}>
            <input
              type="search"
              value={userSearch}
              onChange={(event) => setUserSearch(event.target.value)}
              placeholder="Buscar usuario"
              aria-label="Buscar usuario por nombre"
            />
          </MFFormField>
          <button type="submit">Buscar</button>
        </form>
        <div ref={userMenuRef} className={styles.userMenu}>
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
