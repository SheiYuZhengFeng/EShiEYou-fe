import React from 'react';
import styles from './App.module.less';
import Router from './router';

const App = () => {
  console.log(styles);
  return (
    <div className={styles.whole}>
      <Router />
    </div>
  );
}

export default App;
