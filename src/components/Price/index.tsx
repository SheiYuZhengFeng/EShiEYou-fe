import React from "react";
import styles from "./index.module.less";
import { Icon } from "antd";
import { calcPrice } from "../../utils/money";

class Price extends React.Component<{cost: number, discount: number, extra?: boolean}> {
  render() {
    const { cost, discount, extra } = this.props;
    return (
      <div className={styles.whole}>
        {extra ? <div className={styles.discount}><Icon type="arrow-down" />{(100 - discount)}%</div> : null}
        {discount < 100 ? <div className={styles.former}>{calcPrice(cost, 100)}</div> : null}
        <div className={styles.now}>{calcPrice(cost, discount)}</div>
        {extra ? <div className={styles.yuan}>元</div> : null}
      </div>
    );
  }
}

export default Price;
