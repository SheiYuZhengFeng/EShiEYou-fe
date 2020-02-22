import React from 'react';
import styles from './index.module.less';
import { Tooltip, Icon } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { NavLink } from 'react-router-dom';

class NavigatorButton extends React.Component<{href: string, title: string, type: string} & RouteComponentProps> {
  
  render() {
    let iconClass = styles.icon;
    if (this.props.location.pathname.indexOf(this.props.href.toString()) !== -1 && !(this.props.href.toString() === "/" && this.props.location.pathname !== "/")) {
      iconClass += " " + styles.activeIcon;
    }
    return (
      <NavLink to={this.props.href}>
        <div className={styles.whole}>
          <Tooltip title={this.props.title} placement={"top"}>
            <Icon className={iconClass} type={this.props.type} />
          </Tooltip>
        </div>
      </NavLink>
    );
  }
}

export default withRouter(NavigatorButton);
