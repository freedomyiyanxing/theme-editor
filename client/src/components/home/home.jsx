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
    }
  }

  componentDidMount() {
    const { templateData } = this.props;
    // 获取浏览地址栏中的ID
    window.__get__url__id = getUrlId();
    this._isMounted = true;
    get('/business/store_themes/customize', {
      themeId: window.__get__url__id,
    })
      .then((resp) => {
        // id 错误的情况
        if (resp.error) {
          console.log(resp.error.toString())
          // window.location.href = resp.error || 'https://influmonster.com/';
          return;
        }
        // 动态的修改页面标签标题
        const title = document.getElementById('title');
        title.innerHTML = resp.name;
        //
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
        window.sessionStorage.setItem('section', JSON.stringify(obj.data))
        // 数据传递给mobx
        console.log(obj, '222')
        templateData.setDefaultData(obj)
        if (this._isMounted) {
          this.setState({
            data: obj.data,
          })
        }
        // 删除骨架屏
        const loadingEle = document.getElementById('loading_loading');
        const { body } = document;
        body.removeChild(loadingEle);
      })
      .catch((err) => {
        console.log(err.toString())
        // window.location.href = err.error || 'https://influmonster.com/';
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { data } = this.state;
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
              <Preview />
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
