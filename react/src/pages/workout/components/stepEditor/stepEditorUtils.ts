import { RestStep, WorkoutSet, WorkoutStep, SwimStep, StepType, RunStep, GymStep } from '../../../../models/workoutSteps';
import { formatDistance, formatDuration } from '../../utils/stepFormatters';

export const getStepLabel = (currentStep: WorkoutStep) => {
  switch (currentStep.type) {
    case StepType.REST:
      return `Descanso (${formatDuration((currentStep as RestStep).seconds)})`;
    case StepType.SET:
      return `Set x${(currentStep as WorkoutSet).repeat}`;
    case StepType.SWIMWARMUP:
    case StepType.RUNWARMUP:
    case StepType.GYMWARMUP:
      return 'Calentamiento';
    case StepType.SWIMCOOLDOWN:
    case StepType.RUNCOOLDOWN:
    case StepType.GYMCOOLDOWN:
      return 'Ablande';
    case StepType.SWIMDISTANCE:
      return `Distancia: ${formatDistance((currentStep as SwimStep).distance)} (${(currentStep as SwimStep).stroke})`;
    case StepType.SWIMTIME:
      return `Tiempo: ${formatDuration((currentStep as SwimStep).time)} (${(currentStep as SwimStep).stroke})`;
    case StepType.RUNDISTANCE:
      return `Distancia: ${formatDistance((currentStep as RunStep).distance)}`; 
    case StepType.RUNTIME:
      return `Tiempo: ${formatDuration((currentStep as RunStep).time)}`;
    case StepType.RUNCALORIES:
        return `Calorias: ${(currentStep as RunStep).calories ?? 0}kcal`;
    case StepType.EXERCISE:
        return `Ejercicio   : ${(currentStep as GymStep).exercise}`;
    case StepType.INTERVAL:
      return `Intervalo   : ${(currentStep as GymStep).exercise} por ${formatDuration((currentStep as GymStep).time)}`;
      return ;
    default:
      return 'Paso';
  }
};
