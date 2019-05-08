import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
} from 'mobx-react';
import { Route } from 'react-router-dom';
import { TemplateData } from '../../store/index';
import Index from '../../router/router.jsx';
import BottomBtn from '../operation-btn/index.jsx';
import Preview from '../preview/content.jsx';
import PreviewHeader from '../preview-header/preview-header.jsx';
import { get } from '../../api/http';
import { getUrlId } from '../../common/js/util';
import { template } from '../../common/js/default-template-data';
import classes from './home.less';

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      data: null,
      headerData: null,
      flooterData: null,
    }
  }

  componentDidMount() {
    // 获取浏览地址栏中的ID
    window.__get__url__id = getUrlId();
    this._isMounted = true;
    get('/business/store_themes/customize', this.setReqParams())
      .then((resp) => {
        // id 错误的情况
        if (resp.error) {
          console.info(resp.error.toString())
          window.location.href = resp.error || 'https://influmonster.com/';
          return;
        }
        // 动态的修改页面标签标题
        this.setTitle(resp.name)

        // 修改数据结构
        const obj = this.setInitilData(resp);

        // 存储数据
        this.storageDate(obj);

        if (this._isMounted) {
          this.setState({
            data: obj.data,
            headerData: {
              storeInfo: resp.storeInfo,
              storeMenus: resp.storeMenus,
            },
            flooterData: {
              leftNavigation: resp.leftNavigation,
              middleNavigation: resp.middleNavigation,
            },
          })
        }
        // 删除骨架屏
        this.deleteSkeleton();
      })
      .catch((err) => {
        console.log(err.toString())
        window.location.href = err.error || 'https://influmonster.com/';
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  /**
   * 组装 customize 接口的数据
   * 主要是判断是否是开发时环境, 如果是开发时则添加一个storeID
   */
  setReqParams() {
    const obj = {
      themeId: window.__get__url__id,
    };
    if (process.env.IS_DEV) {
      obj.storeId = 1;
    }
    return obj;
  }

  /**
   * 动态的修改页面标签标题
   * @param {*} name
   */
  setTitle(name) {
    const title = document.getElementById('title');
    title.innerHTML = name || 'Store Template';
  }

  /**
   * 修改数据结构
   * @param {*} resp
   */
  setInitilData(resp) {
    const obj = {
      id: window.__get__url__id,
      type: resp.type,
    };
    // 判断当前用户是否是新用户
    if (resp.draftData && resp.draftData !== '') {
      obj.bool = false;
      obj.data = JSON.parse(resp.draftData);
    } else {
      obj.bool = true;
      obj.data = template;
    }
    return obj;
  }

  /**
   * 把数据写入 sessionStorage
   * 把数据存储到 MOBX
   * @param {*} obj
   */
  storageDate(obj) {
    const { templateData } = this.props;
    window.sessionStorage.setItem('section', JSON.stringify(obj.data))
    templateData.setDefaultData(obj)
  }

  /**
   * 删除骨架屏
   */
  deleteSkeleton() {
    const loadingEle = document.getElementById('loading_loading');
    const { body } = document;
    body.removeChild(loadingEle);
  }

  render() {
    const { data, headerData, flooterData } = this.state;
    return (
      data
        ? (
          <div className={classes.container}>
            <div className={classes.lWrapper}>
              <Index />
              <Route path="/" component={BottomBtn} />
            </div>
            <div className={classes.rWrapper}>
              <PreviewHeader />
              <Preview headerDate={headerData} flooterData={flooterData} />
            </div>
          </div>
        )
        : null
    )
  }
}

Home.wrappedComponent.propTypes = {
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};
