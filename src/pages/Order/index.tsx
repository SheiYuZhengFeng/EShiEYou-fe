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
  description: (v: OrderEntity) => ["预约已取消或被拒绝", "等待中教确认中", "学生与中教预约成功，当前未开始上课", "学生与中教预约成功，该预约时段的课程已经结束", "学生与中教预约成功，正在上课中"][getType(v)],
}

class Order extends React.Component<RouteComponentProps, {status: number, order: OrderEntity[]}> {
  constructor(props: any) {
    super(props);
    this.state = {status: store.getState().OrderReducer.status, order: store.getState().OrderReducer.order};
  }
  ss = store.subscribe(() => {
    this.setState({...this.state, order: store.getState().OrderReducer.order, status: store.getState().OrderReducer.status});
  });
  componentWillUnmount() {
    this.ss();
  }
  updateList = () => {
    const { UserReducer } = store.getState();
    if (!UserReducer.loged || UserReducer.session.category === 2) return;
    (UserReducer.session.category === 0 ? StudentAPI.order.my() : NativeAPI.order.list()).then(res => {
      if (res.code === 0) {
        orderListAction(res.data.orders as OrderEntity[]);
      }
      else {
        orderListAction([]);
        message.error("拉取预约列表失败！");
      }
    });
  }
  handleAccept = (id: number, accept: boolean) => {
    const s = accept ? "接受" : "拒绝";
    const onOk = () => {
      NativeAPI.order.reply({id, accept}).then(res => {
        if (res.code === 0) {
          message.success(s + "预约成功！");
          this.updateList();
        }
        else {
          message.error(s + "预约失败！");
        }
      });
    }
    Modal.confirm({
      title: "即将回复预约",
      content: "你确定要" + s + "该预约吗？",
      okText: "确定" + s,
      cancelText: "取消",
      onOk,
    });
  }
  handleCancel = (id: number, category: number) => {
    const onOk = () => {
      (category === 0 ? StudentAPI.order.cancel : NativeAPI.order.cancel)({id}).then(res => {
        if (res.code === 0) {
          message.success("取消预约成功！");
          this.updateList();
        }
        else {
          message.error("取消预约失败！");
        }
      });
    }
    Modal.confirm({
      title: "即将取消预约",
      content: "你确定要取消该预约吗？",
      okText: "确定取消预约",
      cancelText: "不取消",
      onOk,
    });
  }
  toClassRoom = (rid: number) => {
    this.props.history.push("/room/" + rid);
  }
  render() {
    const { category } = store.getState().UserReducer.session;
    let component: JSX.Element;
    if (this.state.status === 0) {
      component = <Skeleton active />;
      this.updateList();
    }
    else if (this.state.order.length === 0) component = <Empty description="暂无预约" />;
    else component = (
      <QueueAnim>
        <Collapse key="orders" className={styles.orders} expandIconPosition="right" bordered={false}>
          {this.state.order.map((v, i) => (
            <Collapse.Panel key={i} header={
              <div className={styles.header}>
                <Icon className={styles.icon} type={Map.icon(v)} />
                <div className={styles.time}>{new Date(v.starttime * 1000).toLocaleString() + " ~ " + new Date(v.endtime * 1000).toLocaleString()}</div>
              </div>
            } className={styles.panel + " " + Map.background(v)}>
              <div className={styles.state}>{Map.description(v)}</div>
              <div className={styles.controls}>
                {category === 1 && v.state === 1 ? // 中教，待确认，接受/拒绝
                  <>
                    <Button type="primary" onClick={this.handleAccept.bind(this, v.id, true)}>接受预约</Button>
                    <Button type="danger" onClick={this.handleAccept.bind(this, v.id, false)}>拒绝预约</Button>
                  </>
                : null}
                {(v.state === 0 && v.rid === -1) || (v.state === 1 && category === 0) ? // （预约成功，未上课）或（学生，待中教确认），取消预约
                  <Button type="danger" onClick={this.handleCancel.bind(this, v.id, category)}>取消预约</Button>
                : null}
                {v.state === 0 && v.rid > 0 ? // 上课中
                  <Button type="primary" onClick={this.toClassRoom.bind(this, v.rid)}>进入课堂</Button>
                : null}
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
