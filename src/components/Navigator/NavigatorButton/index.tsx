import React from 'react';
import styles from './index.module.less';
import { Icon, Tooltip } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { NavLink } from 'react-router-dom';

class NavigatorButton extends React.Component<{href: string, title: string, type: string, wrap?: boolean, onClick?: () => void} & RouteComponentProps> {
  
  render() {
    let wholeClass = styles.whole;
    if (this.props.location.pathname.startsWith(this.props.href.toString()) && !(this.props.href.toString() === "/" && this.props.location.pathname !== "/")) {
      wholeClass += " " + styles.active;
    }
    return (
      <NavLink to={this.props.href} onClick={(e: React.MouseEvent) => { if (this.props.onClick) { e.stopPropagation(); e.preventDefault(); this.props.onClick(); } }}>
        {this.props.wrap ? 
          <Tooltip title={this.props.title} placement="top">
            <div className={wholeClass}>
              <Icon className={styles.icon} type={this.props.type} />
            </div>
          </Tooltip>
        : 
          <div className={wholeClass}>
            <Icon className={styles.icon} type={this.props.type} />
            <p className={styles.title}>{this.props.title}</p>
          </div>
        }
      </NavLink>
    );
  }
}

export default withRouter(NavigatorButton);
