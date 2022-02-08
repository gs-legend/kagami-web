import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import Root from './containers/Root';
import "./styles.less";

import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);

reportWebVitals();