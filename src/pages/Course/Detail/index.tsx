import React from "react";
import styles from "./index.module.less";
import GeneralAPI, { CourseDetail, Video, VideoTitle, ForeignBrief, ForeignDetail } from "../../../services/GeneralAPI";
import { Spin, Empty, Tag, Collapse, Rate, Icon, Button, Modal, message, notification } from "antd";
import UserDescriptions, { CONST, GeneralUser, STUDENT } from "../../../components/UserDescriptions";
import QueueAnim from "rc-queue-anim";
import { RouteComponentProps, withRouter } from "react-router";
import Price from "../../../components/Price";
import store from "../../../store";
import StudentAPI from "../../../services/StudentAPI";
import { raiseOrderAction } from "../../../actions/CourseAction";
import { durationToTime, unixToString } from "../../../utils/datetime";
import { calcPrice } from "../../../utils/money";
import intl from "react-intl-universal";
import { toLoginAction } from "../../../actions/UserAction";

export interface DetailCourseConfig {
  cid: number,
  vid: number,
  buying: boolean,
  isMy: boolean,
}

class DetailCourse extends React.Component<{config: DetailCourseConfig} & RouteComponentProps, {status: number, data?: CourseDetail, video?: Video[] | VideoTitle[], foreign?: ForeignBrief | ForeignDetail}> {
  constructor(props: any) {
    super(props);
    this.state = {status: 3};
    const { cid } = this.props.config;
    GeneralAPI.course.getDetail({id: cid}).then(res => { // 获取课程详细
      if (res.code === 0) { this.setState((state) => {return {status: state.status - 1, data: res.data};}); return res.data.teacher; } // 抛出外教 id
      else this.setState({status: -1});
    }).then((id: number) => {
      const getForeign = this.props.config.isMy ? GeneralAPI.user.getForeignDetail : GeneralAPI.user.getForeignBrief;
      getForeign({id}).then(res => { // 获取外教信息
        if (res.code === 0) this.setState((state) => {return {status: state.status - 1, foreign: res.data};});
        else this.setState({status: -1});
      });
    });
    const getVideo = this.props.config.isMy ? GeneralAPI.course.getVideo : GeneralAPI.course.getVideoTitle;
    getVideo({id: cid}).then(res => { // 获取视频信息
      if (res.code === 0) this.setState((state) => {return {status: state.status - 1, video: res.data.videos};});
      else this.setState({status: -1});
    });
  }
  componentDidMount() {
    if (this.props.config.buying) {
      const checkForBuy = setInterval(() => {
        if (this.state.status !== 0) return;
        this.buyCourse();
        clearInterval(checkForBuy);
      }, 500);
    }
  }
  buyCourse = () => {
    if (!store.getState().UserReducer.loged) {
      message.error(intl.get("login_to_buy"));
      toLoginAction()
      this.props.history.push('/user', { redirect: this.props.history.location.pathname })
      return;
    }
    if (store.getState().UserReducer.session.category !== STUDENT) { message.error(intl.get("only_student_buy")); return; }
    const data = this.state.data as CourseDetail;
    const onOk = () => {
      StudentAPI.course.buy({cid: this.props.config.cid}).then(res => {
        if (res.code === 0) notification.success({
          message: intl.get("buy_course_success"),
          description: intl.get("buy_course_message", {name: data.name}),
          icon: <Icon type="smile" style={{ color: "green" }} />,
        });
        else message.error(intl.get("buy_course_fail"));
      });
    }
    Modal.confirm({
      title: intl.get("buying"),
      content: <>
        <div>{intl.get("course_name")}：{data.name}</div>
        <div>{intl.get("price")}：{calcPrice(data.cost, data.discount) + " " + intl.get("yuan")}</div>
        <div>{intl.get("confirm_buy_course_message")}</div>
      </>,
      okText: intl.get("confirm_buy"),
      cancelText: intl.get("not_sure"),
      onOk,
    });
  }
  toPlay = () => {
    message.error(intl.get("only_student_buy_play"));
  }
  toOrder = (id: number, name: string, vid: number, vname: string, e: React.MouseEvent<HTMLInputElement>) => {
    raiseOrderAction({cid: id, name, vid, vname});
    this.props.history.push("/mycourse/" + id + "/order");
  }
  render() {
    let component: JSX.Element;
    if (this.state.status > 0) component = <Spin size="large" />;
    else if (this.state.status < 0) component = <Empty description={intl.get("course_not_found")} />;
    else {
      const data = this.state.data as CourseDetail;
      const video = this.state.video as (Video & VideoTitle)[];
      component = (
        <QueueAnim className={styles.detail}>
          <div key="name" className={styles.name}><Tag className={styles.tag} color={CONST.color()[data.category]}>{CONST.language()[data.category]}</Tag>{data.name}</div>
          <div key="time" className={styles.time}>{intl.get("course_start_time")}：{unixToString(data.starttime)} ~ {unixToString(data.endtime)}</div>
          <div key="score" className={styles.score}><Rate disabled value={Math.round(data.score / 100 * 10) / 2} allowHalf /></div>
          <div key="content" className={styles.content}>{data.content}</div>
          <Collapse key="collapse" bordered={false}>
            <Collapse.Panel key="1" header={intl.get("native") + ' ' + intl.get("information")} className={styles.panel}>
              <UserDescriptions className={styles.teacher} title="" information={this.state.foreign as GeneralUser}></UserDescriptions>
            </Collapse.Panel>
          </Collapse>
          <div key="control" className={styles.control}>
            <div className={styles.buttons}>
              {this.props.config.isMy ? null : <Button className={styles.button} type="primary" onClick={this.buyCourse}>{intl.get("buy")}</Button>}
            </div>
            {this.props.config.isMy ? null : <Price cost={data.cost} discount={data.discount} extra />}
          </div>
            {this.props.config.isMy && store.getState().UserReducer.session.category === STUDENT ? <div key="tip">{intl.get("choose_video")}</div> : null}
          <div key="video" className={styles.video}>
            {video.map((v, i) => 
              <div key={i} className={styles.item + (v.vid === this.props.config.vid ? (" " + styles.active) : "")} onClick={this.props.config.isMy && store.getState().UserReducer.session.category === STUDENT ? this.toOrder.bind(this, this.props.config.cid, data.name, v.vid, v.vname) : this.toPlay}>
                <div className={styles.control}>
                  <Icon className={styles.play} type="play-circle" theme="filled" />
                  {v.duration ? <div className={styles.duration}>{durationToTime(v.duration)}</div> : null}
                </div>
                <div className={styles.title}>
                  {v.vname}
                </div>
              </div>
            )}
          </div>
        </QueueAnim>
      );
    }
    return (
      <div className={styles.whole}>
        <div key="back" className={styles.back} onClick={this.props.history.goBack}>
          <Icon type="left-circle" />
        </div>
        {component}
      </div>
    );
  }
}

export default withRouter(DetailCourse);
