import React from 'react';
import styles from './index.module.less';
import Combiner from '../../components/Combiner';

class Order extends React.Component {
  render() {
    return Combiner(
      <div className={styles.container}>
        预约
      </div>
    );
  }
}

export default Order;
