import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
} from 'mobx-react';
import { Menu } from 'antd';

import { TemplateData } from '../../../store/index';
import { IMGUrl } from '../../../common/js/util';
import classes from './header.less';

/**
 * 处理 导航栏
 * @param {*} params
 */
function GetNavigation(params) {
  const { data } = params;
  const { SubMenu } = Menu;
  return (
    <Menu
      className={classes.bottom}
      mode="horizontal"
    >
      {
        data.map(v => (
          <SubMenu
            key={v.id}
            title={<span>{v.name}</span>}
          >
            {
              !v.children.length
                ? null
                : v.children.map(items => (
                  <Menu.Item disabled key={items.id}>{items.name}</Menu.Item>
                ))
            }
          </SubMenu>
        ))
      }
    </Menu>
  )
}


/**
 * 处理店主图像
 * @param {*} photo 图片路径
 */
function GetPhoto(param) {
  const logoIcon = [1, 2, 3];
  if (param.photo) {
    return (
      <span className={classes.photoWrapper}>
        <img src={IMGUrl + param.photo} alt="avart" />
      </span>
    )
  }
  return (
    <span className={`icon-default-portrait ${classes.iconPortrait}`}>
      {logoIcon.map(v => <span key={v} className={`path${v}`} />)}
    </span>
  )
}

/**
 * 处理店铺logo
 * @param {} param0
 */
function GetLogo({ logo, isMobile }) {
  if (logo) {
    return (
      <span className={isMobile ? classes.logoMobileWrapper : classes.logoWrapper}>
        <img src={IMGUrl + logo} alt="avart" />
      </span>
    )
  }

  return (
    <span className={isMobile ? classes.logoMobileDefault : classes.logoDefault}>
      <span className={`icon-logo ${isMobile ? classes.phoneIconLogo : classes.iconLogo}`} />
    </span>
  )
}

GetLogo.propTypes = {
  logo: PropTypes.string,
  isMobile: PropTypes.bool,
}

GetLogo.defaultProps = {
  isMobile: false,
  logo: null,
}

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

class Header extends React.Component {
  render() {
    const { templateData, headerDate } = this.props;
    const { storeInfo, storeMenus } = headerDate
    const isMobile = templateData.type === 'Phone';
    return (
      <div className={classes.container}>
        <div className={`${classes.wrapper} ${isMobile ? classes.phoneWrapper : ''}`}>
          <span className={`icon-logo ${classes.icon}`} />
          <span className={classes.headerRight} />
        </div>
        {
          isMobile
            ? (
              <div className={classes.phoneTop}>
                <GetLogo logo={storeInfo.logo} isMobile />
                <span className={classes.text}>{storeInfo.name}</span>
                <span className={classes.follow}>
                  <span className={`icon-subscribe ${classes.iconSubscribe}`} />
                  <span>Follow</span>
                </span>
              </div>
            )
            : (
              <div className={classes.top}>
                <GetLogo logo={storeInfo.logo} />
                <GetPhoto photo={storeInfo.business.photo} />
                <span className={classes.right}>
                  <span className={classes.text}>{storeInfo.name}</span>
                  <span className={classes.follow}>
                    <span className={`icon-subscribe ${classes.iconSubscribe}`} />
                    <span>Follow</span>
                  </span>
                </span>
              </div>
            )
        }
        {
          isMobile ? null : <GetNavigation data={storeMenus} />
        }
      </div>
    )
  }
}

Header.wrappedComponent.propTypes = {
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
  headerDate: PropTypes.object.isRequired,
};

export default Header;
