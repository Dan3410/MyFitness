import { RestStep, WorkoutSet, WorkoutStep, SwimStep, stepType } from '../../../../models/workoutSteps';

export const getStepLabel = (currentStep: WorkoutStep, workoutCategory: string) => {
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
    case stepType.SWIMTIME:
      return `Natación (${(currentStep as SwimStep).stroke})`;
    case stepType.RUNDISTANCE:
    case stepType.RUNTIME:
    case stepType.RUNCALORIES:
      return 'Carrera';
    case stepType.EXERCISE:
    case stepType.INTERVAL:
      return workoutCategory === 'gym' ? 'Ejercicio' : 'Paso';
    default:
      return 'Paso';
  }
};
