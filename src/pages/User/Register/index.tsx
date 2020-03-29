import React from 'react';
import styles from './index.module.less';
import { Select, Input, Button, Icon, message, Tooltip, Modal } from 'antd';
import { toLoginAction } from '../../../actions/UserAction';
import QueueAnim from 'rc-queue-anim';
import StudentAPI from '../../../services/StudentAPI';
import NativeAPI from '../../../services/NativeAPI';
import ForeignAPI from '../../../services/ForeignAPI';
import { CONST, STUDENT, FOREIGN, NATIVE } from '../../../components/UserDescriptions';
import GeneralAPI from '../../../services/GeneralAPI';
import { getCurrentUnix } from '../../../utils/datetime';
import intl from "react-intl-universal";

const { Option } = Select;

class Register extends React.Component<{}, {category: number, loading: boolean}> {
  form: any = {category: STUDENT, lastTime: 0}
  constructor(props: {}) {
    super(props);
    this.state = {category: STUDENT, loading: false};
  }
  validate = () => {
    const { form } = this;
    let msg = [];
    if (!form.username || !form.password || !form.repeat) msg.push(intl.get("input_username_password"));
    if (form.password !== form.repeat) msg.push(intl.get("input_password_same"));
    if (form.sex === undefined) msg.push(intl.get("input_sex"));
    if (form.age === undefined) msg.push(intl.get("input_age"));
    if (!form.name) msg.push(intl.get("input_name"));
    if (!form.phone || !(form.phone as string).match("1[0-9]{10}")) msg.push(intl.get("input_phone"));
    if (!form.vcode) msg.push(intl.get("input_vcode"));
    if (!form.content) msg.push(intl.get("input_content"));
    if (form.language === undefined) msg.push(intl.get("input_language"));
    if (form.category === STUDENT) {
      if (form.level === undefined) msg.push(intl.get("input_level"));
      if (form.target === undefined) msg.push(intl.get("input_target"));
    }
    else {
      if (!form.qualification) msg.push(intl.get("input_qualification"));
      if (!form.background) msg.push(intl.get("input_background"));
      if (form.category === FOREIGN) {
        if (!form.resume) msg.push(intl.get("input_resume"));
      }
    }
    if (msg.length > 0) {
      Modal.warning({
        title: intl.get("input_need_compelete"),
        content: msg.map((v, i) => <p key={i} style={{margin: "0"}}>{v}</p>),
        okText: intl.get("okay"),
      });
      return false;
    }
    return true;
  }
  submit = () => {
    const { form } = this;
    let nf = {
      username: form.username,
      password: form.password,
      sex: form.sex,
      age: form.age,
      name: form.name,
      phone: form.phone,
      language: form.language,
      content: form.content,
      vcode: form.vcode,
    };
    if (form.category === STUDENT) {
      return StudentAPI.main.register({...nf, level: form.level, target: form.target});
    }
    if (form.category === NATIVE) {
      return NativeAPI.main.register({...nf, qualification: form.qualification, background: form.background});
    }
    if (form.category === FOREIGN) {
      return ForeignAPI.main.register({...nf, qualification: form.qualification, background: form.background, resume: form.resume});
    }
  }
  handleRegister = () => {
    if (!this.validate()) return;
    const onOk = () => {
      const hide = message.loading(intl.get("registering"), 0);
      this.setState({...this.state, loading: true});
      this.submit()?.then(res => {
        hide();
        this.setState({...this.state, loading: false});
        if (res.code === 0) {
          message.success(intl.get("register_success"));
          toLoginAction();
        }
        else {
          message.error(intl.get("register_fail"));
        }
      });
    }
    Modal.confirm({
      title: intl.get("ready_to_register"),
      content: intl.get("confirm_to_register_message"),
      okText: intl.get("ok"),
      cancelText: intl.get("cancel"),
      onOk: onOk,
    });
  }
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.form[e.target.name] = e.target.value.trim();
  }
  handleSelect = (name: string, value: number) => {
    this.form[name] = value;
    if (name === "category") this.setState({category: value});
  }
  handleGetCode = () => {
    if (!this.form.phone || !(this.form.phone as string).match("1[0-9]{10}")) {
      message.error(intl.get("input_phone"));
      return;
    }
    const time = getCurrentUnix();
    if (time - this.form.lastTime > 60) {
      GeneralAPI.user.code({phone: this.form.phone}).then(res => {
        if (res.code === 0) {
          this.form.lastTime = time;
          message.success(intl.get("send_vcode_success"));
        }
        else {
          message.error(intl.get("send_vcode_fail"));
        }
      });
      return;
    }
    message.error(intl.get("send_vcode_wait"));
  }
  render() {
    const inputStyle = {marginTop: "1em", width: "100%"};
    const { category } = this.state;
    return (
      <div className={styles.whole}>
        {intl.get("register_as")}
        <Select defaultValue={0} style={{marginLeft: "1em"}} onChange={this.handleSelect.bind(this, "category")}>
          {CONST.categoty().map((v, i) => <Option key={i} value={i}>{v}</Option>)}
        </Select>
        <Input name="username" prefix={<Icon type="user"/>} placeholder={intl.get("username")} style={inputStyle} onChange={this.handleChange} />
        <Input name="password" prefix={<Icon type="lock"/>} type="password" placeholder={intl.get("password")} style={inputStyle} onChange={this.handleChange} />
        <Input name="repeat" prefix={<Icon type="lock"/>} type="password" placeholder={intl.get("password_repeat")} style={inputStyle} onChange={this.handleChange} />
        <Select style={inputStyle} placeholder={intl.get("sex")} onChange={this.handleSelect.bind(this, "sex")}>
          {CONST.sex().map((v, i) => <Option key={i} value={i}>{v}</Option>)}
        </Select>
        <Select style={inputStyle} placeholder={intl.get("age")} onChange={this.handleSelect.bind(this, "age")}>
          {Array.from(Array(50), (v, k) => k + 1).map(x => <Option key={x} value={x}>{x}</Option>)}
        </Select>
        <Input name="name" prefix={<Icon type="idcard"/>} placeholder={intl.get("name")} style={inputStyle} onChange={this.handleChange} />
        <Input name="phone" prefix={<Icon type="phone"/>} placeholder={intl.get("phone")} style={inputStyle} onChange={this.handleChange} />
        <Input.Search name="vcode" enterButton={intl.get("get_vcode")} prefix={<Icon type="question"/>} placeholder={intl.get("vcode")} style={inputStyle} onChange={this.handleChange} onSearch={this.handleGetCode} />
        <Input name="content" prefix={<Icon type="tags"/>} placeholder={intl.get("self_content")} style={inputStyle} onChange={this.handleChange} />
        <Select style={inputStyle} placeholder={intl.get("language")} onChange={this.handleSelect.bind(this, "language")}>
          {CONST.language().map((v, i) => <Option key={i} value={i}>{v}</Option>)}
        </Select>
        <QueueAnim>
          {/* 学生 */}
          {category === STUDENT ?
            <Select key="0" style={inputStyle} placeholder={intl.get("level")} onChange={this.handleSelect.bind(this, "level")}>
              {CONST.level().map((v, i) => <Option key={i} value={i}>{v}</Option>)}
            </Select>
          : null}
          {category === STUDENT ?
            <Select key="1" style={inputStyle} placeholder={intl.get("target")} onChange={this.handleSelect.bind(this, "target")}>
              {CONST.target().map((v, i) => <Option key={i} value={i}>{v}</Option>)}
            </Select>
          : null}
          {/* 中教 */}
          {category !== STUDENT ?
            <Tooltip key="2" title={intl.get("qualification_example")}>
              <Input name="qualification" prefix={<Icon type="file-done"/>} placeholder={intl.get("qualification")} style={inputStyle} onChange={this.handleChange} />
            </Tooltip>
          : null}
          {category !== STUDENT ?
            <Tooltip key="3" title={intl.get("background_example")}>
              <Input name="background" prefix={<Icon type="trophy"/>} placeholder={intl.get("background")} style={inputStyle} onChange={this.handleChange} />
            </Tooltip>
          : null}
          {/* 外教 */}
          {category === FOREIGN ?
            <Input key="4" name="resume" prefix={<Icon type="profile"/>} placeholder={intl.get("resume")} style={inputStyle} onChange={this.handleChange} />
          : null}
        </QueueAnim>
        <Button type="primary" htmlType="submit" style={inputStyle} onClick={this.handleRegister} loading={this.state.loading}>{intl.get("register")}</Button>
        <Button style={inputStyle} onClick={toLoginAction} disabled={this.state.loading}>{intl.get("login")}</Button>
      </div>
    );
  }
}

export default Register;
