import { RestStep, WorkoutSet, WorkoutStep, SwimStep, stepType, RunStep, GymStep } from '../../../../models/workoutSteps';

export const getStepLabel = (currentStep: WorkoutStep) => {
  switch (currentStep.type) {
    case stepType.REST:
      return `Descanso (${(currentStep as RestStep).seconds}s)`;
    case stepType.SET:
      return `Set x${(currentStep as WorkoutSet).repeat}`;
    case stepType.WARMUP:
      return 'Calentamiento';
    case stepType.COOLDOWN:
      return 'Enfriamiento';
    case stepType.SWIMDISTANCE:
        return `Distancia: ${(currentStep as SwimStep).distance}m (${(currentStep as SwimStep).stroke})`;
    case stepType.SWIMTIME:
        return `Tiempo: ${(currentStep as SwimStep).time}s (${(currentStep as SwimStep).stroke})`;
    case stepType.RUNDISTANCE:
        return `Distancia: ${(currentStep as RunStep).distance}m`; 
    case stepType.RUNTIME:
        return `Tiempo: ${(currentStep as RunStep).time}s`;
    case stepType.RUNCALORIES:
        return `Calorias: ${(currentStep as RunStep).calories}kcal`;
    case stepType.EXERCISE:
        return `Ejercicio   : ${(currentStep as GymStep).exercise}`;
    case stepType.INTERVAL:
        return `Intervalo   : ${(currentStep as GymStep).exercise} por ${(currentStep as GymStep).time}s`;
      return ;
    default:
      return 'Paso';
  }
};
