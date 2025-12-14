import type { FC } from "react";
import styles from "./home.module.scss";
import MFButton from "../../components/mf-button/mf-button";
import { workoutButtonTheme } from "../../themes/workout";
import { profileAndHealthButtonTheme } from "../../themes/profileHealth";
import { dietButtonTheme } from "../../themes/diet";
import { NavigateFunction, useNavigate } from "react-router-dom";

interface HomeProps {}

const Home: FC<HomeProps> = () => {
  const navigate: NavigateFunction = useNavigate();

  const redirectToWorkoutList = () => {
    navigate("/workout");
  };

  const redirectToProfile = () => {
    navigate("/profile");
  };

  const redirectToDiet = () => {
    navigate("/diet");
  };

  return (
    <>
      <div className={styles.homeContainer}>
        <div className={styles.button}>
          <label>Para ver tus entrenamientos, hace click aquí</label>
          <MFButton
            width="100%"
            height="80px"
            fontSize="24px"
            theme={workoutButtonTheme}
            onClickEvent={redirectToWorkoutList}
          >
            <label>Workouts</label>
          </MFButton>
        </div>
        <div className={styles.button}>
          <label>
            Para administrar la información sobre ti y tus objetivos, hace click
            aquí
          </label>
          <MFButton
            width="100%"
            height="80px"
            fontSize="24px"
            theme={profileAndHealthButtonTheme}
            onClickEvent={redirectToProfile}
          >
            <label>Profile & Health</label>
          </MFButton>
        </div>
        <div className={styles.button}>
          <label>Para planificar tu dieta, hace click aquí</label>
          <MFButton
            width="100%"
            height="80px"
            fontSize="24px"
            theme={dietButtonTheme}
            onClickEvent={redirectToDiet}
          >
            <label>Diet</label>
          </MFButton>
        </div>
      </div>
    </>
  );
};

export default Home;
