import React from 'react';
import styles from './index.module.less';
import Combiner from '../../components/Combiner';
import store from '../../store';
import Login from './Login';
import Register from './Register';
import { Spin, Avatar, Switch, Button, Modal, message, Input, Icon } from 'antd';
import StudentAPI from '../../services/StudentAPI';
import NativeAPI from '../../services/NativeAPI';
import ForeignAPI from '../../services/ForeignAPI';
import QueueAnim from 'rc-queue-anim';
import { informationAction, LogoutAction } from '../../actions/UserAction';
import UserDescriptions from '../../components/UserDescriptions';
import GeneralAPI from '../../services/GeneralAPI';

class User extends React.Component<{}, {loged: boolean, view: number, information: any, expand: boolean, password: boolean}> {
  form: any = {}
  constructor(props: any) {
    super(props);
    this.state = {information: {}, expand: false, password: false, ...store.getState().UserReducer};
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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.form[e.target.name] = e.target.value.trim();
    }
    const handlePassword = () => {
      const { form } = this;
      if (!form.oldpassword || !form.newpassword || !form.repeat || form.newpassword !== form.repeat) {
        message.error("请输入新旧密码且两次新密码输入一致！");
        return;
      }
      const hide = message.loading("正在修改...", 0);
      this.setState({...this.state, password: true});
      GeneralAPI.user.password({oldpassword: form.oldpassword, newpassword: form.newpassword}).then(res => {
        hide();
        this.setState({...this.state, password: false});
        if (res.code === 0) {
          LogoutAction();
          message.success("密码修改成功，请用新密码重新登录！");
        }
        else {
          message.error("修改失败，旧密码错误！");
        }
      });
      this.form = {};
    }
    return (
      <div key="0" className={styles.settings}>
        <div className={styles.item}>
          <p className={styles.title}>修改密码</p>
          <Input className={styles.input} type="password" name="oldpassword" prefix={<Icon type="lock"/>} placeholder="旧密码" onChange={handleChange} disabled={this.state.password} />
          <Input className={styles.input} type="password" name="newpassword" prefix={<Icon type="lock"/>} placeholder="新密码" onChange={handleChange} disabled={this.state.password} />
          <Input className={styles.input} type="password" name="repeat" prefix={<Icon type="lock"/>} placeholder="重复新密码" onChange={handleChange} disabled={this.state.password} />
          <Button className={styles.input} type="primary" onClick={handlePassword} loading={this.state.password}>修改</Button>
        </div>
        <Button className={styles.item} onClick={confirmLogout}>退出登录</Button>
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
