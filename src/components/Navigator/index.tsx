import React from 'react';
import styles from './index.module.less';
import NavigatorButton from './NavigatorButton';

class Navigator extends React.Component {
  render() {
    return (
      <div className={`${styles.box} ${styles.whole}`}>
        <NavigatorButton href='/' title='主页' type='home' />
        <NavigatorButton href='/course' title='课程' type='book' />
        <NavigatorButton href='/order' title='预约' type='bulb' />
        <NavigatorButton href='/mail' title='私信' type='message' />
        <NavigatorButton href='/user' title='个人' type='user' />
      </div>
    );
  }
}

export default Navigator;
