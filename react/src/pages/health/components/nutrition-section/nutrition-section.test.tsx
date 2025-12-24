import React from 'react';
import ReactDOM from 'react-dom';
import NutritionSection from './nutrition-section';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NutritionSection />, div);
  ReactDOM.unmountComponentAtNode(div);
});