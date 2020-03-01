import React from "react";
import { Descriptions } from "antd";

const { Item } = Descriptions;

const SEX = ["男", "女"];
const LANGUAGE = ["韩语", "日语"];
const LEVEL = ["初级", "中级", "高级"];
const TARGET = ["书面能力", "口语能力", "母语地区生存"];

const desc = [
  ["username", "用户名"],
  ["name", "姓名"],
  ["sex", "性别"],
  ["age", "年龄"],
  ["language", "语种"],
  ["level", "语言水平"],
  ["target", "学习目标"],
  ["createtime", "创建时间"],
  ["phone", "手机号"],
  ["qualification", "语言资质"],
  ["background", "学历"],
  ["payment", "未提现佣金"],
  ["time", "可预约时间"],
  ["resume", "简历"],
  ["content", "个人简介"],
];

const findDesc = (x: string) => {
  for (let i = 0; i < desc.length; ++i) {
    if (desc[i][0] === x) {
      return i;
    }
  }
  return -1;
};

class UserDescriptions extends React.Component<{title: string, information: any, className?: string}> {
  render() {
    const keys = Object.keys(this.props.information).sort((a: string, b: string) => findDesc(a) - findDesc(b));
    return (
      <Descriptions className={this.props.className} title={this.props.title}>
        {keys.map(k => {
          const i = findDesc(k);
          let v = this.props.information[k];
          if (k === "sex") v = SEX[v];
          if (k === "language") v = LANGUAGE[v];
          if (k === "level") v = LEVEL[v];
          if (k === "target") v = TARGET[v];
          if (k === "createtime") v = new Date(v).toDateString();
          if (k === "payment") v += " 元";
          return <Item key={v} label={desc[i][1]}>{v}</Item>;
        })}
      </Descriptions>
    );
  }
}

export default UserDescriptions;
