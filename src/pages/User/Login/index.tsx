import React from 'react';
import styles from './index.module.less';
import { Select, Input, Button, Icon, message } from 'antd';
import { toRegisterAction, LoginAction } from '../../../actions/UserAction';
import GeneralAPI from '../../../services/GeneralAPI';

const { Option } = Select;

class Login extends React.Component<{}, {loading: boolean}> {
  form: any = {category: 0, username: "", password: ""}
  constructor(props: {}) {
    super(props);
    this.state = {loading: false};
  }
  handleLogin = () => {
    if (this.form.username === "" || this.form.password === "") {
      message.error("请输入用户名和密码！");
      return;
    }
    const hide = message.loading("正在登录...", 0);
    this.setState({...this.state, loading: true});
    GeneralAPI.user.login(this.form).then(res => {
      hide();
      this.setState({...this.state, loading: false});
      if (res.code === 0) {
        message.success(res.data.name + "，欢迎回来！");
        LoginAction(res.data);
      }
      else {
        message.error("用户名或密码错误！");
      }
    });
  }
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.form[e.target.name] = e.target.value.trim();
  }
  handleSelect = (value: number) => {
    this.form.category = value;
  }
  render() {
    const inputStyle = {marginTop: "1em", width: "100%"};
    return (
      <div className={styles.whole}>
        登录为
        <Select defaultValue={0} style={{marginLeft: "1em"}} onChange={this.handleSelect}>
          <Option value={0}>学生</Option>
          <Option value={1}>中教</Option>
          <Option value={2}>外教</Option>
        </Select>
        <Input name="username" prefix={<Icon type="user"/>} placeholder="用户名" style={inputStyle} onChange={this.handleChange}/>
        <Input name="password" prefix={<Icon type="lock"/>} type="password" placeholder="密码" style={inputStyle} onChange={this.handleChange}/>
        <Button type="primary" htmlType="submit" style={inputStyle} onClick={this.handleLogin} loading={this.state.loading}>登录</Button>
        <Button style={inputStyle} onClick={toRegisterAction} disabled={this.state.loading}>注册</Button>
      </div>
    );
  }
}

export default Login;
