import { useEffect, useState, type FC } from "react";
import styles from "./home.module.scss";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { WorkoutCategory } from "../../models/workoutCategories";
import MFSpinner from "../../components/mf-spinner/mf-spinner";
import { calendarService, type CalendarEvent, type PlannedWorkout } from "../../services/calendarService";

interface HomeProps { }

const Home: FC<HomeProps> = () => {
  const { session } = useAuth();
  const [workoutsByDate, setWorkoutsByDate] = useState<Record<string, PlannedWorkout[]>>({});
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!session?.userId) return;

    const loadCalendar = async () => {
      try {
        setLoadError(false);
        const [workouts, calendarEvents] = await Promise.all([
          calendarService.getCalendar(),
          calendarService.getEvents(),
        ]);
        setWorkoutsByDate(workouts);
        setEvents(calendarEvents);
      } catch {
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    void loadCalendar();
  }, [session?.userId]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const days = [
    { date: today, title: "Hoy" },
    { date: tomorrow, title: "Mañana" },
  ];
  const categoryDetails: Record<string, { icon: string; label: string }> = {
    [WorkoutCategory.GYM]: { icon: "🏋️‍♂️", label: "Gimnasio" },
    [WorkoutCategory.SWIM]: { icon: "🏊‍♂️", label: "Natación" },
    [WorkoutCategory.RUN]: { icon: "🏃‍♂️", label: "Correr" },
  };

  return (
    <main className={styles.HomeContainer}>
      <header className={styles.HomeContainer__PageHeader}>
        <h1>Próximas rutinas</h1>
      </header>
      {loading ? <MFSpinner theme="primary" /> :
        loadError ? <p>No se pudieron cargar los entrenamientos.</p> :
          <div className={styles.HomeContainer__DaysGrid}>
            {days.map(({ date, title }) => {
              const dateKey = [
                date.getFullYear(),
                String(date.getMonth() + 1).padStart(2, "0"),
                String(date.getDate()).padStart(2, "0"),
              ].join("-");
              const workouts = workoutsByDate[dateKey] || [];
              const dayEvents = events.filter((event) => event.date === dateKey);

              return (
                <section className={styles.HomeContainer__DaySection} key={dateKey}>
                  <h2>{title}</h2>
                  <p className={styles.HomeContainer__Date}>{date.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}</p>
                  {dayEvents.length > 0 && (
                    <div className={styles.HomeContainer__EventsSection}>
                      <h3>Eventos</h3>
                      <ul className={styles.HomeContainer__WorkoutList}>
                        {dayEvents.map((event) => (
                          <li key={event.id}>
                            <Link
                              to={event.workoutId ? `/workout/view/${event.workoutId}` : '#'}
                              className={styles.HomeContainer__WorkoutLink}
                              aria-disabled={!event.workoutId}
                              onClick={(clickEvent) => {
                                if (!event.workoutId) clickEvent.preventDefault();
                              }}
                            >
                              <span className={styles.HomeContainer__WorkoutIcon} aria-hidden="true">
                                {categoryDetails[event.workoutCategory ?? '']?.icon ?? "📅"}
                              </span>
                              <span className={styles.HomeContainer__WorkoutText}>
                                <span className={styles.HomeContainer__WorkoutCategory}>
                                  {event.time ? `${event.time} · ` : ''}
                                  {event.trainerId === session?.userId ? event.studentName : event.trainerName}
                                </span>
                                <span className={styles.HomeContainer__WorkoutTitle}>
                                  {event.workoutTitle ?? "Evento de entrenamiento"}
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <h3>Rutinas</h3>
                  {workouts.length ? <ul className={styles.HomeContainer__WorkoutList}>
                    {workouts.map((workout) => (
                      <li key={workout.id}>
                        <Link to={`/workout/view/${workout.id}`} className={styles.HomeContainer__WorkoutLink}>
                          <span className={styles.HomeContainer__WorkoutIcon} aria-hidden="true">
                            {categoryDetails[workout.category]?.icon ?? "🏋️‍♂️"}
                          </span>
                          <span className={styles.HomeContainer__WorkoutText}>
                            <span className={styles.HomeContainer__WorkoutCategory}>
                              {categoryDetails[workout.category]?.label ?? "Entrenamiento"}
                            </span>
                            <span className={styles.HomeContainer__WorkoutTitle}>{workout.title}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul> : <p>No hay rutinas programadas.</p>}
                </section>
              );
            })}
          </div>}
    </main>
  );
};

export default Home;
