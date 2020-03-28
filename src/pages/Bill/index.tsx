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
import intl from "react-intl-universal";

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

class Bill extends React.Component<any, BillState> {
  typeDesc = [intl.get("bill_type_pay"), intl.get("bill_type_get"), intl.get("bill_type_consume"), intl.get("bill_type_deduct"), intl.get("bill_type_back"), intl.get("bill_type_income"), intl.get("bill_type_redress")];
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
    ShowModalInput(intl.get("input_pay_title"), (text) => {
      try {
        let money = Number(text);
        if (isNaN(money)) throw new Error(intl.get("input_error_number"));
        if (money <= 0) throw new Error(intl.get("input_error_postive"));
        if (money % 1 !== 0) throw new Error(intl.get("input_error_integer"));
        money *= 100;
        GeneralAPI.bill.pay({money}).then(res => {
          if (res.code === 0) {
            Modal.confirm({
              title: intl.get("scan_to_pay"),
              content: <img src={res.data.qrcode} alt="QR Code" />,
              maskClosable: false,
              okText: intl.get("pay_ok"),
              cancelText: intl.get("pay_cancel"),
            });
          }
          else {
            message.error(intl.get("fetch_pay_error"));
          }
        });
      }
      catch(e) {
        message.error((e as Error).message);
      }
    });
  }
  handleGet = () => {
    ShowModalInput(intl.get("input_get_title"), (text) => {
      try {
        let money = Number(text);
        if (isNaN(money)) throw new Error(intl.get("input_error_number"));
        if (money <= 0) throw new Error(intl.get("input_error_postive"));
        money *= 100;
        if (money % 1 !== 0) throw new Error(intl.get("input_error_fix"));
        if (money > this.state.balance.data) throw new Error(intl.get("not_have_balance"));
        GeneralAPI.bill.get({money}).then(res => {
          if (res.code === 0) {
            message.success(intl.get("get_request_success"));
          }
          else {
            message.error(intl.get("get_request_error"));
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
                {store.getState().UserReducer.session.category === STUDENT ? intl.get("your_balance") : intl.get("your_payment")}
              </div>
              <div className={styles.number}>
                {balance.status === -1 ?
                  <Empty description={intl.get("fetch_error")} image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
                <Button onClick={this.handlePay}>{intl.get("pay")}</Button>
                <Button onClick={this.handleGet}>{intl.get("get")}</Button>
              </div>
            : null}
          </div>
          <div key="bills" className={styles.bills}>
            {bills.status === -1 ?
              <Empty description={intl.get("fetch_error")} />
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
                    <div className={styles.type}>{this.typeDesc[v.type]}</div>
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
