import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { Modal } from 'antd';
import update from 'immutability-helper';
import {
  inject,
  observer,
} from 'mobx-react';

import ListView from '../../base/list/list.jsx';
import Card from '../../base/drag/cards.jsx';
import { TemplateData } from '../../store/index';
import { chapterType, iconName } from '../../common/js/util';
import { post } from '../../api/http';
import { promptDelete } from '../../common/js/prompt-message';

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

  // 开始拖动
  myBeginDrag = (startIndex) => {
    const { templateData } = this.props;
    templateData.handleDropStart('start')
    this.startIndex = startIndex;
  };

  // 拖动过程中 (每次拖过一个元素时触发)
  myMove = (dragIndex, hoverIndex) => {
    const { templateData } = this.props;
    const { section } = templateData;
    const { sectionsOrder } = section;
    const dragCard = sectionsOrder[dragIndex];
    templateData.handleDropUpScroll(
      update(sectionsOrder, {
        $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
      }),
      hoverIndex,
      this.startIndex,
      dragIndex > hoverIndex, // 判断上托还是下托
    );
  };

  // 拖动结束 (鼠标放手时)
  myEndDrag = (index) => {
    const { templateData, isRefresh } = this.props;
    isRefresh();
    templateData.handleDropScroll(
      'end',
      index,
      this.startIndex,
      this.startIndex > index, // 判断上托还是下托
    )
  };

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
    const url = '/business/store_themes/deleteThemeImage';
    post(url, { imgUrl: img })
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
    const { visible, name } = this.state;
    return [
      section.sectionsOrder.map((value, index) => {
        const { config, isHidden } = section[value]
        return (
          <Card
            key={value}
            index={index}
            id={value}
            isHidden={isHidden}
            myMove={this.myMove}
            myBeginDrag={this.myBeginDrag}
            myEndDrag={this.myEndDrag}
          >
            <ListView styles={{ borderTop: 0, cursor: 'pointer' }}>
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
        <div>{promptDelete(name === 'scrollBanner')}</div>
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
