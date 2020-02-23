import React from 'react';
import styles from './index.module.less';
import Combiner from '../../components/Combiner';

class Main extends React.Component {
  render() {
    return Combiner(
      <div className={styles.container}>
        Main
      </div>
    );
  }
}

export default Main;
