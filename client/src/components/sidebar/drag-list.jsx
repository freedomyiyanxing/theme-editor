/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
} from 'mobx-react';

import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import ListItem from './list-item.jsx';
import { TemplateData } from '../../store/index';

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

class DragList extends React.Component {
  onDragStart = (result) => {
    const { templateData } = this.props;
    const { source } = result;
    this.index = source.index;
    // console.log(this.getIndex(this.index));
    templateData.handleDropStart(this.index)
  };

  onDragUpdate = (result) => {
    const { templateData } = this.props;
    const { destination } = result;
    if (destination == null) {
      return;
    }
    console.log(this.getIndex(destination.index), '我是过滤了的数字', destination.index);
    // const __index = this.getIndex(destination.index)
    templateData.handleDropUpScroll(this.index, destination.index, destination.index);
    this.index = destination.index;
  };

  onDragEnd = (result) => {
    const { templateData, isRefresh } = this.props;
    const { source, destination } = result;
    // 当拖动元素 越界时, 重置回上一次的位置
    if (destination == null) {
      templateData.handleDropErrOr(source.index);
      return;
    }
    // 如果相等则表示没有拖动
    if (source.index === destination.index) {
      templateData.handleDropClass('end');
      return;
    }
    isRefresh();
    templateData.handleDropScroll(source.index, destination.index);
  };

  getIndex(index) {
    const { templateData } = this.props;
    const { section } = templateData;
    console.log(index, 'index- 2')
    const arr1 = Array.from({ length: index });
    for (let i = 0; i < arr1.length; i += 1) {
      const name = section.sectionsOrder[i];
      console.log(section[name].isHidden)
      if (section[name].isHidden) {
        index -= 1;
      }
    }
    console.log(index, 'index-')
    return index;
  }

  // 点击进入详情事件(add-details)
  handleEdit = (value, index) => {
    // 只有 picture 和 banner 才允许 修改, 其他暂时屏蔽掉
    if (!(value.startsWith('displayPicture') || value.startsWith('scrollBanner'))) return;
    const { templateData, history } = this.props;
    // 回到滚动位置
    templateData.utilScroll(templateData.utilScrollVal(index));
    window.sessionStorage.setItem('details', value);
    history.push({ pathname: `/addDetails/${window.__get__url__id}` })
  };

  render() {
    const { isRefresh } = this.props;
    return (
      <DragDropContext
        onDragEnd={this.onDragEnd}
        onDragStart={this.onDragStart}
        onDragUpdate={this.onDragUpdate}
      >
        <Droppable droppableId="droppable">
          {
            provideds => (
              <div
                {...provideds.droppableProps}
                ref={provideds.innerRef}
              >
                <ListItem isRefresh={isRefresh} handleEdit={this.handleEdit} />
                {provideds.placeholder}
              </div>
            )
          }
        </Droppable>
      </DragDropContext>
    )
  }
}

DragList.wrappedComponent.propTypes = {
  history: PropTypes.object.isRequired,
  isRefresh: PropTypes.func.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default DragList
