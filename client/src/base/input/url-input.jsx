import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import classes from './input.less'

export default class UrlInput extends React.Component {
  constructor(props) {
    super(props);
    const { defaultVal } = this.props;
    this.state = {
      value: defaultVal,
    }
  }

  handleChange = (e) => {
    const { click } = this.props;
    this.setState({
      value: e.target.value,
    });
    click(e.target.value)
  };

  render() {
    const { value } = this.state;
    return (
      <div className={classes.container}>
        <span className={classes.title}>Destination URL :</span>
        <Input
          addonBefore="https://"
          onChange={this.handleChange}
          value={value}
          placeholder="url"
        />
      </div>
    )
  }
}

UrlInput.propTypes = {
  click: PropTypes.func.isRequired,
  defaultVal: PropTypes.string,
};

UrlInput.defaultProps = {
  defaultVal: null,
};
