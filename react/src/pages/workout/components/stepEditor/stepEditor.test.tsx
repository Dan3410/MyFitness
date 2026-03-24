import React from 'react';
import ReactDOM from 'react-dom';
import StepEditor from './stepEditor';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<StepEditor />, div);
  ReactDOM.unmountComponentAtNode(div);
});