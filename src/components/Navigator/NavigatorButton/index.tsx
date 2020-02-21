import React from 'react';
import styles from './index.module.less';
import { Tooltip, Icon } from 'antd';

class NavigatorButton extends React.Component<{href: string, title: string, type: string}> {
  render() {
    return (
      <div className={styles.whole}>
        <Tooltip title={this.props.title} placement={"bottom"}>
            <Icon type={this.props.type} theme="filled" />
        </Tooltip>
      </div>
    );
  }
}

export default NavigatorButton;
