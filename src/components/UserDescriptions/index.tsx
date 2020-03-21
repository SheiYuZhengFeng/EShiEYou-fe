import React from "react";
import { Descriptions } from "antd";
import { unixToString } from "../../utils/datetime";

const { Item } = Descriptions;

export const SYSTEM = -1;
export const STUDENT = 0;
export const NATIVE = 1;
export const FOREIGN = 2;
const CATEGORY = ["学生", "中教", "外教"];
const SEX = ["男", "女"];
const LANGUAGE = ["韩语", "日语"];
const LEVEL = ["初级", "中级", "高级"];
const TARGET = ["书面能力", "口语能力", "母语地区生存"];
const COLOR = ["orange", "green"]

export const CONST = {categoty: CATEGORY, sex: SEX, language: LANGUAGE, level: LEVEL, target: TARGET, color: COLOR};

export interface GeneralUser {
  id?: number,
  username?: string,
  name?: string,
  sex?: number,
  age?: number,
  language?: number,
  level?: number,
  target?: number,
  createtime?: number,
  phone?: string,
  qualification?: string,
  background?: string,
  time?: string,
  resume?: string,
  content?: string,
}

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

class UserDescriptions extends React.Component<{title: string, information: GeneralUser, className?: string}> {
  render() {
    const keys = Object.keys(this.props.information).filter(value => {
      for (let i = 0; i < desc.length; ++i) {
        if (desc[i][0] === value) {
          return true;
        }
      }
      return false;
    }).sort((a: string, b: string) => findDesc(a) - findDesc(b));
    return (
      <Descriptions className={this.props.className} title={this.props.title}>
        {keys.map(k => {
          const i = findDesc(k);
          let v = (this.props.information as any)[k];
          if (k === "sex") v = SEX[v];
          if (k === "language") v = LANGUAGE[v];
          if (k === "level") v = LEVEL[v];
          if (k === "target") v = TARGET[v];
          if (k === "createtime") v = unixToString(v);
          if (k === "payment") v += " 元";
          return <Item key={k} label={desc[i][1]}>{v}</Item>;
        })}
      </Descriptions>
    );
  }
}

export default UserDescriptions;
