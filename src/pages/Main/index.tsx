import React from 'react';
import styles from './index.module.less';
import Navigator from '../../components/Navigator';
import Copyright from '../../components/Navigator/Copyright';

class Main extends React.Component {
  render() {
    return (
      <>
        <Navigator />
        <div className={styles.container}>
          Main
        </div>
        <Copyright />
      </>
    );
  }
}

export default Main;
