import { useEffect, useState, type FC } from "react";
import styles from "./home.module.scss";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ComponentTheme } from "../../models/componentTheme";
import { WorkoutCategory } from "../../models/workoutCategories";
import MFSpinner from "../../components/mf-spinner/mf-spinner";
import { calendarService, type PlannedWorkout } from "../../services/calendarService";

interface HomeProps { }

const Home: FC<HomeProps> = () => {
  const { session } = useAuth();
  const [workoutsByDate, setWorkoutsByDate] = useState<Record<string, PlannedWorkout[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!session?.userId) return;

    const loadWorkouts = async () => {
      try {
        setLoadError(false);
        setWorkoutsByDate(await calendarService.getCalendar());
      } catch {
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    void loadWorkouts();
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
    <main className={styles.homeContainer}>
      <header className={styles.pageHeader}>
        <h1>Próximas rutinas</h1>
      </header>
      {loading ? <MFSpinner theme={ComponentTheme.workout} /> :
        loadError ? <p className={styles.status}>No se pudieron cargar los entrenamientos.</p> :
          <div className={styles.daysGrid}>
            {days.map(({ date, title }) => {
              const dateKey = [
                date.getFullYear(),
                String(date.getMonth() + 1).padStart(2, "0"),
                String(date.getDate()).padStart(2, "0"),
              ].join("-");
              const workouts = workoutsByDate[dateKey] || [];

              return (
                <section className={styles.daySection} key={dateKey}>
                  <h2>{title}</h2>
                  <p className={styles.date}>{date.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}</p>
                  {workouts.length ? <ul className={styles.workoutList}>
                    {workouts.map((workout) => (
                      <li key={workout.id}>
                        <Link to={`/workout/view/${workout.id}`} className={styles.workoutLink}>
                          <span className={styles.workoutIcon} aria-hidden="true">
                            {categoryDetails[workout.category]?.icon ?? "🏋️‍♂️"}
                          </span>
                          <span className={styles.workoutText}>
                            <span className={styles.workoutCategory}>
                              {categoryDetails[workout.category]?.label ?? "Entrenamiento"}
                            </span>
                            <span className={styles.workoutTitle}>{workout.title}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul> : <p className={styles.emptyState}>No hay rutinas programadas.</p>}
                </section>
              );
            })}
          </div>}
    </main>
  );
};

export default Home;
