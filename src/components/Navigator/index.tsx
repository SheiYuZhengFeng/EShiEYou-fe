import React from 'react';
import styles from './index.module.less';
import NavigatorButton from './NavigatorButton';

class Navigator extends React.Component {
  render() {
    return (
      <div className={styles.box}>
        <NavigatorButton href='/' title='主页' type='home' />
      </div>
    );
  }
}

export default Navigator;
