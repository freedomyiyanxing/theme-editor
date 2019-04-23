import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import {
  inject,
  observer,
} from 'mobx-react';
import { notification, Modal } from 'antd';
import { Draggable } from 'react-beautiful-dnd'
import ListView from '../../base/list/list.jsx';
import { TemplateData } from '../../store/index';
import { isTypeOf, getNumber } from '../../common/js/util';
import { deleteUploadImg } from '../../api/http';
import { promptImgFormat, promptMsg } from '../../common/js/prompt-message'

import classes from '../../common/less/list-item.less';

// 限制删除
const LimitNumber = {
  images_1: 1, // picture 中的 style-1 最少一个
  images_2: 5, // picture 中的 style-2 最少五个
  images_3: 5, // picture 中的 style-3 最少五个
  images_4: 5, // picture 中的 style-4 最少五个
  images_5: 2, // picture 中的 style-5 最少四个
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
      duration: 5,
      placement: 'topLeft',
    });
  };

  // 删除
  handleDelete = (index) => {
    const { templateData, name, refresh } = this.props;
    const { modules, modulesOrder } = templateData.section[name].config;
    const { type } = templateData.section[name];
    if (modulesOrder.length > LimitNumber[type]) {
      // 判断 如果有 图片 则 弹出提示框;
      if (modules[index][modulesOrder[index]].config.imgPath) {
        this.toggle(index);
      } else {
        refresh();
        // 把删除的掉编号保存在store 中
        templateData.setComponentItems(name, getNumber(modulesOrder[index]));
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
    refresh();
    templateData.setComponentIsHidden(name, val, index)
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
          templateData.setComponentItems(name, getNumber(modulesOrder[index]));
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

  render() {
    const { name, templateData, handleEdit } = this.props;
    const { visible } = this.state;
    const { section } = templateData;
    const { config } = section[name];
    const { modules, modulesOrder } = config;
    const icon = isTypeOf(name) ? 'scrollBanner-single' : 'displayPicture-single';
    return [
      modulesOrder.map((v, i) => {
        const { isShow, title } = modules[i][v].config;
        return (
          <Draggable key={v} draggableId={v} index={i}>
            {
              provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <ListView key={uuid()} index={v} styles={{ borderTop: 0 }}>
                    <div
                      className={classes.left}
                      tabIndex={i}
                      role="button"
                      onClick={() => { handleEdit(v, i) }}
                    >
                      <span className={`${classes.icon} icon-${icon}`} />
                      <span className={classes.text}>
                        {title}
                      </span>
                    </div>
                    <div className={classes.right}>
                      <span
                        tabIndex={i}
                        role="button"
                        className={isShow ? 'icon-hidden' : 'icon-block'}
                        onClick={() => { this.handleIsHidden(v, i) }}
                      />
                      <span
                        className="icon-edit"
                        tabIndex={i}
                        role="button"
                        onClick={() => { handleEdit(v, i) }}
                      />
                      <span
                        className="icon-delete"
                        tabIndex={i}
                        role="button"
                        onClick={() => { this.handleDelete(i) }}
                      />
                      <span className="icon-drag" />
                    </div>
                  </ListView>
                </div>
              )
            }
          </Draggable>
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
