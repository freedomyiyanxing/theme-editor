import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import {
  inject,
  observer,
} from 'mobx-react';

import { TemplateData } from '../../store/index';
import LeftOperation from '../left-container/left-container.jsx';
import Preview from '../preview/content.jsx';
import PreviewHeader from '../preview-header/preview-header.jsx';

import classes from './home.less';

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

@observer export default class Home extends React.Component {
  componentDidMount() {
    const { templateData } = this.props;
    // 获取id
    const storeId = window.location.search.split('=')[1];
    templateData.getData(storeId);

    // 删除骨架屏
    const loadingEle = document.getElementById('loading_loading');
    const { body } = document;
    body.removeChild(loadingEle)
  }

  render() {
    const { templateData } = this.props;
    const { loading, dragDropDataObj } = templateData;
    /**
     * 加上sortArr判断是因为拖动排序需要这个数据,
     * 如果不加 则拿不到这个数据,因为mobx不会观察
     */
    return (
      <div className={`clearfix ${classes.container}`}>
        {
          loading && dragDropDataObj.sortArr
            ? [
              <div key={uuid()} className={classes.lWrapper}>
                <LeftOperation />
              </div>,
              <div key={uuid()} className={classes.rWrapper}>
                <PreviewHeader />
                <Preview />
              </div>,
            ]
            : null
        }
      </div>
    )
  }
}

Home.wrappedComponent.propTypes = {
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};
