import React from 'react';
import ReactDOM from 'react-dom';
import PersonalDataSection from './personal-data-section';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PersonalDataSection />, div);
  ReactDOM.unmountComponentAtNode(div);
});