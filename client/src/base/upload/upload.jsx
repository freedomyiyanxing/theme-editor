import React from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';
import {
  inject,
  observer,
} from 'mobx-react';

import classes from './upload.less';
import { TemplateData } from '../../store/index';
import { Xhr, deleteUploadImg } from '../../api/http';

const IMGUrl = process.env.IMG_BASE || '';

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

@observer class UploadIndex extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: 'start',
    }
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // 上传
  handleChange = (e) => {
    this.isRefresh();
    const { loading } = this.state;
    if (loading !== 'start' && loading !== 'end') return;
    const url = '/business/store_themes/uploadThemeImage';
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    this.setState({
      loading: 'loading',
    });
    Xhr(url, formData)
      .then((data) => {
        if (!this._isMounted) { // 组件关闭时干掉
          return;
        }
        const { obj, templateData } = this.props;
        templateData.setUploadImg(obj, data.url);
        this.setState({
          loading: 'end',
        })
      }).catch((err) => {
        console.log(err);
        this.setState({
          loading: 'end',
        })
      })
  };

  // 删除
  handleDelete = () => {
    this.isRefresh();
    const { obj, templateData } = this.props;
    const { config } = templateData.section[obj.name].config.modules[obj.index][obj.val];
    deleteUploadImg(config.imgPath)
      .then((resp) => {
        if (resp.data.message === 'Success!') {
          templateData.deleteUploadImg(obj);
        }
      }).catch((err) => {
        console.log(err)
      })
  };

  // 做了操作时 启动禁止刷新 跟 删除
  isRefresh() {
    if (window.__IS__START__REFRESH__) {
      window.__stopRefresh__();
    }
  }

  render() {
    const { obj, templateData } = this.props;
    const { config } = templateData.section[obj.name].config.modules[obj.index][obj.val];
    const { loading } = this.state;
    return (
      <div className="clearfix">
        <p className={classes.title}>image :</p>
        <div className={classes.box}>
          {
            config.imgPath
              ? [
                <span key="img-1" className={classes.wrapper}>
                  <span><img src={IMGUrl + config.imgPath} alt="avart" /></span>
                </span>,
                <span
                  key="img-2"
                  tabIndex={0}
                  role="button"
                  onClick={this.handleDelete}
                  className={`icon-delete ${classes.icon}`}
                />,
              ]
              : null
          }
          {
            loading === 'loading'
              ? <div className={classes.loading}><Spin number={200} /></div>
              : null
          }
        </div>
        <div className={classes.btnWrapper}>
          <div className={classes.left}>
            <span className="icon-files" />
            <span className={classes.text}>1 File selected</span>
          </div>
          {
            config.imgPath === null
              ? (
                <div className={classes.right}>
                  <input title="" onChange={this.handleChange} type="file" accept="image/*" />
                  <span className="icon-upload" />
                  <span>Browse...</span>
                </div>
              )
              : null
          }
        </div>
      </div>
    )
  }
}

UploadIndex.wrappedComponent.propTypes = {
  obj: PropTypes.object.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};


export default UploadIndex
