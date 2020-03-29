import React from 'react';
import styles from './index.module.less';
import Combiner from '../../components/Combiner';
import { RouteComponentProps, withRouter } from 'react-router';
import StudentAPI, { OrderEntity } from '../../services/StudentAPI';
import store from '../../store';
import NativeAPI from '../../services/NativeAPI';
import { orderListAction } from '../../actions/OrderAction';
import { message, Skeleton, Empty, Icon, Collapse, Button, Modal } from 'antd';
import QueueAnim from 'rc-queue-anim';
import ShowUserDescriptions from '../../components/UserDescriptions/WithModal';
import { FOREIGN, STUDENT, NATIVE } from '../../components/UserDescriptions';
import { unixToString } from '../../utils/datetime';
import intl from "react-intl-universal";

const getType = (v: OrderEntity) => {
  const { state, rid } = v;
  if (state === 2) return 0;
  if (state === 1) return 1;
  if (rid === -1) return 2;
  if (rid === 0) return 3;
  return 4;
}

const Map = {
  icon: (v: OrderEntity) => ["close", "question", "clock-circle", "check", "exclamation"][getType(v)],
  background: (v: OrderEntity) => [styles.canceled, styles.waiting, styles.beforeclass, styles.finished, styles.onclass][getType(v)],
  description: (v: OrderEntity) => [intl.get("order_status_desc_cancel_refuse"), intl.get("order_status_desc_confirming"), intl.get("order_status_desc_waiting"), intl.get("order_status_desc_finish"), intl.get("order_status_desc_onclass")][getType(v)],
}

class Order extends React.Component<RouteComponentProps, {status: number, order: OrderEntity[]}> {
  constructor(props: any) {
    super(props);
    this.state = {status: store.getState().OrderReducer.status, order: store.getState().OrderReducer.order};
  }
  ss = store.subscribe(() => {
    this.setState({...this.state, order: store.getState().OrderReducer.order, status: store.getState().OrderReducer.status});
  });
  componentWillMount() {
    this.updateList();
  }
  componentWillUnmount() {
    this.ss();
  }
  updateList = () => {
    const { UserReducer } = store.getState();
    if (!UserReducer.loged || UserReducer.session.category === FOREIGN) return;
    (UserReducer.session.category === STUDENT ? StudentAPI.order.my() : NativeAPI.order.list()).then(res => {
      if (res.code === 0) {
        orderListAction(res.data.orders as OrderEntity[]);
      }
      else {
        orderListAction([]);
        message.error(intl.get("fetch_error"));
      }
    });
  }
  handleAccept = (id: number, accept: boolean) => {
    const onOk = () => {
      NativeAPI.order.reply({id, accept}).then(res => {
        if (res.code === 0) {
          message.success(accept ? intl.get("accept_order_success") : intl.get("refuse_order_success"));
          this.updateList();
        }
        else {
          message.success(accept ? intl.get("accept_order_fail") : intl.get("refuse_order_fail"));
        }
      });
    }
    Modal.confirm({
      title: intl.get("replying_order"),
      content: accept ? intl.get("confirm_to_accept_order") : intl.get("confirm_to_refuse_order"),
      okText: intl.get("ok"),
      cancelText: intl.get("cancel"),
      onOk,
    });
  }
  handleCancel = (id: number, category: number) => {
    const onOk = () => {
      (category === STUDENT ? StudentAPI.order.cancel : NativeAPI.order.cancel)({id}).then(res => {
        if (res.code === 0) {
          message.success(intl.get("cancel_order_success"));
          this.updateList();
        }
        else {
          message.error(intl.get("cancel_order_fail"));
        }
      });
    }
    Modal.confirm({
      title: intl.get("canceling_order"),
      content: intl.get("confirm_to_cancel_order_message"),
      okText: intl.get("confirm_to_cancel_order"),
      cancelText: intl.get("confirm_to_cancel_order_cancel"),
      onOk,
    });
  }
  toClassRoom = (rid: number) => {
    this.props.history.push("/room/" + rid);
  }
  toCourse = (cid: number, vid: number) => {
    this.props.history.push("/mycourse/" + cid + "/order/" + vid);
  }
  showUser = (id: number, category: number) => {
    ShowUserDescriptions(category, id, true);
  }
  render() {
    const { category } = store.getState().UserReducer.session;
    let component: JSX.Element;
    if (this.state.status === 0) {
      component = <Skeleton active />;
    }
    else if (this.state.order.length === 0) component = <Empty description={intl.get("empty_order")} />;
    else component = (
      <QueueAnim>
        <Collapse key="orders" className={styles.orders} expandIconPosition="right" bordered={false}>
          {this.state.order.map((v, i) => (
            <Collapse.Panel key={i} header={
              <div className={styles.header}>
                <Icon className={styles.icon} type={Map.icon(v)} />
                <div className={styles.time}>{unixToString(v.starttime) + " ~ " + unixToString(v.endtime)}</div>
              </div>
            } className={styles.panel + " " + Map.background(v)}>
              <div className={styles.state}>{Map.description(v)}</div>
              <div className={styles.createtime}>{intl.get("order_create_at") + " " + unixToString(v.createtime)}</div>
              <div className={styles.controls}>
                {category === NATIVE && v.state === 1 ? // 中教，待确认，接受/拒绝
                  <>
                    <Button type="primary" onClick={this.handleAccept.bind(this, v.id, true)}>{intl.get("accept_order")}</Button>
                    <Button type="danger" onClick={this.handleAccept.bind(this, v.id, false)}>{intl.get("refuse_order")}</Button>
                  </>
                : null}
                {(v.state === 0 && v.rid === -1) || (v.state === 1 && category === STUDENT) ? // （预约成功，未上课）或（学生，待中教确认），取消预约
                  <Button type="danger" onClick={this.handleCancel.bind(this, v.id, category)}>{intl.get("cancel_order")}</Button>
                : null}
                {v.state === 0 && v.rid > 0 ? // 上课中
                  <Button type="primary" onClick={this.toClassRoom.bind(this, v.rid)}>{intl.get("enter_room")}</Button>
                : null}
                <Button onClick={this.toCourse.bind(this, v.cid, v.vid)}>{intl.get("check_course")}</Button>
                <Button onClick={this.showUser.bind(this, category === STUDENT ? v.teacher : v.student, category === STUDENT ? NATIVE : STUDENT)}>{category === STUDENT ? intl.get("native") : intl.get("student")} {intl.get("information")}</Button>
              </div>
            </Collapse.Panel>
          ))}
        </Collapse>
      </QueueAnim>
    );
    return Combiner(
      <div className={styles.container + " " + styles.whole}>
        {component}
      </div>
    );
  }
}

export default withRouter(Order);
