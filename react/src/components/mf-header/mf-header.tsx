import { FormEvent, FC, useEffect, useRef, useState } from 'react';
import styles from './mf-header.module.scss';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MFFormField from '../mf-form-field/mf-form-field';
import { ComponentTheme } from '../../models/componentTheme';
import { notificationService } from '../../services/notificationService';
import type { TrainerRequestNotification } from '../../models/notification';
interface MFHeaderProps {
}

const MFHeader: FC<MFHeaderProps> = ({ }) => {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [notifications, setNotifications] = useState<TrainerRequestNotification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationError, setNotificationError] = useState(false);
  const [notificationResponseError, setNotificationResponseError] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    const loadNotifications = async () => {
      try {
        const items = await notificationService.getNotifications();
        if (active) {
          setNotifications(items);
          setNotificationError(false);
        }
      } catch {
        if (active) setNotificationError(true);
      }
    };
    void loadNotifications();
    const intervalId = window.setInterval(loadNotifications, 30000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
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

  const respondToRequest = async (notificationId: string, decision: 'accept' | 'decline') => {
    setNotificationResponseError(false);
    try {
      const updated = await notificationService.respondToTrainerRequest(notificationId, decision);
      setNotifications((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch {
      setNotificationResponseError(true);
    }
  };

  const unreadCount = notifications.filter((notification) => !notification.seen).length;

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
        <div className={styles.notifications} ref={notificationRef}>
          <button
            type="button"
            className={styles.notificationTrigger}
            aria-label={`Notificaciones${unreadCount ? `, ${unreadCount} sin leer` : ''}`}
            aria-expanded={isNotificationsOpen}
            onClick={() => setIsNotificationsOpen((open) => !open)}
          >
            <span aria-hidden="true">🔔</span>
            {unreadCount > 0 && <span className={styles.notificationCount}>{unreadCount}</span>}
          </button>
          {isNotificationsOpen && (
            <div className={styles.notificationDropdown}>
              <h2>Notificaciones</h2>
              {notificationError && <p>No se pudieron cargar las notificaciones.</p>}
              {notificationResponseError && <p>Hubo un error al responder la notificación.</p>}
              {!notificationError && notifications.length === 0 && <p>No tienes notificaciones.</p>}
              <ul>
                {notifications.map((notification) => (
                  <li key={notification.id} className={!notification.seen ? styles.unseenNotification : ''}>
                    {notification.type !== 'TRAINER_REQUEST' ? (
                      <p>{notification.message}</p>
                    ) : (
                      <>
                        <p>
                          <button
                            type="button"
                            className={styles.trainerLink}
                            onClick={() => {
                              navigate(`/users/profile?id=${encodeURIComponent(notification.trainerId)}`);
                              setIsNotificationsOpen(false);
                            }}
                          >
                            {notification.trainerName}
                          </button>{' '}
                          quiere ser tu entrenador
                        </p>
                        {notification.status === 'PENDING' ? (
                          <div className={styles.notificationActions}>
                            <button type="button" onClick={() => void respondToRequest(notification.id, 'decline')}>Rechazar</button>
                            <button type="button" onClick={() => void respondToRequest(notification.id, 'accept')}>Aceptar</button>
                          </div>
                        ) : notification.status ? (
                          <span className={styles.notificationStatus}>
                            {notification.status === 'ACCEPTED' ? 'Aceptada' : 'Rechazada'}
                          </span>
                        ) : null}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
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
