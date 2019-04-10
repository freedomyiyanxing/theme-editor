/* eslint-disable */
import React from 'react';
import uuid from 'uuid';
import PropTypes from 'prop-types';
import {
  Modal, Spin, Input, notification,
} from 'antd';
import moment from 'moment';
import { post, get, CancelToken } from '../../api/http';

import classes from './list-btn.less';

const MSGTEXT = 'Are you sure you want to publish this theme？This will replace yourcurrent live theme.';

// 发布版本的html
const PublishHtml = ({change, data}) => {
  let version = '';
  let date = '';
  if (typeof data.version === 'number' && typeof data.publishDate === 'number') {
    version = data.version.toFixed(1);
    date = moment(data.publishDate).format('YYYY-MM-DD HH:mm:ss');
  }
  return [
    <div key={uuid()} className={classes.formContainer}>
      <span className={classes.formText}>Version:</span>
      <Input disabled defaultValue={version} />
    </div>,
    <div key={uuid()} className={classes.formContainer}>
      <span className={classes.formText}>Publish Date:</span>
      <Input disabled defaultValue={date} />
    </div>,
    <div key={uuid()} className={classes.formContainer}>
      <span className={classes.formText}>Remarks:</span>
      <Input onChange={change} />
    </div>,
  ]
}

PublishHtml.propTypes = {
  change: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
}

class PublishContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      data: null,
      isOkBtn: true,
      confirmLoading: false,
    };
  }

  componentDidMount() {
    const { themeId } = this.props;
    this._isMounted = true;
    this.publish_1_source = CancelToken.source();
    setTimeout(() => {
      get(
        '/business/store_themes/publishModal',
        { themeId },
        { cancelToken: this.publish_1_source.token, },
      )
        .then((resp) => {
          if (this._isMounted) {
            const { isPublish } = resp;
            this.setState({
              data: resp,
              isOkBtn: !isPublish,
            });
            this.publish_1_source = null;
          }
        })
        .catch((err) => {
          this.publish_1_source = null;
          console.log(err);
        });
    }, 500)
  }

  componentWillUnmount() {
    this._isMounted = false;
    console.log('组件释放了嘛...')
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

  // 直接关闭
  handleCancel = () => {
    const { cancel } = this.props;
    this.publish_1_source && this.publish_1_source.cancel('操作取消成功...1');
    cancel()
  }

  // 输入版本内容
  publishChange = (e) => {
    this.publishMsg = e.target.value
  }


  // 提交publish版本信息
  handlePublishSave() {
    const { themeId, cancel } = this.props;
    this.setState({
      confirmLoading: true,
    })
    setTimeout(() => {
      post('/business/store_themes/publish', {
        themeId,
        remark: this.publishMsg,
      })
        .then(() => {
          // this.setState({
          //   visible: false,
          //   confirmLoading: false,
          // })
          cancel()
          this.openNotificationWithIcon('success', 'Success', '发布版本成功 可回到上个窗口查看');
          // window.opener.__refresh__page__()
        })
        .catch(() => {
          // this.setState({
          //   visible: false,
          //   confirmLoading: false,
          // })
          cancel()
          this.openNotificationWithIcon('error', 'Error', '发布版本失败...')
        })
    }, 1000)
  }

  render() {
    const {
      data, isOkBtn, confirmLoading,
    } = this.state;
    console.log(data, 'publish 刷新了没....')
    return (
      <Modal
        key="modal"
        width={600}
        title="Publish Theme"
        visible
        okText="Publish"
        okButtonProps={{ disabled: isOkBtn }}
        onOk={this.handlePublishSave}
        confirmLoading={confirmLoading}
        onCancel={this.handleCancel}
        destroyOnClose
      >
        <div className={classes.modalContent}>
          {
            data
              ? <PublishHtml change={this.publishChange} data={data} />
              : <Spin />
          }
        </div>
        <div className={classes.msgContainer}>
          <h2>Tips</h2>
          <p>{MSGTEXT}</p>
        </div>
      </Modal>
    )
  }
}

PublishContainer.propTypes = {
  themeId: PropTypes.string.isRequired,
  cancel: PropTypes.func.isRequired,
};

export default PublishContainer
