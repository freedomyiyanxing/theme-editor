import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal, Spin, Input, notification,
} from 'antd';
import moment from 'moment';
import { post, get, CancelToken } from '../../api/http';

import classes from './publish.less';

const MSGTEXT = 'Are you sure you want to publish this theme？This will replace yourcurrent live theme.';

class PublishContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      data: null,
      val: '',
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
        { cancelToken: this.publish_1_source.token },
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
    if (this.publish_1_source) {
      this.publish_1_source.cancel('操作取消成功...1');
    }
    cancel()
  }

  // 输入版本内容
  publishChange = (e) => {
    this.setState({
      val: e.target.value,
    })
  }

  // 提交publish版本信息
  handlePublishSave = () => {
    const { themeId, cancel } = this.props;
    const { val } = this.state;
    this.setState({
      confirmLoading: true,
    })
    setTimeout(() => {
      post('/business/store_themes/publish', {
        themeId,
        remark: val,
      })
        .then(() => {
          cancel()
          this.openNotificationWithIcon('success', 'Success', '发布版本成功 可回到上个窗口查看');
          // window.opener.__refresh__page__()
        })
        .catch(() => {
          cancel()
          this.openNotificationWithIcon('error', 'Error', '发布版本失败...')
        })
    }, 500)
  }

  render() {
    const {
      data, isOkBtn, confirmLoading, val,
    } = this.state;
    return (
      <Modal
        key="modal"
        width={600}
        title="Publish Theme"
        visible
        okText="Publish"
        okButtonProps={{ disabled: isOkBtn }}
        confirmLoading={confirmLoading}
        onOk={this.handlePublishSave}
        onCancel={this.handleCancel}
        destroyOnClose
      >
        {
          !data
            ? <Spin />
            : (
              <div className={classes.modalContent}>
                <div className={classes.formContainer}>
                  <span className={classes.formText}>Version:</span>
                  <Input disabled defaultValue={data.version.toFixed(1)} />
                </div>
                <div className={classes.formContainer}>
                  <span className={classes.formText}>Publish Date:</span>
                  <Input disabled defaultValue={moment(data.publishDate).format('YYYY-MM-DD HH:mm:ss')} />
                </div>
                <div className={classes.formContainer}>
                  <span className={classes.formText}>Remarks:</span>
                  <Input onChange={this.publishChange} value={val} />
                </div>
              </div>
            )
        }
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
