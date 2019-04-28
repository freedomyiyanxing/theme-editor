import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import Section from '../../base/slidebar-section/section.jsx';
import ListView from '../../base/list/list.jsx';
import DragList from './drag-list.jsx';
import SidebarHeader from '../../base/sidebar-header/sidebar-header.jsx';
import { tabText } from '../../common/js/default-template-data';
import classes from './sidebar-list.less';

const styles = {
  marginBottom: 20,
  cursor: 'pointer',
  borderTop: 0,
}

class ListBar extends React.Component {
  state = {
    currentIndex: 0,
  }

  // handleClick = (i) => {
  //   this.lineClamp.style.transform = `translate3d(${i === 0 ? 0 : 175}px, 0px, 0px)`
  // };

  // 进入添加板块页面
  handleAdd = () => {
    const { history } = this.props;
    window.sessionStorage.setItem('module', 'module');
    history.push({ pathname: `${window.__get__url__base__}/addModule/${window.__get__url__id}` })
  }

  // 做了操作时 启动禁止刷新 跟 删除
  isRefresh() {
    if (window.__IS__START__REFRESH__) {
      window.__stopRefresh__();
    }
  }

  render() {
    const { history } = this.props;
    const { currentIndex } = this.state;
    return [
      <SidebarHeader key={uuid()} isReturn>
        {tabText.map((v, i) => (
          <span
            tabIndex={i}
            role="button"
            key={v}
            className={`${classes.link} ${currentIndex === i ? classes.active : ''}`}
            // onClick={() => { this.handleClick(i) }}
          >
            {v}
          </span>
        ))}
        <span className={classes.lineClamp} ref={n => this.lineClamp = n} />
      </SidebarHeader>,
      <Section key={uuid()}>
        <ListView>
          <span className={`icon-header ${classes.icon}`} />
          <span className={classes.text}>Header</span>
        </ListView>
        <div className={classes.wrapper}>
          <DragList isRefresh={this.isRefresh} history={history} />
        </div>
        <ListView click={this.handleAdd} styles={styles}>
          <span className={`icon-add ${classes.icon} ${classes.iconColor}`} />
          <span className={`${classes.text} ${classes.bold}`}>Add Section</span>
        </ListView>
        <ListView>
          <span className={`icon-footer ${classes.icon}`} />
          <span className={classes.text}>Footer</span>
        </ListView>
      </Section>,
    ]
  }
}

ListBar.propTypes = {
  history: PropTypes.object.isRequired,
};

export default ListBar
