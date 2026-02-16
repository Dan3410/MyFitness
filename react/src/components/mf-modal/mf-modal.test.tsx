import ReactDOM from 'react-dom';
import MFModal from './mf-modal';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MFModal />, div);
  ReactDOM.unmountComponentAtNode(div);
});