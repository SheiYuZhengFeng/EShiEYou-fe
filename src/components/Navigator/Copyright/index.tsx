import React from 'react';
import styles from './index.module.less';

class Copyright extends React.Component {
  render() {
    return (
      <div className={styles.container + ' ' + styles.whole}>
        <p>E师亦友平台，是南京大学“谁语争锋”团队创建的专注职业小语种学习的在线学习平台。</p>
        <p>©2020-2020 谁语争锋团队 版权所有</p>
      </div>
    );
  }
}

export default Copyright;
