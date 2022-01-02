import React from 'react';
import styles from './index.module.less';
import Combiner from '../../components/Combiner';
import store from '../../store';
import Login from './Login';
import Register from './Register';
import { Spin, Avatar, Switch, Button, message, Input, Icon, Select } from 'antd';
import StudentAPI from '../../services/StudentAPI';
import NativeAPI from '../../services/NativeAPI';
import ForeignAPI from '../../services/ForeignAPI';
import QueueAnim from 'rc-queue-anim';
import { informationAction, LogoutAction } from '../../actions/UserAction';
import UserDescriptions, { CONST, STUDENT, NATIVE, FOREIGN } from '../../components/UserDescriptions';
import GeneralAPI from '../../services/GeneralAPI';
import intl from "react-intl-universal";

class User extends React.Component<{}, {loged: boolean, view: number, information: any, expand: boolean, password: boolean, modify: boolean}> {
  form: any = {}
  constructor(props: any) {
    super(props);
    this.state = {information: {}, expand: false, password: false, modify: false, ...store.getState().UserReducer};
  }
  ss = store.subscribe(() => {
    this.setState({...this.state, ...store.getState().UserReducer});
  });
  componentWillUnmount() {
    this.ss();
  }
  onSwitch = (checked: boolean) => {
    this.setState({...this.state, expand: checked});
    if (checked) this.form = {...this.state.information};
  }
  updateInformation = () => {
    const deal = (res: SimpleResponse) => {
      if (res.code === 0) {
        informationAction(res.data);
      }
    }
    const { category } = store.getState().UserReducer.session;
    if (category === STUDENT) StudentAPI.main.me().then(res => deal(res));
    if (category === NATIVE) NativeAPI.main.me().then(res => deal(res));
    if (category === FOREIGN) ForeignAPI.main.me().then(res => deal(res));
  }
  setting = () => {
    if (!this.state.expand) return null;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.form[e.target.name] = e.target.value.trim();
    }
    const handleSelect = (name: string, value: number) => {
      this.form[name] = value;
    }
    const handlePassword = () => {
      const { form } = this;
      if (!form.oldpassword || !form.newpassword || !form.repeat || form.newpassword !== form.repeat) {
        message.error(intl.get("password_old_password"));
        return;
      }
      const hide = message.loading(intl.get("modifying"), 0);
      this.setState({...this.state, password: true});
      GeneralAPI.user.password({oldpassword: form.oldpassword, newpassword: form.newpassword}).then(res => {
        hide();
        this.setState({...this.state, password: false});
        if (res.code === 0) {
          this.setState({...this.state, expand: false});
          LogoutAction();
          message.success(intl.get("change_password_success"));
        }
        else {
          message.error(intl.get("change_password_fail"));
        }
      });
      this.form = {};
    }
    const { category } = store.getState().UserReducer.session;
    const handleModify = () => {
      const { form } = this;
      let update;
      const hide = message.loading(intl.get("modifying"), 0);
      this.setState({...this.state, modify: true});
      if (category === STUDENT) update = StudentAPI.main.edit({language: form.language, level: form.level, target: form.target, content: form.content});
      else if (category === NATIVE) update = NativeAPI.main.edit({time: form.time, content: form.content});
      else update = ForeignAPI.main.edit({content: form.content});
      update.then(res => {
        hide();
        this.setState({...this.state, modify: false});
        if (res.code === 0) {
          message.success(intl.get("modify_information_success"));
          this.updateInformation();
        }
        else {
          message.error(intl.get("modify_information_fail"));
        }
      });
    }
    return (
      <div key="0" className={styles.settings}>
        <div className={styles.item}>
          <p className={styles.title}>{intl.get("modify_information")}</p>
          {category === STUDENT ? <>
            <Select className={styles.input} defaultValue={this.state.information.language} placeholder={intl.get("language")} onChange={handleSelect.bind(this, "language")}>
              {CONST.language().map((v, i) => <Select.Option key={i} value={i}>{v}</Select.Option>)}
            </Select>
            <Select className={styles.input} defaultValue={this.state.information.level} placeholder={intl.get("level")} onChange={handleSelect.bind(this, "level")}>
              {CONST.level().map((v, i) => <Select.Option key={i} value={i}>{v}</Select.Option>)}
            </Select>
            <Select className={styles.input} defaultValue={this.state.information.target} placeholder={intl.get("target")} onChange={handleSelect.bind(this, "target")}>
              {CONST.target().map((v, i) => <Select.Option key={i} value={i}>{v}</Select.Option>)}
            </Select>
          </> : null}
          {category === NATIVE ? <>
            <Input className={styles.input} name="time" prefix={<Icon type="clock-circle"/>} placeholder={intl.get("available_time")} onChange={handleChange} defaultValue={this.state.information.time} />
          </> : null}
          <Input className={styles.input} name="content" prefix={<Icon type="tags"/>} placeholder={intl.get("self_content")} onChange={handleChange} defaultValue={this.state.information.content} />
          <Button className={styles.input} type="primary" onClick={handleModify} loading={this.state.modify}>{intl.get("ok")}</Button>
        </div>
        <div className={styles.item}>
          <p className={styles.title}>{intl.get("change_password")}</p>
          <Input className={styles.input} type="password" name="oldpassword" prefix={<Icon type="lock"/>} placeholder={intl.get("old_password")} onChange={handleChange} disabled={this.state.password} />
          <Input className={styles.input} type="password" name="newpassword" prefix={<Icon type="lock"/>} placeholder={intl.get("new_password")} onChange={handleChange} disabled={this.state.password} />
          <Input className={styles.input} type="password" name="repeat" prefix={<Icon type="lock"/>} placeholder={intl.get("new_password_repeat")} onChange={handleChange} disabled={this.state.password} />
          <Button className={styles.input} type="primary" onClick={handlePassword} loading={this.state.password}>{intl.get("modify")}</Button>
        </div>
      </div>
    );
  }
  handleZM = () => {
    window.location.href = require("../../themes/timg.png");
  }
  panel = () => {
    if (Object.keys(this.state.information).length === 0) {
      this.updateInformation();
      return <Spin size="large" />;
    }
    const i = this.state.information;
    return (
      <QueueAnim className={styles.panel}>
        <Avatar key="0" className={styles.avatar} size={64}>
          {i.name}
        </Avatar>
        <UserDescriptions className={styles.description} key="1" title="" information={i} />
        <Button key="生成实习证明" type="primary" style={{marginBottom: "1em"}} onClick={this.handleZM}>生成实习证明</Button>
        <Switch key="2" checkedChildren={intl.get("expand")} unCheckedChildren={intl.get("expand")} onChange={this.onSwitch} checked={this.state.expand} />
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
