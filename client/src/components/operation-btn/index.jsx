import React from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown, Spin, notification, Tooltip,
} from 'antd';
import { inject } from 'mobx-react';
import { TemplateData } from '../../store/index';
import { post } from '../../api/http';
import ListBtn from './list-btn.jsx';

import classes from './index.less'

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})
class BottomBtn extends React.Component {
  state = {
    loading: false,
    tooltipVisible: false,
  };

  // 提交数据
  handleSave = () => {
    if (window.__IS__START__REFRESH__) { // 没有做如何操作时 不保存
      this.setState({
        tooltipVisible: false,
      });
      this.openNotificationWithIcon('warning', 'Warning', '没有做如何操作时 不予保存');
      return;
    }
    const { templateData } = this.props;
    const url = '/business/store_themes/addCustomize';
    this.setState({
      loading: true,
      tooltipVisible: false,
    });
    setTimeout(() => {
      post(url, {
        themeId: templateData.themeId,
        draftData: JSON.stringify(templateData.toJson()),
      })
        .then((resp) => {
          this.setState({
            loading: false,
          });
          console.log('保存... 完成, 移除监听,', resp);
          templateData.isNewUser = false;
          this.openNotificationWithIcon('success', 'Success', '保存 成功 解绑 \'删除,刷新\' 了');
          // 保存完成移除监听刷新删除的事件
          window.__clearRefreshClick__();
          window.__IS__START__REFRESH__ = true;
        }).catch((err) => {
          this.setState({
            loading: false,
          });
          this.openNotificationWithIcon('error', 'Error', `id 错误... 请刷新 ${err.message}`)
        });
    }, 500)
  }

  // 消息提示框
  openNotificationWithIcon = (type, title, val) => {
    notification[type]({
      message: title,
      description: val,
      duration: 3,
      placement: 'topLeft',
    });
  };

  // 控制tooltip显示隐藏
  tooltipToggle = () => {
    this.setState({
      tooltipVisible: true,
    })
  }

  render() {
    const { loading, tooltipVisible } = this.state;
    return (
      <div className={classes.container}>
        <Dropdown
          overlay={(
            <div className={classes.content}>
              <ListBtn tooltipToggle={this.tooltipToggle} />
            </div>
          )}
          trigger={['click']}
        >
          <span className={classes.item}>
            Click me
          </span>
        </Dropdown>
        <Tooltip
          visible={tooltipVisible}
          placement="top"
          title="请点击保存"
          trigger="contextMenu"
        >
          <span
            role="button"
            tabIndex={0}
            className={classes.item}
          >
            {
              loading
                ? <Spin />
                : (
                  <span
                    tabIndex={0}
                    role="button"
                    className={classes.btn}
                    onClick={this.handleSave}
                  >
                    Save
                  </span>
                )
            }
          </span>
        </Tooltip>
      </div>
    )
  }
}

BottomBtn.wrappedComponent.propTypes = {
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default BottomBtn
