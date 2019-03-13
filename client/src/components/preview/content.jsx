import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
  observer,
} from 'mobx-react';
import { TemplateData } from '../../store/index';
import Header from './header/header.jsx';
import Banner from './banner/banner.jsx';
import Video from './video/video.jsx';
import Picture from './display-picture/display-picture.jsx';
import Footer from './footer/footer.jsx';
import CategoryList from './category-list/category-list.jsx';
import ProductList from './product-list/product-list.jsx';
import TagList from './tag-list/tag-list.jsx';

import classes from './preview-content.less';

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

@observer export default class PreviewContent extends React.Component {
  componentDidMount() {
    const { templateData } = this.props;
    templateData.dragDropDataObj.eleWrapper = this.wrapper;
  }

  // 判断 是否展示 以及 排序
  viewComponent(v) {
    const { templateData } = this.props;
    const { section } = templateData;
    const config = section[v];
    let component = null;
    if (v.includes('scrollBanner') && config.isHidden) {
      component = <Banner key={v} name={v} />;
    } else if (v.includes('video') && config.isHidden) {
      component = <Video key={v} obj={config} />;
    } else if (v.includes('displayPicture') && config.isHidden) {
      component = <Picture key={v} name={v} />;
    } else if (v.includes('categoryList') && config.isHidden) {
      component = <CategoryList key={v} obj={config} />;
    } else if (v.includes('productList') && config.isHidden) {
      component = <ProductList key={v} obj={config} />;
    } else if (v.includes('tagList') && config.isHidden) {
      component = <TagList key={v} obj={config} />;
    }
    return component;
  }

  render() {
    const { templateData } = this.props;
    const { section, sortArr, dragDropDataObj } = templateData;
    // 必须是以 pc 端打开的
    const dropCls = dragDropDataObj.controllerVal === 'start' ? classes.isStart : '';
    const terminalCls = templateData.type === 'Phone' ? classes.phone : '';
    return (
      <section className={classes.container}>
        <div
          ref={n => this.wrapper = n}
          className={`${classes.wrapper} ${dropCls} ${terminalCls}`}
        >
          <Header />
          <div>
            {
              sortArr.map(v => (
                this.viewComponent(v)
              ))
            }
          </div>
          <Footer />
        </div>
      </section>
    )
  }
}

PreviewContent.wrappedComponent.propTypes = {
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};
