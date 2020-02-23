import React from 'react';
import styles from './index.module.less';
import Combiner from '../../components/Combiner';

class Mail extends React.Component {
  render() {
    return Combiner(
      <div className={styles.container}>
        私信
      </div>
    );
  }
}

export default Mail;
