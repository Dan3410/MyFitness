import styles from './App.module.scss'
import './styles.scss'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/home/home';
import Profile from './pages/health/profile/profile';
import Workout from './pages/workout/workout';
import WorkoutCategories from './pages/workout/components/workoutCategories/workoutCategories';
import WorkoutList from './pages/workout/pages/workoutList/workoutList';
import WorkoutEditor from './pages/workout/pages/workoutEditor/workoutEditor';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    const section = location.pathname.startsWith('/workout')
      ? 'workout'
      : location.pathname.startsWith('/profile')
        ? 'profile'
        : 'default';

    document.documentElement.dataset.section = section;

    return () => {
      delete document.documentElement.dataset.section;
    };
  }, [location.pathname]);

  return (
    <>
      <div className={styles.appContainer}>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/workout" element={<Workout />}>
            <Route path="/workout/categories" element={<WorkoutCategories />}></Route>
            <Route path="/workout/list" element={<WorkoutList />}></Route>
            <Route path="/workout/edit/:id" element={<WorkoutEditor />}></Route>
          </Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/diet" element={<Home />}></Route>
        </Routes>
      </div>
    </>
  )
}

export default App
