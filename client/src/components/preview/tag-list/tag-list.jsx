import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
} from 'mobx-react';

import { TemplateData } from '../../../store/index';
import classes from './tag-list.less';

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

class TagList extends React.Component {
  componentDidMount() {
    const { templateData } = this.props;
    templateData.dragDropDataObj.eleHeight.push(this.wrapper.clientHeight)
  }

  render() {
    const { templateData } = this.props;
    const isMobile = templateData.type === 'Phone';
    const arr = isMobile ? [1, 2] : [1, 2, 3, 4];
    return (
      <div
        ref={n => this.wrapper = n}
        className={`${classes.container} ${isMobile ? classes.phone : ''}`}
      >
        <div className={classes.header}>
          <h2>MORE OPTIONS</h2>
        </div>
        <div className={classes.wrapper}>
          {
            arr.map(v => (
              <div key={v} className={classes.items}>
                <div className={`icon-default-logo ${classes.icon}`} />
                <div className={classes.info}>
                  <span>Name</span>
                  <span>$ 0.00</span>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

TagList.wrappedComponent.propTypes = {
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default TagList;
