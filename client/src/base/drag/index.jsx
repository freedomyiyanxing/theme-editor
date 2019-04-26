import React from 'react';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

/**
 * 高阶组件
 * @param Example 接受一个组件
 * @returns {Hoc} 返回一个新的组件
 * @constructor
 */
const DragIndex = (Example) => {
  return class Hoc extends React.Component {
    render() {
      return (
        <DragDropContextProvider backend={HTML5Backend}>
          <Example {...this.props} />
        </DragDropContextProvider>
      )
    }
  }
}

export default DragIndex
