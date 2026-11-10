import { FormEvent, FC, useEffect, useRef, useState } from 'react';
import styles from './mf-header.module.scss';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MFButton from '../mf-button/mf-button';
import MFFormField from '../mf-form-field/mf-form-field';
import { notificationService } from '../../services/notificationService';
import type { TrainerRequestNotification } from '../../models/notification';

const MFHeader: FC = () => {
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
          <MFButton
            type="button"
            theme="tertiary"
            className={styles.hamburgerTrigger}
            width="40px"
            height="40px"
            aria-label="Abrir menú principal"
            aria-expanded={isHamburgerOpen}
            aria-haspopup="menu"
            onClickEvent={() => setIsHamburgerOpen(!isHamburgerOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </MFButton>
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
          <MFFormField theme="primary">
            <input
              type="search"
              value={userSearch}
              onChange={(event) => setUserSearch(event.target.value)}
              placeholder="Buscar usuario"
              aria-label="Buscar usuario por nombre"
            />
          </MFFormField>
          <MFButton type="submit" theme="secondary">Buscar</MFButton>
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
                          <MFButton
                            type="button"
                            theme="tertiary"
                            className={styles.trainerLink}
                            onClickEvent={() => {
                              navigate(`/users/profile?id=${encodeURIComponent(notification.trainerId)}`);
                              setIsNotificationsOpen(false);
                            }}
                          >
                            {notification.trainerName}
                          </MFButton>{' '}
                          quiere ser tu entrenador
                        </p>
                        {notification.status === 'PENDING' ? (
                          <div className={styles.notificationActions}>
                            <MFButton type="button" theme="tertiary" className={styles.notificationActionButton} onClickEvent={() => void respondToRequest(notification.id, 'decline')}>Rechazar</MFButton>
                            <MFButton type="button" theme="secondary" className={styles.notificationActionButton} onClickEvent={() => void respondToRequest(notification.id, 'accept')}>Aceptar</MFButton>
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
          <MFButton
            type="button"
            theme="tertiary"
            className={styles.userMenuTrigger}
            width="fit-content"
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            onClickEvent={() => setIsMenuOpen(!isMenuOpen)}
          >
            Hola {session?.name} {session?.lastName}!
          </MFButton>
          {isMenuOpen && (
            <div className={styles.userMenuDropdown} role="menu">
              <MFButton type="button" theme="tertiary" className={styles.dropdownButton} width="100%" role="menuitem" onClickEvent={goToProfile}>Perfil</MFButton>
              <MFButton type="button" theme="tertiary" className={styles.dropdownButton} width="100%" role="menuitem" onClickEvent={handleLogout}>Cerrar sesión</MFButton>
            </div>
          )}
        </div>
      </div>
    </>
  )
};

export default MFHeader;
