import React from "react";
import styles from "./index.module.less";

class Price extends React.Component<{cost: number, discount: number}> {
  render() {
    const { cost, discount } = this.props;
    return (
      <div className={styles.whole}>
        {discount > 0 ? <div className={styles.former}>{cost}</div> : null}
        <div className={styles.now}>
          {discount > 0 ? (cost * (100 - discount) / 100).toFixed(0) : cost}
        </div>
      </div>
    );
  }
}

export default Price;
