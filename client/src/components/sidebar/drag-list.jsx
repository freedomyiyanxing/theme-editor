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
    templateData.handleDropStart(this.index)
  };

  onDragUpdate = (result) => {
    const { templateData } = this.props;
    const { destination } = result;
    if (destination == null) {
      return;
    }
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

  // 区块 修改功能 点击事件
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
