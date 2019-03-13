import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
} from 'mobx-react';
import { Spin, notification } from 'antd';
import { post } from '../../api/http';
import { TemplateData } from '../../store/index';
import classes from './preview-header.less';
import { viewHeaderData } from '../../static/default-template-data';

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

export default class PreviewHeader extends React.Component {
  state = {
    loading: false,
  };

  handleClick = (v) => {
    console.log(v)
  };

  // 保存...
  handleSaveClick = () => {
    const { templateData } = this.props;
    const url = '/business/store_themes/addCustomize';
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      console.log(templateData.toJson())
      post(url, {
        themeId: templateData.themeId,
        draftData: JSON.stringify(templateData.toJson()),
      })
        .then((resp) => {
          this.setState({
            loading: false,
          });
          console.log('保存... 完成, 移除监听,', resp);
          this.openNotificationWithIcon('success', 'Success', '保存 成功 解绑 \'删除,刷新\' 了');
          // 保存完成移除监听刷新删除的事件
          window.__clearRefreshClick__();
        }).catch((err) => {
          this.setState({
            loading: false,
          });
          this.openNotificationWithIcon('error', 'Error', `id 错误... 请刷新 ${err.message}`)
        });
    }, 500)
  };

  // 消息提示框
  openNotificationWithIcon = (type, title, val) => {
    notification[type]({
      message: title,
      description: val,
      duration: 3,
      placement: 'topLeft',
    });
  };

  render() {
    const { loading } = this.state;
    return (
      <header className={classes.container}>
        <div className={classes.wrapper}>
          <div className={classes.left}>
            <span className={classes.headerBtn}>
              {
                loading
                  ? <Spin />
                  : (
                    <span
                      tabIndex={0}
                      role="button"
                      className={classes.btn}
                      onClick={this.handleSaveClick}
                    >
                      Save
                    </span>
                  )
              }
            </span>
          </div>
          <div className={classes.center}>
            <span>Home Page</span>
          </div>
          <div className={classes.right}>
            {
              viewHeaderData.map((v, i) => (
                <span
                  key={v.icon}
                  role="button"
                  tabIndex={i}
                  className={classes.btnItems}
                  onClick={() => { this.handleClick(v.text) }}
                >
                  <span className={`${v.icon} ${classes.icon}`} />
                  <span>{v.text}</span>
                </span>
              ))
            }
          </div>
        </div>
      </header>
    )
  }
}

PreviewHeader.wrappedComponent.propTypes = {
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};
