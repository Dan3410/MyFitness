import React from 'react';
import ReactDOM from 'react-dom';
import RestStep from './restStep';

it('renders the rest step component', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RestStep step={{ type: 'REST', seconds: 30 }} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
