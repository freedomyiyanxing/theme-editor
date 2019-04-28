import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
} from 'mobx-react';

import { TemplateData } from '../../../store/index';
import classes from './product-list.less';

const arr = [1, 2, 3, 4];

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

class ProductList extends React.Component {
  componentDidMount() {
    const { templateData, index } = this.props;
    templateData.eleHeight.splice(index, 0, this.wrapper.clientHeight)
  }

  render() {
    const { templateData } = this.props;
    const isMobile = templateData.type === 'Phone';
    return (
      <div className={`${classes.container} ${isMobile ? classes.phone : ''}`}>
        <div
          ref={n => this.wrapper = n}
          className={classes.wrapper}
        >
          {
            isMobile
              ? null
              : (
                <div className={classes.left}>
                  <div className={classes.leftHeader}>
                    <div>
                      <span>
                        <span>Filtered By :</span>
                        <span>(0 Items)</span>
                      </span>
                    </div>
                    <div>
                      <span>
                        <p>Filters you have selected will appear here</p>
                      </span>
                    </div>
                  </div>
                  <div className={classes.leftFooter}>
                    <div className={classes.title}>
                      <span className={classes.name}>Category</span>
                      <span className="icon-drop-down" />
                    </div>
                    <div className={classes.list}>
                      {
                        arr.map(v => (
                          <div key={v} className={classes.item}>
                            <span>Category Name</span>
                            <span className={classes.box} />
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              )
          }
          <div className={classes.right}>
            <div className={classes.header}>
              <span />
              <span />
            </div>
            <div className={`${classes.content} clearfix`}>
              {
                arr.map(v => (
                  <div
                    key={v}
                    className={`${classes.items} ${isMobile ? classes.phoneItems : ''}`}
                  >
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
        </div>
      </div>
    )
  }
}

ProductList.wrappedComponent.propTypes = {
  index: PropTypes.number.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default ProductList;
