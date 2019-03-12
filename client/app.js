import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import App from './src/App.jsx';

// 引入数据管理对象
import Store from './src/store/index'

const root = document.getElementById('root');

ReactDOM.render(
  <Provider templateData={Store.templateData}>
    <App />
  </Provider>,
  root,
);
