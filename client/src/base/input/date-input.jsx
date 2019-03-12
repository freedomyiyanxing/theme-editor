import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import classes from './input.less'

export default class DateInput extends React.Component {
  render() {
    const {
      title, current, onOk, onChange,
    } = this.props;
    return (
      <div className={classes.container}>
        <span className={classes.title}>{title} :</span>
        <DatePicker
          format="YYYY-MM-DD  HH:mm:ss"
          style={{ width: '100%' }}
          showTime
          defaultValue={moment(current)}
          placeholder="Select Time"
          onOk={onOk}
          onChange={onChange}
        />
      </div>
    )
  }
}

DateInput.propTypes = {
  onOk: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  current: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};
