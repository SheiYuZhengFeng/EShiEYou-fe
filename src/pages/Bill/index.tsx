import React from "react";
import styles from "./index.module.less";
import Combiner from "../../components/Combiner";

class Bill extends React.Component {
  render() {
    return Combiner(
      <div className={styles.container}>
        <div className={styles.whole}>
          账单 / 佣金
        </div>
      </div>
    );
  }
}

export default Bill;
