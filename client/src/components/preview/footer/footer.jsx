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
    const { templateData } = this.props;
    const isMobile = templateData.type === 'Phone';
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
};

export default Footer;
