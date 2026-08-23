import React from 'react';
import ReactDOM from 'react-dom';
import Step from './step';
import { StepType } from '../../../../models/workoutSteps';
import { WorkoutCategory } from '../../../../models/workoutCategories';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Step step={{ type: StepType.REST, seconds: 30 }} workoutCategory={WorkoutCategory.GYM} />, div);
  ReactDOM.unmountComponentAtNode(div);
});