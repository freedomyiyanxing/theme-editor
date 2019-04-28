import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { Collapse } from 'antd';
import {
  inject,
} from 'mobx-react';

import Section from '../../base/slidebar-section/section.jsx';
import SidebarHeader from '../../base/sidebar-header/sidebar-header.jsx';
import ListView from '../../base/list/list.jsx';
import { TemplateData } from '../../store/index';
import { displayPicture, slideImagesData } from '../../common/js/default-template-data.js';

import classes from './add-module.less';

const Btn = (props) => {
  const { click } = props;
  return (
    <span
      role="button"
      tabIndex={0}
      className={classes.btn}
      onClick={click}
    >
      Add
    </span>
  )
}
Btn.propTypes = {
  click: PropTypes.func.isRequired,
}


@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

export default class AddModule extends React.Component {
  callback = (key) => {
    let n = 0;
    if (key.length) {
      n = 180;
    }
    this.iconDropDown.style.transform = `rotate(${n}deg)`;
  };

  /**
   * 添加 display picture
   * @param index 当前选择的样式下标
   */
  handleAddPicture = (index) => {
    const name = `displayPicture${uuid().slice(0, 8)}`;
    this.addObj(name, index + 1)
  };

  /**
   * 添加 scrollBanner
   */
  handleAddScrollBanner = () => {
    const name = `scrollBanner${uuid().slice(0, 8)}`;
    this.addObj(name);
  };

  // 给stare 添加一个章节默认对象
  addObj(name, index) {
    this.isRefresh();
    const { templateData, history } = this.props;
    const { section } = templateData;
    let obj;
    if (index) {
      obj = {
        type: `images_${index}`,
        isHidden: false,
        config: slideImagesData[`images${index}`],
      }
    } else {
      obj = {
        type: 'slideshow',
        isHidden: false,
        config: slideImagesData.slideshow,
      };
    }
    templateData.saveTemplateData(obj, name); // 添加数据
    templateData.scrollEleWrapper.scrollTo(0, 0);
    // 进入详情页面
    window.sessionStorage.setItem('section', JSON.stringify(section))
    window.sessionStorage.setItem('details', name);
    history.push({ pathname: `${window.__get__url__base__}/addDetails/${window.__get__url__id}` })
  }

  // 做了操作时 启动禁止刷新 跟 删除
  isRefresh() {
    if (window.__IS__START__REFRESH__) {
      window.__stopRefresh__();
    }
  }

  render() {
    const { history } = this.props;
    const { Panel } = Collapse;
    return [
      <SidebarHeader key={uuid()} history={history}>
        Add Section
      </SidebarHeader>,
      <Section key={uuid()}>
        <ListView>
          <div className={classes.left}>
            <span className={`icon-scrollBanner ${classes.icon}`} />
            <span className={classes.text}>Scroll banner</span>
          </div>
          <Btn click={this.handleAddScrollBanner} />
        </ListView>
        <Collapse
          onChange={this.callback}
          bordered={false}
        >
          <Panel
            key="1"
            showArrow={false}
            header={[
              <span key="icon-displayPicture" className={classes.listLeft}>
                <span className={`icon-displayPicture ${classes.icon}`} />
                <span className={classes.text}>Display picture</span>
              </span>,
              <span
                key="icon-drop-down"
                className={`icon-drop-down ${classes.iconDropDown}`}
                ref={n => this.iconDropDown = n}
              />,
            ]}
          >
            <ul>
              {
                displayPicture.map((v, i) => (
                  <li key={uuid()} className={classes.display}>
                    <span className={classes.displayL}>
                      <div className={classes.displayS}>
                        <span className={`icon-style${i + 1}`} />
                      </div>
                      <span>Style {i + 1}</span>
                    </span>
                    <Btn click={() => { this.handleAddPicture(i) }} />
                  </li>
                ))
              }
            </ul>
          </Panel>
        </Collapse>
      </Section>,
    ]
  }
}

AddModule.wrappedComponent.propTypes = {
  history: PropTypes.object.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};
