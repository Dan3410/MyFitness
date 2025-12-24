import React from 'react';
import ReactDOM from 'react-dom';
import HeightSection from './height-section';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HeightSection />, div);
  ReactDOM.unmountComponentAtNode(div);
});