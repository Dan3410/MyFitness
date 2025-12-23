import type { FC } from "react";
import styles from "./home.module.scss";
import MFButton from "../../components/mf-button/mf-button";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { SectionButton } from "../../models/section";
import { ComponentTheme } from "../../themes/enums";

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
      name: "Rutinas de ejercicios",
      description: "Para ver tus entrenamientos, hace click aquí",
      disabled: true,
      buttonTheme: ComponentTheme.workout,
      redirectFunction: redirectToWorkoutList
    },
    {
      name: "´Perfil y Salud",
      description: "Para administrar la información sobre ti y tus objetivos, hace click aquí",
      disabled: false,
      buttonTheme: ComponentTheme.profileAndHeath,
      redirectFunction: redirectToProfile
    },
    {
      name: "Dieta",
      description: "Para planificar tu dieta, hace click aquí",
      disabled: true,
      buttonTheme: ComponentTheme.diet,
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
