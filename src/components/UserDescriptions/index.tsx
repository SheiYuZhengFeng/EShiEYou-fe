import React from "react";
import { Descriptions } from "antd";
import { unixToString } from "../../utils/datetime";
import intl from "react-intl-universal";

const { Item } = Descriptions;

export const SYSTEM = -1;
export const STUDENT = 0;
export const NATIVE = 1;
export const FOREIGN = 2;
const CATEGORY = () => [intl.get("student"), intl.get("native"), intl.get("foreign")];
const SEX = () => [intl.get("male"), intl.get("female")];
const LANGUAGE = () => [intl.get("korean"), intl.get("japanese")];
const LEVEL = () => [intl.get("level_primary"), intl.get("level_middle"), intl.get("level_high")];
const TARGET = () => [intl.get("target_writing"), intl.get("target_oral"), intl.get("target_living")];
const COLOR = () => ["orange", "green"];

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

class UserDescriptions extends React.Component<{title: string, information: GeneralUser, className?: string}> {
  desc = [
    ["username", intl.get("username")],
    ["name", intl.get("name")],
    ["sex", intl.get("sex")],
    ["age", intl.get("age")],
    ["language", intl.get("language")],
    ["level", intl.get("level")],
    ["target", intl.get("target")],
    ["createtime", intl.get("create_time")],
    ["phone", intl.get("phone")],
    ["qualification", intl.get("qualification")],
    ["background", intl.get("background")],
    ["time", intl.get("available_time")],
    ["resume", intl.get("resume")],
    ["content", intl.get("self_content")],
  ];
  findDesc = (x: string) => {
    for (let i = 0; i < this.desc.length; ++i) {
      if (this.desc[i][0] === x) {
        return i;
      }
    }
    return -1;
  };
  render() {
    const keys = Object.keys(this.props.information).filter(value => {
      for (let i = 0; i < this.desc.length; ++i) {
        if (this.desc[i][0] === value) {
          return true;
        }
      }
      return false;
    }).sort((a: string, b: string) => this.findDesc(a) - this.findDesc(b));
    return (
      <Descriptions className={this.props.className} title={this.props.title}>
        {keys.map(k => {
          const i = this.findDesc(k);
          let v = (this.props.information as any)[k];
          if (k === "sex") v = SEX()[v];
          if (k === "language") v = LANGUAGE()[v];
          if (k === "level") v = LEVEL()[v];
          if (k === "target") v = TARGET()[v];
          if (k === "createtime") v = unixToString(v);
          if (k === "payment") v += " " + intl.get("yuan");
          return <Item key={k} label={this.desc[i][1]}>{v}</Item>;
        })}
      </Descriptions>
    );
  }
}

export default UserDescriptions;
