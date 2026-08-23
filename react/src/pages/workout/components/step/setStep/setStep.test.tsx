import React from 'react';
import ReactDOM from 'react-dom';
import SetStep from './setStep';
import { WorkoutCategory } from '../../../../../models/workoutCategories';
import { StepType } from '../../../../../models/workoutSteps';

it('renders the set step component', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <SetStep
      step={{ type: StepType.SET, repeat: 3, steps: [{ type: StepType.REST, seconds: 30 }] }}
      workoutCategory={WorkoutCategory.GYM}
    />,
    div,
  );
  ReactDOM.unmountComponentAtNode(div);
});
