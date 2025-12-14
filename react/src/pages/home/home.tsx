import type { FC } from "react";
import styles from "./home.module.scss";
import MFButton from "../../components/mf-button/mf-button";
import { workoutButtonTheme } from "../../themes/workout";
import { profileAndHealthButtonTheme } from "../../themes/profileHealth";
import { dietButtonTheme } from "../../themes/diet";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { SectionButton } from "../../models/section";

interface HomeProps { }

const Home: FC<HomeProps> = () => {

  const redirectToWorkoutList = () => {
    navigate("/workout");
  };

  const redirectToProfile = () => {
    navigate("/profile");
  };

  const redirectToDiet = () => {
    navigate("/diet");
  };

  const sectionsButtons: SectionButton[] = [
    {
      name: "Workouts",
      description: "Para ver tus entrenamientos, hace click aquí",
      disabled: true,
      buttonTheme: workoutButtonTheme,
      redirectFunction: redirectToWorkoutList
    },
    {
      name: "Profile & Health",
      description: "Para administrar la información sobre ti y tus objetivos, hace click aquí",
      disabled: false,
      buttonTheme: profileAndHealthButtonTheme,
      redirectFunction: redirectToProfile
    },
    {
      name: "Diet",
      description: "Para planificar tu dieta, hace click aquí",
      disabled: true,
      buttonTheme: dietButtonTheme,
      redirectFunction: redirectToDiet
    },
  ]

  const navigate: NavigateFunction = useNavigate();

  return (
    <>
      <div className={styles.homeContainer}>
        {sectionsButtons.map((item: SectionButton) => (
          <div className={styles.button}>
            <label>{!item.disabled ? item.description : "No disponible"}</label>
            <MFButton
              width="100%"
              height="80px"
              fontSize="24px"
              isDisabled={item.disabled}
              theme={item.buttonTheme}
              onClickEvent={item.redirectFunction}
            >
              <label>{item.name}</label>
            </MFButton>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
