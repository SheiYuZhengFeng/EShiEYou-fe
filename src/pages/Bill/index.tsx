import React from "react";
import styles from "./index.module.less";
import Combiner from "../../components/Combiner";
import { BillState } from "../../reducers/BillReducer";
import store from "../../store";
import { updateAll } from "../../controllers/BillController";
import { STUDENT } from "../../components/UserDescriptions";
import { Empty, Spin, Icon, Button, message, Modal, Tag, Radio, Tooltip } from "antd";
import { convertMoney, signedMoney } from "../../utils/money";
import { unixToString } from "../../utils/datetime";
import QueueAnim from "rc-queue-anim";
import ShowModalInput from "../../components/ModalInput";
import GeneralAPI from "../../services/GeneralAPI";
import intl from "react-intl-universal";
import { RadioChangeEvent } from "antd/lib/radio";

const getStatusIcon = (status: number) => {
  switch(status){
    case -1: return "close";
    case 0: return "clock-circle";
    default: return "check";
  }
}

const getStatusTagColor = (status: number) => {
  switch(status){
    case -1: return "red";
    case 0: return "blue";
    default: return "green";
  }
}

const getStatusColor = (status: number) => {
  switch(status){
    case -1: return styles.closed;
    case 0: return styles.waiting;
    default: return styles.ok;
  }
}

const getStatusDesc = (status: number) => {
  switch(status){
    case -1: return intl.get('canceled');
    case 0: return intl.get('waiting');
    default: return intl.get('completed');
  }
}

class Bill extends React.Component<any, BillState & { filter: number }> {
  typeDesc = [intl.get("bill_type_pay"), intl.get("bill_type_get"), intl.get("bill_type_consume"), intl.get("bill_type_deduct"), intl.get("bill_type_back"), intl.get("bill_type_income"), intl.get("bill_type_redress")];
  constructor(props: any) {
    super(props);
    this.state = {...store.getState().BillReducer, filter: 0};
  }
  ss = store.subscribe(() => {
    this.setState({...this.state, ...store.getState().BillReducer});
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
  handleFilter = (e: RadioChangeEvent) => {
    this.setState({...this.state, filter: e.target.value})
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
                <Button onClick={this.handlePay} type="primary">{intl.get("pay")}</Button>
                <Button onClick={this.handleGet}>{intl.get("get")}</Button>
              </div>
            : null}
          </div>
          <Radio.Group key="control" value={this.state.filter} buttonStyle="solid" style={{ marginTop: '3em' }} onChange={this.handleFilter.bind(this)}>
            <Radio.Button value={0}>{intl.get("all")}</Radio.Button>
            <Radio.Button value={-1}>{intl.get("spend")}</Radio.Button>
            <Radio.Button value={1}>{intl.get("income")}</Radio.Button>
          </Radio.Group>
          <div key="bills" className={styles.bills}>
            {bills.status === -1 ?
              <Empty description={intl.get("fetch_error")} />
            : bills.status === 0 ?
              <Spin size="large" />
            : bills.data.filter(v => v.money * this.state.filter >= 0).map((v, i) => (
              <Tooltip key={i} title={getStatusDesc(v.status)} className={styles.bill + " " + getStatusColor(v.status)}>
                <div className={styles.typestatus}>
                  <Tag className={styles.status} color={getStatusTagColor(v.status)}>
                    <Icon type={getStatusIcon(v.status)} />
                  </Tag>
                  <div className={styles.type}>{this.typeDesc[v.type]}</div>
                </div>
                <div className={styles.money + (v.money < 0 ? (' ' + styles.minus) : '')}>{signedMoney(v.money)}</div>
                {v.content}
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
