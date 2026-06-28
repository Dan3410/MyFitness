import React from 'react';
import ReactDOM from 'react-dom';
import SwimStep from './swimStep';

it('renders the swim step component', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SwimStep step={{ type: 'SWIM_TIME', distance: 0, time: 50, gear: [], stroke: 'CHOICE' }} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
