import styles from './App.module.scss'
import './styles.scss'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/login';
import Home from './pages/home/home';
import Profile from './pages/health/profile/profile';
import Workout from './pages/workout/workout';
import WorkoutCategories from './pages/workout/components/workoutCategories/workoutCategories';
import WorkoutList from './pages/workout/pages/workoutList/workoutList';
import WorkoutEditor from './pages/workout/pages/workoutEditor/workoutEditor';
import MFHeader from './components/mf-header/mf-header';

function App() {
  return (
    <AuthProvider><BrowserRouter><AppRoutes /></BrowserRouter></AuthProvider>
  )
}

function RequireAuth({ session }: { session: any }) {
  const location = useLocation();
  return session ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

function AppRoutes() {
  const location = useLocation();
  const { session } = useAuth();

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
      {!!session ? <MFHeader ></MFHeader> : null}
      <div className={styles.appContainer}>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route element={<RequireAuth session={session}/>} >
            <Route path="/" element={<Home />}></Route>
            <Route path="/workout" element={<Workout />}>
              <Route path="/workout/categories" element={<WorkoutCategories />}></Route>
              <Route path="/workout/list" element={<WorkoutList />}></Route>
              <Route path="/workout/edit/:id" element={<WorkoutEditor />}></Route>
            </Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/diet" element={<Home />}></Route>
          </Route>
          <Route path="*" element={<Navigate to={session ? "/" : "/login"} />} />
        </Routes>
      </div >
    </>
  )
}

export default App
