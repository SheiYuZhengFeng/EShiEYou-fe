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
    if (!form.username || !form.password || !form.repeat) msg.push("请输入用户名和密码");
    if (form.password !== form.repeat) msg.push("请确认两次密码输入一致");
    if (form.sex === undefined) msg.push("请选择你的性别");
    if (form.age === undefined) msg.push("请选择你的年龄");
    if (!form.name) msg.push("请输入你的真实姓名");
    if (!form.phone || !(form.phone as string).match("1[0-9]{10}")) msg.push("请正确输入你的手机号");
    if (!form.vcode) msg.push("请获取手机验证码并正确输入");
    if (!form.content) msg.push("请输入你的个人简介");
    if (form.language === undefined) msg.push("请选择你的语种");
    if (form.category === STUDENT) {
      if (form.level === undefined) msg.push("请选择你目前的语言水平");
      if (form.target === undefined) msg.push("请选择你希望锻炼的能力");
    }
    else {
      if (!form.qualification) msg.push("请输入你的语言资质");
      if (!form.background) msg.push("请输入你的高校与学历");
      if (form.category === FOREIGN) {
        if (!form.resume) msg.push("请填写你的简历");
      }
    }
    if (msg.length > 0) {
      Modal.warning({
        title: "你的注册表单需要完善",
        content: msg.map((v, i) => <p key={i} style={{margin: "0"}}>{v}</p>),
        okText: "好的",
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
      const hide = message.loading("正在注册...", 0);
      this.setState({...this.state, loading: true});
      this.submit()?.then(res => {
        hide();
        this.setState({...this.state, loading: false});
        if (res.code === 0) {
          message.success("注册成功！");
          toLoginAction();
        }
        else {
          message.error("注册失败，请检查你的注册单！");
        }
      });
    }
    Modal.confirm({
      title: "即将提交注册",
      content: "请再次确认你的信息，提交后我们将进行验证。",
      okText: "提交",
      cancelText: "返回再次确认",
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
      message.error("请输入正确的手机号");
      return;
    }
    const time = new Date().getTime() / 1000;
    if (time - this.form.lastTime > 60) {
      GeneralAPI.user.code({phone: this.form.phone}).then(res => {
        if (res.code === 0) {
          this.form.lastTime = time;
          message.success("手机验证码发送成功！");
        }
        else {
          message.error("请稍候重试！");
        }
      });
      return;
    }
    message.error("请一分钟后重试！");
  }
  render() {
    const inputStyle = {marginTop: "1em", width: "100%"};
    const { category } = this.state;
    return (
      <div className={styles.whole}>
        注册为
        <Select defaultValue={0} style={{marginLeft: "1em"}} onChange={this.handleSelect.bind(this, "category")}>
          {CONST.categoty.map((v, i) => <Option key={i} value={i}>{v}</Option>)}
        </Select>
        <Input name="username" prefix={<Icon type="user"/>} placeholder="用户名" style={inputStyle} onChange={this.handleChange} />
        <Input name="password" prefix={<Icon type="lock"/>} type="password" placeholder="密码" style={inputStyle} onChange={this.handleChange} />
        <Input name="repeat" prefix={<Icon type="lock"/>} type="password" placeholder="重复密码" style={inputStyle} onChange={this.handleChange} />
        <Select style={inputStyle} placeholder="性别" onChange={this.handleSelect.bind(this, "sex")}>
          {CONST.sex.map((v, i) => <Option key={i} value={i}>{v}</Option>)}
        </Select>
        <Select style={inputStyle} placeholder="年龄" onChange={this.handleSelect.bind(this, "age")}>
          {Array.from(Array(50), (v, k) => k + 1).map(x => <Option key={x} value={x}>{x}</Option>)}
        </Select>
        <Input name="name" prefix={<Icon type="idcard"/>} placeholder="真实姓名" style={inputStyle} onChange={this.handleChange} />
        <Input name="phone" prefix={<Icon type="phone"/>} placeholder="手机号" style={inputStyle} onChange={this.handleChange} />
        <Input.Search name="vcode" enterButton="获取验证码" prefix={<Icon type="question"/>} placeholder="验证码" style={inputStyle} onChange={this.handleChange} onSearch={this.handleGetCode} />
        <Input name="content" prefix={<Icon type="tags"/>} placeholder="简短介绍一下自己吧！" style={inputStyle} onChange={this.handleChange} />
        <Select style={inputStyle} placeholder={category === STUDENT ? "想学习的语种" : "教授的语种"} onChange={this.handleSelect.bind(this, "language")}>
          {CONST.language.map((v, i) => <Option key={i} value={i}>{v}</Option>)}
        </Select>
        <QueueAnim>
          {/* 学生 */}
          {category === STUDENT ?
            <Select key="0" style={inputStyle} placeholder="目前的水平" onChange={this.handleSelect.bind(this, "level")}>
              {CONST.level.map((v, i) => <Option key={i} value={i}>{v}</Option>)}
            </Select>
          : null}
          {category === STUDENT ?
            <Select key="1" style={inputStyle} placeholder="最希望锻炼的能力" onChange={this.handleSelect.bind(this, "target")}>
              {CONST.target.map((v, i) => <Option key={i} value={i}>{v}</Option>)}
            </Select>
          : null}
          {/* 中教 */}
          {category !== STUDENT ?
            <Tooltip key="2" title="如：日语N1">
              <Input name="qualification" prefix={<Icon type="file-done"/>} placeholder="语言资质" style={inputStyle} onChange={this.handleChange} />
            </Tooltip>
          : null}
          {category !== STUDENT ?
            <Tooltip key="3" title="如：南京大学日语系硕士">
              <Input name="background" prefix={<Icon type="trophy"/>} placeholder="高校与学历" style={inputStyle} onChange={this.handleChange} />
            </Tooltip>
          : null}
          {/* 外教 */}
          {category === FOREIGN ?
            <Input key="4" name="resume" prefix={<Icon type="profile"/>} placeholder="简历" style={inputStyle} onChange={this.handleChange} />
          : null}
        </QueueAnim>
        <Button type="primary" htmlType="submit" style={inputStyle} onClick={this.handleRegister} loading={this.state.loading}>注册</Button>
        <Button style={inputStyle} onClick={toLoginAction} disabled={this.state.loading}>登录</Button>
      </div>
    );
  }
}

export default Register;
