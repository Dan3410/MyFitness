import styles from './App.module.scss'
import './styles.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/home';
import Profile from './pages/health/profile/profile';
import Workout from './pages/workout/workout';
import WorkoutCategories from './pages/workout/components/workoutCategories/workoutCategories';
import WorkoutList from './pages/workout/components/workoutList/workoutList';

function App() {

  return (
    <>
      <div className={styles.appContainer}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/workout" element={<Workout />}>
              <Route path="/workout" element={<WorkoutCategories />}></Route>
              <Route path="/workout/:workoutCategory" element={<WorkoutList />}></Route>
            </Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/diet" element={<Home />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
