import React from 'react';
import ReactDOM from 'react-dom';
import RestStep from './restStep';
import { StepType } from '../../../../../models/workoutSteps';
import { WorkoutCategory } from '../../../../../models/workoutCategories';

it('renders the rest step component', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RestStep step={{ type: StepType.REST, seconds: 30 }} workoutCategory={WorkoutCategory.GYM} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
