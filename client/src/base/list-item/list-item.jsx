import React from 'react';
import PropTypes from 'prop-types';

import classes from './list-item.less';

import { chapterType, iconName } from '../../common/js/util';

class ListItem extends React.Component {
  render() {
    const {
      value, handleEdit, handleDelete, title,
      isHidden, handleIsHidden, index,
    } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.left}>
          <span className={`${classes.icon} icon-${iconName(value)}`} />
          <span className={classes.text}>{title}</span>
        </div>
        <div className={classes.right}>
          <span
            tabIndex={0}
            role="button"
            onClick={() => { handleIsHidden(value) }}
            className={isHidden ? 'icon-hidden' : 'icon-block'}
          />
          {
            chapterType(value)
              ? (
                <span
                  className="icon-edit"
                  tabIndex={0}
                  role="button"
                  onClick={() => { handleEdit(value, index) }}
                />
              )
              : null
          }
          {
            chapterType(value)
              ? (
                <span
                  className="icon-delete"
                  tabIndex={0}
                  role="button"
                  onClick={() => { handleDelete(value, index) }}
                />
              )
              : null
          }
          <span className="icon-drag" />
        </div>
      </div>
    )
  }
}

ListItem.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isHidden: PropTypes.bool.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleIsHidden: PropTypes.func.isRequired,
};

export default ListItem
