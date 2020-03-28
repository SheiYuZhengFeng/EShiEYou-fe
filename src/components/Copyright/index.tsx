import React from 'react';
import styles from './index.module.less';
import intl from "react-intl-universal";

class Copyright extends React.Component {
  render() {
    return (
      <div className={styles.container + ' ' + styles.whole}>
        <p>{intl.get("copyright_intro")}</p>
        <p>{intl.get("copyright_main")}</p>
      </div>
    );
  }
}

export default Copyright;
