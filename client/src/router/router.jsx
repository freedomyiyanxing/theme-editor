import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { Route, Redirect } from 'react-router-dom';

import ListBar from '../components/sidebar/index.jsx';
import AddModule from '../components/add-module/add-module.jsx';
import AddDetails from '../components/add-details/add-details.jsx';
import AddImages from '../components/add-img/add-img.jsx';

const getSessionId = (name) => {
  const type = window.sessionStorage.getItem(name);
  if (window.sessionStorage) {
    const s = JSON.parse(window.sessionStorage.getItem('section'));
    if (name === 'details') {
      return s[type]
    } else if (name === 'images') { // eslint-disable-line
      const imgType = JSON.parse(type);
      return s[imgType.name] && s[imgType.name].config.modulesOrder[imgType.index];
    } else {
      return window.sessionStorage.getItem(name);
    }
  }
  return false;
}

/**
 * 强制刷新后会清除session中的数据, 会导致读取某个对象失败
 * 解决方案, 路由重定向到index页面
 */
class Refresh extends React.Component {
  render() {
    const { name, component: Component, ...reset } = this.props;
    return (
      <Route
        {...reset}
        render={(props) => {
          return getSessionId(name)
            ? <Component {...props} />
            : (
              <Redirect
                to={{
                  pathname: `/index/${window.__get__url__id}`,
                }}
              />
            )
        }}
      />
    )
  }
}
Refresh.propTypes = {
  name: PropTypes.string.isRequired,
  component: PropTypes.func.isRequired,
};

const url = process.env.URL_BASE || '';

export default () => [
  <Route key={uuid()} path={`${url}/index/:id`} exact component={ListBar} />,
  <Refresh key={uuid()} name="module" path={`${url}/addModule/:id`} component={AddModule} />,
  <Refresh key={uuid()} name="details" path={`${url}/addDetails/:id`} component={AddDetails} />,
  <Refresh key={uuid()} name="images" path={`${url}/addImages/:id`} component={AddImages} />,
]
