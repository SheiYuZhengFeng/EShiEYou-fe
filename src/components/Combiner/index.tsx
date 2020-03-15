import React from 'react';
import styles from './index.module.less';
import Navigator from '../Navigator';
import Copyright from '../Copyright';

const Combiner = (component: JSX.Element) => {
  return (
    <div className={styles.whole}>
      <Navigator />
      {component}
      <Copyright />
    </div>
  );
}

export default Combiner;
