import React from 'react';
import PropTypes from 'prop-types';

import classes from './list.less';

export default class ListView extends React.Component {
  render() {
    const {
      children, click, isFlex, index, styles,
    } = this.props;
    return (
      <div
        className={`${classes.items} ${!isFlex ? classes.flex : ''}`}
        tabIndex={index}
        role="button"
        onClick={click}
        style={{ ...styles }}
      >
        {children}
      </div>
    )
  }
}

ListView.propTypes = {
  children: PropTypes.node.isRequired,
  click: PropTypes.func,
  isFlex: PropTypes.bool,
  styles: PropTypes.object,
  index: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

ListView.defaultProps = {
  click: null,
  isFlex: false,
  index: 0,
  styles: null,
};
