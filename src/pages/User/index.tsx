import React from 'react';
import styles from './index.module.less';
import Combiner from '../../components/Combiner';

class User extends React.Component {
  render() {
    return Combiner(
      <div className={styles.container}>
        用户
      </div>
    );
  }
}

export default User;
