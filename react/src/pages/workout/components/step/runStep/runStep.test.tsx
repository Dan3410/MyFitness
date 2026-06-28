import React from 'react';
import ReactDOM from 'react-dom';
import RunStep from './runStep';

it('renders the run step component', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RunStep step={{ type: 'RUN_TIME', distance: 0, calories: 0, time: 600, speed: 10 }} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
