import ReactDOM from 'react-dom';
import MFHeader from './mf-header';


it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MFHeader></MFHeader>, div);
  ReactDOM.unmountComponentAtNode(div);
});