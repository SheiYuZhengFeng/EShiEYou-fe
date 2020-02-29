import React from 'react';
import styles from './index.module.less';
import { Select, Input, Button, Icon, message, Tooltip } from 'antd';
import { toLoginAction } from '../../../actions/UserAction';
import QueueAnim from 'rc-queue-anim';

const { Option } = Select;

class Register extends React.Component<{}, {category: number}> {
  form: any = {category: 0}
  constructor(props: {}) {
    super(props);
    this.state = {category: 0};
  }
  handleRegister = () => {
    console.log(this.form);
    if (!this.form.username || !this.form.password) {
      message.error("请输入用户名和密码！");
      return;
    }
  }
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.form[e.target.name] = e.target.value.trim();
  }
  handleSelect = (name: string, value: number) => {
    this.form[name] = value;
    if (name === "category") this.setState({category: value});
  }
  render() {
    const inputStyle = {marginTop: "1em", width: "100%"};
    const { category } = this.state;
    return (
      <div className={styles.whole}>
        注册为
        <Select defaultValue={0} style={{marginLeft: "1em"}} onChange={this.handleSelect.bind(this, "category")}>
          <Option value={0}>学生</Option>
          <Option value={1}>中教</Option>
          <Option value={2}>外教</Option>
        </Select>
        <Input name="username" prefix={<Icon type="user"/>} placeholder="用户名" style={inputStyle} onChange={this.handleChange} />
        <Input name="password" prefix={<Icon type="lock"/>} type="password" placeholder="密码" style={inputStyle} onChange={this.handleChange} />
        <Input name="repeat" prefix={<Icon type="lock"/>} type="password" placeholder="重复密码" style={inputStyle} onChange={this.handleChange} />
        <Select style={inputStyle} placeholder="性别" onChange={this.handleSelect.bind(this, "sex")}>
          <Option value={0}>男</Option>
          <Option value={1}>女</Option>
        </Select>
        <Select style={inputStyle} placeholder="年龄" onChange={this.handleSelect.bind(this, "age")}>
          {Array.from(Array(50), (v, k) => k + 1).map(x => <Option key={x} value={x}>{x}</Option>)}
        </Select>
        <Input name="name" prefix={<Icon type="idcard"/>} placeholder="真实姓名" style={inputStyle} onChange={this.handleChange} />
        <Input name="phone" prefix={<Icon type="phone"/>} placeholder="手机号" style={inputStyle} onChange={this.handleChange} />
        <Input name="content" prefix={<Icon type="tags"/>} placeholder="简短介绍一下自己吧！" style={inputStyle} onChange={this.handleChange} />
        <Select style={inputStyle} placeholder={category === 0 ? "想学习的语种" : "教授的语种"} onChange={this.handleSelect.bind(this, "language")}>
          <Option value={0}>韩语</Option>
          <Option value={1}>日语</Option>
        </Select>
        <QueueAnim>
          {/* 学生 */}
          {category === 0 ?
            <Select key="0" style={inputStyle} placeholder="目前的水平" onChange={this.handleSelect.bind(this, "level")}>
              <Option value={0}>初级</Option>
              <Option value={1}>中级</Option>
              <Option value={2}>高级</Option>
            </Select>
          : null}
          {category === 0 ?
            <Select key="1" style={inputStyle} placeholder="最希望锻炼的能力" onChange={this.handleSelect.bind(this, "target")}>
              <Option value={0}>书面能力</Option>
              <Option value={1}>口语能力</Option>
              <Option value={2}>母语地区生存</Option>
            </Select>
          : null}
          {/* 中教 */}
          {category !== 0 ?
            <Tooltip key="2" title="如：日语N1">
              <Input name="qualification" prefix={<Icon type="file-done"/>} placeholder="语言资质" style={inputStyle} onChange={this.handleChange} />
            </Tooltip>
          : null}
          {category !== 0 ?
            <Tooltip key="3" title="如：南京大学日语系硕士">
              <Input name="background" prefix={<Icon type="trophy"/>} placeholder="高校与学历" style={inputStyle} onChange={this.handleChange} />
            </Tooltip>
          : null}
          {/* 外教 */}
          {category === 2 ?
            <Input key="4" name="resume" prefix={<Icon type="profile"/>} placeholder="简历" style={inputStyle} onChange={this.handleChange} />
          : null}
        </QueueAnim>
        <Button type="primary" htmlType="submit" style={inputStyle} onClick={this.handleRegister}>注册</Button>
        <Button style={inputStyle} onClick={toLoginAction}>登录</Button>
      </div>
    );
  }
}

export default Register;
