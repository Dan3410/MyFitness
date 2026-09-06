import styles from './App.module.scss'
import './styles.scss'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/login';
import Home from './pages/home/home';
import Profile from './pages/health/profile/profile';
import Workout from './pages/workout/workout';
import WorkoutCategories from './pages/workout/components/workoutCategories/workoutCategories';
import WorkoutList from './pages/workout/pages/workoutList/workoutList';
import WorkoutEditor from './pages/workout/pages/workoutEditor/workoutEditor';

function App() {
  return (
    <AuthProvider><BrowserRouter><AppRoutes /></BrowserRouter></AuthProvider>
  )
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const location = useLocation();
  return session ? children : <Navigate to="/login" replace state={{ from: location.pathname }} />;
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
          <Route path="/login" element={<Login />}></Route>
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>}></Route>
          <Route path="/workout" element={<RequireAuth><Workout /></RequireAuth>}>
            <Route path="/workout/categories" element={<WorkoutCategories />}></Route>
            <Route path="/workout/list" element={<WorkoutList />}></Route>
            <Route path="/workout/edit/:id" element={<WorkoutEditor />}></Route>
          </Route>
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>}></Route>
          <Route path="/diet" element={<RequireAuth><Home /></RequireAuth>}></Route>
        </Routes>
      </div>
    </>
  )
}

export default App
