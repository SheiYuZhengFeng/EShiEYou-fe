import React from 'react';
import styles from './index.module.less';
import Navigator from '../../components/Navigator';

class Main extends React.Component {
  render() {
    return (
      <>
        <Navigator />
        <div className={styles.container}>
          Main
        </div>
      </>
    );
  }
}

export default Main;
