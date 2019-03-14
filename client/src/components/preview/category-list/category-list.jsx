import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
} from 'mobx-react';

import { TemplateData } from '../../../store/index';

import classes from './category-list.less';

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

class CategoryList extends React.Component {
  componentDidMount() {
    const { templateData } = this.props;
    templateData.dragDropDataObj.eleHeight.push(this.wrapper.clientHeight)
  }

  render() {
    const { templateData } = this.props;
    const isMobile = templateData.type === 'Phone';
    const arr = isMobile ? [1, 2, 3] : [1, 2, 3, 4, 5];
    return (
      <div
        ref={n => this.wrapper = n}
        className={`${classes.container} ${isMobile ? classes.phone : ''}`}
      >
        <h1 className={classes.title}>MORE OPTIONS</h1>
        <div className={classes.wrapper}>
          {
            arr.map(v => (
              <div key={v} className={`${classes.item} ${isMobile ? classes.phoneItem : ''}`}>
                <h2 className={classes.itemTitle}>name</h2>
                <span
                  className={`icon-default-logo ${classes.itemImg} ${isMobile ? classes.phoneImg : ''}`}
                />
                <span className={`button-black ${classes.itemBtn} ${isMobile ? classes.phoneBtn : ''}`}>
                  Get info
                </span>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

CategoryList.wrappedComponent.propTypes = {
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default CategoryList;
