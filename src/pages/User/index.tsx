import React from 'react';
import styles from './index.module.less';
import Combiner from '../../components/Combiner';
import store from '../../store';
import Login from './Login';
import Register from './Register';
import { Spin, Avatar, Switch, Button, Modal, message } from 'antd';
import StudentAPI from '../../services/StudentAPI';
import NativeAPI from '../../services/NativeAPI';
import ForeignAPI from '../../services/ForeignAPI';
import QueueAnim from 'rc-queue-anim';
import { informationAction, LogoutAction } from '../../actions/UserAction';
import UserDescriptions from '../../components/UserDescriptions';
import GeneralAPI from '../../services/GeneralAPI';

class User extends React.Component<{}, {loged: boolean, view: number, information: any, expand: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = {information: {}, expand: false, ...store.getState().UserReducer};
  }
  ss = store.subscribe(() => {
    this.setState({...this.state, ...store.getState().UserReducer});
  });
  onSwitch = (checked: boolean) => {
    this.setState({...this.state, expand: checked});
  }
  setting = () => {
    if (!this.state.expand) return null;
    const confirmLogout = () => {
      Modal.confirm({
        title: "即将退出登录",
        content: "你确定要退出登录吗？",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          const hide = message.loading("正在退出登录...", 0);
          GeneralAPI.user.logout().then(res => {
            hide();
            message.success("你已退出登录！");
            LogoutAction();
          });
        },
      });
    }
    return (
      <div key="0" className={styles.settings}>
        <Button key="0" className={styles.input} onClick={confirmLogout}>退出登录</Button>
      </div>
    );
  }
  panel = () => {
    if (Object.keys(this.state.information).length === 0) {
      const deal = (res: SimpleResponse) => {
        if (res.code === 0) {
          informationAction(res.data);
        }
      }
      const { category } = store.getState().UserReducer.session;
      if (category === 0) StudentAPI.main.me().then(res => deal(res));
      if (category === 1) NativeAPI.main.me().then(res => deal(res));
      if (category === 2) ForeignAPI.main.me().then(res => deal(res));
      return <Spin size="large" />;
    }
    const i = this.state.information;
    return (
      <QueueAnim className={styles.panel}>
        <Avatar key="0" className={styles.avatar} size={64}>
          {i.name}
        </Avatar>
        <UserDescriptions className={styles.description} key="1" title="" information={i} />
        <Switch key="2" checkedChildren="展开" unCheckedChildren="展开" onChange={this.onSwitch} checked={this.state.expand} />
        <QueueAnim key="3" className={styles.setting} animConfig={[{opacity: [1, 0], translateY: [0, 10]}, {opacity: [1, 0], translateY: [0, 10]}]}>{this.setting()}</QueueAnim>
      </QueueAnim>
    );
  }
  render() {
    return Combiner(
      <div className={styles.container + ' ' + styles.whole}>
        {this.state.loged ? this.panel() : (this.state.view === 0 ? <Login /> : <Register />)}
      </div>
    );
  }
}

export default User;
