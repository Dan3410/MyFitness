import React from 'react';
import ReactDOM from 'react-dom';
import Profile from './weight-section';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WeightSection />, div);
  ReactDOM.unmountComponentAtNode(div);
});