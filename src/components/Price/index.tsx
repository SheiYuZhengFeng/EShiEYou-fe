import React from "react";
import styles from "./index.module.less";
import { Icon } from "antd";

export const calcPrice = (cost: number, discount: number) : number => {
  return Math.floor(cost * (100 - discount) / 100);
}

class Price extends React.Component<{cost: number, discount: number, extra?: boolean}> {
  render() {
    const { cost, discount, extra } = this.props;
    return (
      <div className={styles.whole}>
        {extra ? <div className={styles.discount}><Icon type="arrow-down" />{discount}%</div> : null}
        {discount > 0 ? <div className={styles.former}>{cost}</div> : null}
        <div className={styles.now}>{calcPrice(cost, discount)}</div>
        {extra ? <div className={styles.yuan}>元</div> : null}
      </div>
    );
  }
}

export default Price;
