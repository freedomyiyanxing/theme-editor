/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
} from 'mobx-react';
// import update from 'immutability-helper';

// import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import DragIndex from '../../base/drag/index.jsx';

import ListItem from './list-item.jsx';
import { TemplateData } from '../../store/index';

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

@DragIndex
class DragList extends React.Component {
  // constructor (){
  //   super();
  // }
  //
  // onDragStart = (result) => {
  //   const { templateData } = this.props;
  //   const { source } = result;
  //   this.index = source.index;
  //   templateData.handleDropStart()
  // };
  //
  // onDragUpdate = (result) => {
  //   const { templateData } = this.props;
  //   const { sectionsOrder } = templateData.section;
  //   const { destination, source } = result;
  //   if (destination == null) {
  //     return;
  //   }
  //   console.log(destination.index, ' <---> ', source.index)
  //   templateData.handleDropUpScroll(
  //     update(sectionsOrder, {
  //       $splice: [[this.index, 1], [destination.index, 0, sectionsOrder[this.index]]],
  //     }),
  //     this.index, // 上次拖拽的位置
  //     source.index, // 拖拽的起始位置
  //   );
  //   this.index = destination.index;
  // };
  //
  // onDragEnd = (result) => {
  //   const { templateData, isRefresh } = this.props;
  //   const { source, destination } = result;
  //   console.log('。。。。。。。。。。')
  //   // 当拖动元素 越界时, 重置回上一次的位置
  //   if (destination == null) {
  //     console.log('我越界了吗....', source.index, this.index)
  //     templateData.handleDropErrOr(source.index);
  //     return;
  //   }
  //   // 如果相等则表示没有拖动
  //   if (source.index === destination.index) {
  //     templateData.handleDropClass('end');
  //     return;
  //   }
  //   isRefresh();
  //   templateData.handleDropScroll('end', this.index, source.index);
  // };

  // getIndex(index, current) {
  //   const { templateData } = this.props;
  //   const { section } = templateData;
  //   const arr1 = Array.from({ length: index });
  //   for (let i = current || 0; i < arr1.length; i += 1) {
  //     const name = section.sectionsOrder[i];
  //     if (section[name].isHidden) {
  //       index -= 1;
  //     }
  //   }
  //   return index;
  // }

  // 点击进入详情事件(add-details)
  handleEdit = (value, index) => {
    // 只有 picture 和 banner 才允许 修改, 其他暂时屏蔽掉
    if (!(value.startsWith('displayPicture') || value.startsWith('scrollBanner'))) return;
    const { templateData, history } = this.props;
    // 回到滚动位置
    // templateData.utilScroll(templateData.utilScrollVal(index));
    window.sessionStorage.setItem('details', value);
    history.push({ pathname: `/addDetails/${window.__get__url__id}` })
  };

  render() {
    const { isRefresh } = this.props;

    return <ListItem isRefresh={isRefresh} handleEdit={this.handleEdit} />
    // return (
    //   <DragDropContext
    //     onDragEnd={this.onDragEnd}
    //     onDragStart={this.onDragStart}
    //     onDragUpdate={this.onDragUpdate}
    //   >
    //     <Droppable droppableId="droppable">
    //       {
    //         provideds => (
    //           <div
    //             {...provideds.droppableProps}
    //             ref={provideds.innerRef}
    //           >
    //             <ListItem isRefresh={isRefresh} handleEdit={this.handleEdit} />
    //             {provideds.placeholder}
    //           </div>
    //         )
    //       }
    //     </Droppable>
    //   </DragDropContext>
    // )
  }
}

DragList.wrappedComponent.propTypes = {
  history: PropTypes.object.isRequired,
  isRefresh: PropTypes.func.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default DragList
