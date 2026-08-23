import { RestStep, WorkoutSet, WorkoutStep, SwimStep, StepType, RunStep, GymStep } from '../../../../models/workoutSteps';

export const getStepLabel = (currentStep: WorkoutStep) => {
  switch (currentStep.type) {
    case StepType.REST:
      return `Descanso (${(currentStep as RestStep).seconds}s)`;
    case StepType.SET:
      return `Set x${(currentStep as WorkoutSet).repeat}`;
    case StepType.SWIMWARMUP || StepType.RUNWARMUP || StepType.GYMWARMUP:
      return 'Calentamiento';
    case StepType.SWIMCOOLDOWN || StepType.RUNCOOLDOWN || StepType.GYMCOOLDOWN:
      return 'Enfriamiento';
    case StepType.SWIMDISTANCE:
        return `Distancia: ${(currentStep as SwimStep).distance ?? 0}m (${(currentStep as SwimStep).stroke})`;
    case StepType.SWIMTIME:
        return `Tiempo: ${(currentStep as SwimStep).time ?? 0}s (${(currentStep as SwimStep).stroke})`;
    case StepType.RUNDISTANCE:
        return `Distancia: ${(currentStep as RunStep).distance ?? 0}m`; 
    case StepType.RUNTIME:
        return `Tiempo: ${(currentStep as RunStep).time ?? 0}s`;
    case StepType.RUNCALORIES:
        return `Calorias: ${(currentStep as RunStep).calories ?? 0}kcal`;
    case StepType.EXERCISE:
        return `Ejercicio   : ${(currentStep as GymStep).exercise}`;
    case StepType.INTERVAL:
        return `Intervalo   : ${(currentStep as GymStep).exercise} por ${(currentStep as GymStep).time ?? 0}s`;
      return ;
    default:
      return 'Paso';
  }
};
