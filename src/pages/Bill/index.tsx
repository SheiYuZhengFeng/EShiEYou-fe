import React from "react";
import styles from "./index.module.less";
import Combiner from "../../components/Combiner";
import { BillState } from "../../reducers/BillReducer";
import store from "../../store";
import { updateAll } from "../../controller/BillController";
import { STUDENT } from "../../components/UserDescriptions";
import { Empty, Spin } from "antd";
import { convertMoney } from "../../utils/money";

class Bill extends React.Component<any, BillState> {
  constructor(props: any) {
    super(props);
    this.state = {...store.getState().BillReducer};
  }
  ss = store.subscribe(() => {
    this.setState({...store.getState().BillReducer});
  });
  componentWillMount() {
    updateAll();
  }
  componentWillUnmount() {
    this.ss();
  }
  render() {
    const { balance } = this.state;
    return Combiner(
      <div className={styles.container}>
        <div className={styles.whole}>
          <div className={styles.balance}>
            <div className={styles.title}>
              你的{store.getState().UserReducer.session.category === STUDENT ? "余额" : "佣金"}
            </div>
            <div className={styles.number}>
              {balance.status === -1 ?
                <Empty description="拉取失败" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              :
              balance.status === 0 ?
                <Spin />
              :
                convertMoney(balance.data)
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Bill;
