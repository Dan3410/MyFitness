import React from 'react';
import ReactDOM from 'react-dom';
import SwimStep from './swimStep';
import { StepType } from '../../../../../models/workoutSteps';
import { SwimStroke } from '../../../../../models/workoutSteps';

it('renders the swim step component', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SwimStep step={{ type: StepType.SWIMTIME, distance: 0, time: 50, gear: [], stroke: SwimStroke.CHOICE }} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
