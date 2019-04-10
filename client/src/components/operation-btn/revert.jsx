import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';

class xxxx extends React.Component {
  render () {
    const {classes} = this.props;
    return (
      <div className={classes.revertContent}>
        <div className={classes.revertHeader}>
          <span className={classes.revertFirst} />
          <span>Version</span>
          <span>Publish Date</span>
          <span>Remarks</span>
        </div>
        <RadioGroup name="radiogroup" onChange={selector}>
          {
            data.map((v, i) => (
              <Radio
                key={v.id}
                value={i}
                tabIndex={i}
                role="button"
                className={classes.revertItem}
              >
                <span className={classes.revertFirst}>1</span>
                {v.remark}
              </Radio>
            ))
          }
        </RadioGroup>
      </div>
    )
  }
}

xxx.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(xxxStyle)(xxx)
