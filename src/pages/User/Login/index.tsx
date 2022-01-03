import React from 'react';
import styles from './index.module.less';
import { Select, Input, Button, Icon, message } from 'antd';
import { toRegisterAction, LoginAction } from '../../../actions/UserAction';
import GeneralAPI from '../../../services/GeneralAPI';
import { CONST, STUDENT } from '../../../components/UserDescriptions';
import { withRouter, RouteComponentProps } from 'react-router';
import intl from "react-intl-universal";

const { Option } = Select;

class Login extends React.Component<RouteComponentProps<{}, {}, {redirect?: string}>, {loading: boolean}> {
  form: any = {category: STUDENT, username: "", password: ""}
  constructor(props: any) {
    super(props);
    this.state = {loading: false};
  }
  handleLogin = () => {
    if (this.form.username === "" || this.form.password === "") {
      message.error(intl.get("input_username_password"));
      return;
    }
    const hide = message.loading(intl.get("logingin"), 0);
    this.setState({...this.state, loading: true});
    GeneralAPI.user.login(this.form).then(res => {
      hide();
      this.setState({...this.state, loading: false});
      if (res.code === 0) {
        message.success(res.data.name + "，" + intl.get("welcome"));
        LoginAction({...res.data, category: this.form.category});
        const redirect = this.props.history.location.state?.redirect
        if (redirect) {
          this.props.history.push(redirect);
        }
      }
      else {
        message.error(intl.get("username_password_error"));
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
        {intl.get("login_as")}
        <Select defaultValue={0} style={{marginLeft: "1em"}} onChange={this.handleSelect}>
          {CONST.categoty().map((v, i) => <Option key={i} value={i}>{v}</Option>)}
        </Select>
        <Input name="username" prefix={<Icon type="user"/>} placeholder={intl.get("username")} style={inputStyle} onChange={this.handleChange}/>
        <Input name="password" prefix={<Icon type="lock"/>} type="password" placeholder={intl.get("password")} style={inputStyle} onChange={this.handleChange}/>
        <Button type="primary" htmlType="submit" style={inputStyle} onClick={this.handleLogin} loading={this.state.loading}>{intl.get("login")}</Button>
        <Button style={inputStyle} onClick={toRegisterAction} disabled={this.state.loading}>{intl.get("register")}</Button>
      </div>
    );
  }
}

export default withRouter(Login);
