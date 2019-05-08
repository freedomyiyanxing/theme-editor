import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
} from 'mobx-react';

import { TemplateData } from '../../../store/index';
import classes from './footer.less';

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

class Footer extends React.Component {
  render() {
    const { templateData, flooterData } = this.props;
    const { leftNavigation, middleNavigation } = flooterData;
    const isMobile = templateData.type === 'Phone';
    return (
      <div className={`${classes.container} ${isMobile && classes.phoneConatiner}`}>
        {
          isMobile
            ? (
              <div className={classes.phoneConrent}>
                <span>ABOUT iNFLUMONSTER</span>
                <span>CUSTOMER SERVICE</span>
                <span>CUSTOMER SERVICE</span>
              </div>
            )
            : (
              <div className={classes.wrapper}>
                <div>
                  <div className={classes.header}>
                    <span>ABOUT INFLUMONSTER</span>
                  </div>
                  <div className={classes.content}>
                    {
                      leftNavigation.map(v => (
                        <span key={v.id}>{v.name}</span>
                      ))
                    }
                  </div>
                </div>
                <div>
                  <div className={classes.header}>
                    <span>CUSTOMER SERVICE</span>
                  </div>
                  <div className={classes.content}>
                    {
                      middleNavigation.map(v => (
                        <span key={v.id}>{v.name}</span>
                      ))
                    }
                  </div>
                </div>
                <div>
                  <div className={classes.header}>
                    <span>FOLLOW INFLUMONSTER</span>
                  </div>
                  <div className={classes.iconWrapper}>
                    <span className="icon-tuite" />
                    <span className="icon-facebook" />
                    <span className="icon-interest" />
                    <span className="icon-instagram" />
                  </div>
                </div>
              </div>
            )
        }
        <div className={`${classes.footer} ${isMobile && classes.phoneFotter}`}>
          <p>©Copyright 2016 - 2019 InfluDigital Corporation.</p>
          <p> All Rights Reserved.</p>
        </div>
      </div>
    )
  }
}

Footer.wrappedComponent.propTypes = {
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
  flooterData: PropTypes.object.isRequired,
};

export default Footer;
