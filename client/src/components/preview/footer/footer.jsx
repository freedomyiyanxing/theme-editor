import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
} from 'mobx-react';

import { TemplateData } from '../../../store/index';
import classes from './footer.less';

const ARR = [1, 2, 3];

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

class Footer extends React.Component {
  render() {
    const { templateData, flooterData } = this.props;
    const isMobile = templateData.type === 'Phone';
    console.log(flooterData, 1)
    return (
      <div className={`${classes.container} ${isMobile ? classes.phone : ''}`}>
        {
          ARR.map(val => (
            <div key={val} className={`${isMobile ? classes.phoneItems : classes.footerItems}`}>
              <div className={classes.header}>
                <span />
              </div>
              <div className={classes.content}>
                {
                  ARR.map(v => (
                    <span className={classes.contentItems} key={v} />
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>
    )
  }
}

Footer.wrappedComponent.propTypes = {
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
  flooterData: PropTypes.object.isRequired,
};

export default Footer;
