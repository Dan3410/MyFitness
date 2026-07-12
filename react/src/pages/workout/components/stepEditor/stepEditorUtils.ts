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
        return `Distancia: ${(currentStep as SwimStep).distance ?? 0}m (${(currentStep as SwimStep).stroke})`;
    case stepType.SWIMTIME:
        return `Tiempo: ${(currentStep as SwimStep).time ?? 0}s (${(currentStep as SwimStep).stroke})`;
    case stepType.RUNDISTANCE:
        return `Distancia: ${(currentStep as RunStep).distance ?? 0}m`; 
    case stepType.RUNTIME:
        return `Tiempo: ${(currentStep as RunStep).time ?? 0}s`;
    case stepType.RUNCALORIES:
        return `Calorias: ${(currentStep as RunStep).calories ?? 0}kcal`;
    case stepType.EXERCISE:
        return `Ejercicio   : ${(currentStep as GymStep).exercise}`;
    case stepType.INTERVAL:
        return `Intervalo   : ${(currentStep as GymStep).exercise} por ${(currentStep as GymStep).time ?? 0}s`;
      return ;
    default:
      return 'Paso';
  }
};
