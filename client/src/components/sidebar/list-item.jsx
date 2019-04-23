import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { Modal } from 'antd';
import { Draggable } from 'react-beautiful-dnd';
import {
  inject,
  observer,
} from 'mobx-react';

import ListView from '../../base/list/list.jsx';
import { TemplateData } from '../../store/index';
import { chapterType, iconName } from '../../common/js/util';
import { deleteUploadImg } from '../../api/http';
import { promptMsg } from '../../common/js/prompt-message';

import classes from '../../common/less/list-item.less';

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

@observer class ListItem extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      img: null,
      name: '',
      index: null,
    }
  }

  // 区块 隐藏 显示 点击事件
  handleIsHidden = (value, index) => {
    const { templateData, isRefresh } = this.props;
    isRefresh();
    templateData.setIsHidden(value, index);
  };

  // 区块 删除功能 点击事件
  handleDelete = (name, index) => {
    const { templateData, isRefresh } = this.props;
    isRefresh();
    const { modules, modulesOrder } = templateData.section[name].config;
    const img = []; // 保存着 图片路径 方便删除
    for (let i = 0; i < modulesOrder.length; i += 1) {
      const { config } = modules[i][modulesOrder[i]];
      if (config.imgPath) {
        img.push(config.imgPath);
      }
    }
    // 判断时候 当前数据下面 是否有图片
    if (img.length) {
      this.toggle(img, name, index)
    } else {
      templateData.deleteChapters(name, index);
    }
  };

  // 确定删除
  handleOk = () => {
    const { templateData } = this.props;
    const { img, name, index } = this.state;
    deleteUploadImg(img)
      .then((resp) => {
        if (resp.data.message === 'Success!') {
          templateData.deleteChapters(name, index)
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

  // 控制弹出框
  toggle = (img, name, index) => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
      img,
      name,
      index,
    })
  };

  render() {
    const { templateData, handleEdit } = this.props;
    const { section } = templateData;
    const { visible } = this.state;
    return [
      section.sectionsOrder.map((value, index) => {
        const { config, isHidden } = section[value]
        return (
          <Draggable key={value} draggableId={value} index={index}>
            {
              provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <ListView styles={{ borderTop: 0 }}>
                    <div
                      className={classes.left}
                      tabIndex={index}
                      role="button"
                      onClick={() => { handleEdit(value, index) }}
                    >
                      <span className={`${classes.icon} icon-${iconName(value)}`} />
                      <span className={classes.text}>{config.title}</span>
                    </div>
                    <div className={classes.right}>
                      <span
                        tabIndex={0}
                        role="button"
                        onClick={() => { this.handleIsHidden(value, index) }}
                        className={isHidden ? 'icon-block' : 'icon-hidden'}
                      />
                      {
                        chapterType(value)
                          ? (
                            <span
                              className="icon-edit"
                              tabIndex={index}
                              role="button"
                              onClick={() => { handleEdit(value, index) }}
                            />
                          )
                          : null
                      }
                      {
                        chapterType(value)
                          ? (
                            <span
                              className="icon-delete"
                              tabIndex={0}
                              role="button"
                              onClick={() => { this.handleDelete(value, index) }}
                            />
                          )
                          : null
                      }
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

ListItem.wrappedComponent.propTypes = {
  isRefresh: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};


export default ListItem
