import styles from './App.module.scss'
import './styles.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/home';
import WorkoutList from './pages/workout/workoutList/workoutList';
import Profile from './pages/health/profile/profile';

function App() {

  return (
    <>
    <div className={styles.appContainer}>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/workout" element={<WorkoutList/>}></Route>
        <Route path="/profile" element={<Profile/>}></Route>
        <Route path="/diet" element={<Home/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
    </>
  )
}

export default App
