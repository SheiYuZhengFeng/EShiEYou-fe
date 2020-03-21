import React from "react";
import styles from "./index.module.less";
import Combiner from "../../components/Combiner";
import { BillState } from "../../reducers/BillReducer";
import store from "../../store";
import { updateAll } from "../../controller/BillController";
import { STUDENT } from "../../components/UserDescriptions";
import { Empty, Spin, Icon, Tooltip } from "antd";
import { convertMoney, signedMoney } from "../../utils/money";
import { unixToString } from "../../utils/datetime";
import QueueAnim from "rc-queue-anim";

const getStatusIcon = (status: number) => {
  switch(status){
    case -1: return "close";
    case 0: return "clock-circle";
    default: return "check";
  }
}

const getStatusColor = (status: number) => {
  switch(status){
    case -1: return styles.closed;
    case 0: return styles.waiting;
    default: return styles.ok;
  }
}

const typeDesc = ["充值", "提现", "消费", "扣除保证金", "返还保证金", "收入", "补偿"];

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
    const { balance, bills } = this.state;
    return Combiner(
      <div className={styles.container}>
        <QueueAnim className={styles.whole} animConfig={[{translateY: [0, 30], opacity: [1, 0]}]}>
          <div key="balance" className={styles.balance}>
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
          <div key="bills" className={styles.bills}>
            {bills.status === -1 ?
              <Empty description="拉取失败" />
            : bills.status === 0 ?
              <Spin size="large" />
            : bills.data.map((v, i) => (
              <Tooltip key={i} title={v.content} className={styles.bill + " " + getStatusColor(v.status)}>
                <div className={styles.moneytypestatus}>
                  <div className={styles.money}>{signedMoney(v.money)}</div>
                  <div className={styles.typestatus}>
                    <div className={styles.status}>
                      <Icon type={getStatusIcon(v.status)} />
                    </div>
                    <div className={styles.type}>{typeDesc[v.type]}</div>
                  </div>
                </div>
                <div className={styles.time}>{unixToString(v.createtime)}</div>
              </Tooltip>
            ))}
          </div>
        </QueueAnim>
      </div>
    );
  }
}

export default Bill;
