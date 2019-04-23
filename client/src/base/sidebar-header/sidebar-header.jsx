import React from 'react';
import PropTypes from 'prop-types';

import classes from './sidebar-header.less';

export default class SidebarHeader extends React.Component {
  handleClick = () => {
    const { history } = this.props;
    history.goBack();
  }

  render() {
    const { children, isReturn } = this.props;
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
                  onClick={this.handleClick}
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
  history: PropTypes.object,
  isReturn: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

SidebarHeader.defaultProps = {
  history: null,
  isReturn: false,
};
