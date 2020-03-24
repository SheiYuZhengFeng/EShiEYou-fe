import React from "react";
import styles from "./index.module.less";
import Combiner from "../../components/Combiner";
import { BillState } from "../../reducers/BillReducer";
import store from "../../store";
import { updateAll } from "../../controller/BillController";
import { STUDENT } from "../../components/UserDescriptions";
import { Empty, Spin, Icon, Tooltip, Button, message, Modal } from "antd";
import { convertMoney, signedMoney } from "../../utils/money";
import { unixToString } from "../../utils/datetime";
import QueueAnim from "rc-queue-anim";
import ShowModalInput from "../../components/ModalInput";
import GeneralAPI from "../../services/GeneralAPI";

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
  handlePay = () => {
    ShowModalInput("请输入充值金额（整数，单位：元）", (text) => {
      try {
        let money = Number(text);
        if (isNaN(money)) throw new Error("请输入数字！");
        if (money <= 0) throw new Error("请输入正数！");
        if (money % 1 !== 0) throw new Error("请输入整数！");
        money *= 100;
        GeneralAPI.bill.pay({money}).then(res => {
          if (res.code === 0) {
            Modal.confirm({
              title: "请扫码完成支付",
              content: <img src={res.data.qrcode} alt="支付二维码" />,
              maskClosable: false,
              okText: "已支付完成",
              cancelText: "取消支付",
            });
          }
          else {
            message.error("获取充值二维码失败！");
          }
        });
      }
      catch(e) {
        message.error((e as Error).message);
      }
    });
  }
  handleGet = () => {
    ShowModalInput("请输入提现金额（最多两位小数，单位：元）", (text) => {
      try {
        let money = Number(text);
        if (isNaN(money)) throw new Error("请输入数字！");
        if (money <= 0) throw new Error("请输入正数！");
        money *= 100;
        if (money % 1 !== 0) throw new Error("小数最多两位！");
        if (money > this.state.balance.data) throw new Error("你没有那么多余额哦！");
        GeneralAPI.bill.get({money}).then(res => {
          if (res.code === 0) {
            message.success("提现申请成功！");
          }
          else {
            message.error("提现申请失败！");
          }
        });
      }
      catch(e) {
        message.error((e as Error).message);
      }
    });
  }
  render() {
    const { balance, bills } = this.state;
    return Combiner(
      <div className={styles.container}>
        <QueueAnim className={styles.whole} animConfig={[{translateY: [0, 30], opacity: [1, 0]}]}>
          <div key="balancecontrol" className={styles.balancecontrol}>
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
            {balance.status === 1 ?
              <div className={styles.control}>
                <Button onClick={this.handlePay}>充值</Button>
                <Button onClick={this.handleGet}>提现</Button>
              </div>
            : null}
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
