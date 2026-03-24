import styles from './App.module.scss'
import './styles.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/home';
import Profile from './pages/health/profile/profile';
import Workout from './pages/workout/workout';
import WorkoutCategories from './pages/workout/components/workoutCategories/workoutCategories';
import WorkoutList from './pages/workout/pages/workoutList/workoutList';
import WorkoutEditor from './pages/workout/pages/workoutEditor/workoutEditor';

function App() {

  return (
    <>
      <div className={styles.appContainer}>
        <BrowserRouter>
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
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
