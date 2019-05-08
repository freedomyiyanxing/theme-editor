import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import {
  inject,
  observer,
} from 'mobx-react';
import { notification, Modal } from 'antd';
import Card from '../../base/drag/cards.jsx';
import ListView from '../../base/list/list.jsx';
import { TemplateData } from '../../store/index';
import { isTypeOf } from '../../common/js/util';
import { deleteUploadImg } from '../../api/http';
import { promptImgFormat, promptMsg } from '../../common/js/prompt-message';

import classes from '../../common/less/list-item.less';

// 限制删除
const LimitNumber = {
  images_1: 1, // picture 中的 style-1 最少一个
  images_2: 5, // picture 中的 style-2 最少五个
  images_3: 5, // picture 中的 style-3 最少五个
  images_4: 5, // picture 中的 style-4 最少五个
  images_5: 2, // picture 中的 style-5 最少二个
  slideshow: 1, // scroll-banner 最少一个
};

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

@observer class DetailsListItem extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      index: null,
    }
  }

  // 提示组件
  openNotificationWithIcon = (type, title, val) => {
    notification[type]({
      message: title,
      description: val,
      duration: 3,
      placement: 'topLeft',
    });
  };

  // 删除
  handleDelete = (index) => {
    const { templateData, name, refresh } = this.props;
    const { modules, modulesOrder } = templateData.section[name].config;
    const { type } = templateData.section[name];
    // 判断是否可删除
    if (this.isOperation(modules, modulesOrder, index) >= LimitNumber[type]) {
      // 判断 如果有 图片 则 弹出提示框;
      if (modules[index][modulesOrder[index]].config.imgPath) {
        this.toggle(index);
      } else {
        refresh();
        // 把删除的掉编号保存在store 中
        templateData.setComponentItems(name, index);
        // 在修改值
        templateData.deleteComponent(name, index);
      }
    } else {
      this.openNotificationWithIcon('error', 'Error', promptImgFormat(LimitNumber[type]))
    }
  };

  // 隐藏
  handleIsHidden = (val, index) => {
    const { templateData, name, refresh } = this.props;
    const { type } = templateData.section[name];
    const { modules, modulesOrder } = templateData.section[name].config;
    refresh();
    // 判断是否可隐藏
    if (this.isOperation(modules, modulesOrder, index) >= LimitNumber[type]) {
      templateData.setComponentIsHidden(name, val, index)
    } else {
      this.openNotificationWithIcon('error', 'Error', promptImgFormat(LimitNumber[type]))
    }
  };

  // 确定删除
  handleOk = () => {
    const { templateData, name, refresh } = this.props;
    const { modules, modulesOrder } = templateData.section[name].config;
    const { index } = this.state;
    deleteUploadImg(modules[index][modulesOrder[index]].config.imgPath)
      .then((resp) => {
        if (resp.data.message === 'Success!') {
          refresh();
          // 把删除的掉编号保存在store 中
          templateData.setComponentItems(name, index);
          // 清除数据
          templateData.deleteComponent(name, index);
        }
      }).catch((err) => {
        console.error(err)
      });
    this.toggle();
  };

  // 取消删除
  handleCancel = () => {
    this.toggle();
  };

  // 拖拽中
  myMove = (startIndex, endIndex) => {
    const { templateData, name, refresh } = this.props;
    refresh();
    templateData.componentItemsSort(
      name,
      startIndex,
      endIndex,
    )
  }

  /**
   * 控制弹出框
   * @param index 索引
   */
  toggle = (index) => {
    const { visible } = this.state;
    this.setState({
      index,
      visible: !visible,
    })
  };

  /**
   * 查找出当前对象中 没有被隐藏或者删除的对象
   * 返回 数值
   * @param {*} modules
   * @param {*} modulesOrder
   * @param {*} index
   */
  isOperation(modules, modulesOrder, index) {
    let isShowNumber = 0;
    for (let i = 0; i < modulesOrder.length; i += 1) {
      if (i === index) continue; // eslint-disable-line
      if (modules[i][modulesOrder[i]].config.isShow) {
        isShowNumber += 1;
      }
    }
    return isShowNumber;
  }

  render() {
    const { name, templateData, handleEdit } = this.props;
    const { visible } = this.state;
    const { section } = templateData;
    const { config } = section[name];
    const { modules, modulesOrder } = config;
    const icon = isTypeOf(name) ? 'scrollBanner-single' : 'displayPicture-single';
    return [
      modulesOrder.map((value, index) => {
        const { isShow, title } = modules[index][value].config;
        return (
          <Card
            key={value}
            index={index}
            id={value}
            isHidden={!isShow}
            myMove={this.myMove}
          >
            <ListView key={uuid()} index={value} styles={{ borderTop: 0, cursor: 'pointer' }}>
              <div
                className={classes.left}
                tabIndex={index}
                role="button"
                onClick={() => { handleEdit(value, index) }}
              >
                <span className={`${classes.icon} icon-${icon}`} />
                <span className={classes.text}>{title}</span>
              </div>
              <div className={classes.right}>
                <span
                  tabIndex={index}
                  role="button"
                  className={isShow ? 'icon-hidden' : 'icon-block'}
                  onClick={() => { this.handleIsHidden(value, index) }}
                />
                <span
                  className="icon-edit"
                  tabIndex={index}
                  role="button"
                  onClick={() => { handleEdit(value, index) }}
                />
                <span
                  className="icon-delete"
                  tabIndex={index}
                  role="button"
                  onClick={() => { this.handleDelete(index) }}
                />
                <span className="icon-drag" />
              </div>
            </ListView>
          </Card>
        )
      }),
      <Modal
        key={uuid()}
        title="Basic Modal"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <div>{promptMsg._delete}</div>
      </Modal>,
    ]
  }
}

DetailsListItem.wrappedComponent.propTypes = {
  name: PropTypes.string.isRequired,
  handleEdit: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default DetailsListItem
