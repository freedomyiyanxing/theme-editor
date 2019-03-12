import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
} from 'mobx-react';

import { TemplateData } from '../../../store/index';
import classes from './header.less';

const data = [
  'Home',
  'Shop',
  'About',
];

const logoIcon = [1, 2, 3];

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

class Header extends React.Component {
  render() {
    const { templateData } = this.props;
    const isMobile = templateData.type === 'Phone';
    return (
      <div className={classes.container}>
        <div className={`${classes.wrapper} ${isMobile ? classes.phoneWrapper : ''}`}>
          <span className={`icon-logo ${classes.icon}`} />
          <span className={classes.headerRight} />
        </div>
        {
          isMobile
            ? (
              <div className={classes.phoneTop}>
                <span className={`icon-logo ${classes.phoneIconLogo}`} />
                <span className={classes.text}>Your store’s name</span>
                <span className={classes.follow}>
                  <span className={`icon-subscribe ${classes.iconSubscribe}`} />
                  <span>Follow</span>
                </span>
              </div>
            )
            : (
              <div className={classes.top}>
                <span className={classes.logo}>
                  <span className={`icon-logo ${classes.iconLogo}`} />
                </span>
                <span className={`icon-default-portrait ${classes.iconPortrait}`}>
                  {logoIcon.map(v => <span key={v} className={`path${v}`} />)}
                </span>
                <span className={classes.right}>
                  <span className={classes.text}>Your store’s name</span>
                  <span className={classes.follow}>
                    <span className={`icon-subscribe ${classes.iconSubscribe}`} />
                    <span>Follow</span>
                  </span>
                </span>
              </div>
            )
        }
        {
          isMobile
            ? null
            : (
              <div className={classes.bottom}>
                {data.map((v, i) => (
                  <span key={v} className={i === 0 ? classes.active : ''}>{v}</span>
                ))}
              </div>
            )
        }
      </div>
    )
  }
}

Header.wrappedComponent.propTypes = {
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default Header;
