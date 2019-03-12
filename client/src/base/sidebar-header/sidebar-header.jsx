import React from 'react';
import PropTypes from 'prop-types';

import classes from './sidebar-header.less';

export default class SidebarHeader extends React.Component {
  render() {
    const { children, isReturn, click } = this.props;
    return (
      <header className={classes.container}>
        <div className={classes.wrapper}>
          {
            isReturn
              ? children
              : [
                <span
                  key="left"
                  tabIndex={0}
                  role="button"
                  className={classes.sidebar}
                  onClick={click}
                >
                  <span className={`icon-drop-down ${classes.iconDropDown}`} />
                </span>,
                <span className={classes.text} key="right">{children}</span>,
              ]
          }
        </div>
      </header>
    )
  }
}

SidebarHeader.propTypes = {
  children: PropTypes.node.isRequired,
  click: PropTypes.func,
  isReturn: PropTypes.bool,
};

SidebarHeader.defaultProps = {
  isReturn: false,
  click: null,
};
