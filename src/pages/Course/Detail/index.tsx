import React from "react";
import styles from "./index.module.less";
import GeneralAPI, { CourseDetail, Video, VideoTitle, ForeignBrief, ForeignDetail } from "../../../services/GeneralAPI";
import { Spin, Empty, Tag, Collapse, Rate, Icon, Button, Modal, message, notification } from "antd";
import UserDescriptions, { CONST, GeneralUser } from "../../../components/UserDescriptions";
import QueueAnim from "rc-queue-anim";
import { RouteComponentProps, withRouter } from "react-router";
import Price, { calcPrice } from "../../../components/Price";
import store from "../../../store";
import StudentAPI from "../../../services/StudentAPI";
import { raiseOrderAction } from "../../../actions/CourseAction";

export interface DetailCourseConfig {
  cid: number,
  buying: boolean,
  isMy: boolean,
}

const durationToTime = (d: number) => {
  let h = Math.floor(d / 3600), m = Math.floor((d % 3600) / 3600), s = d % 60;
  let t = "";
  if (m < 10) t = "0" + m;
  else t = m.toString();
  if (s < 10) t = t + ":0" + s;
  else t = t + ":" + s;
  if (h > 0) t = h + ":" + t;
  return t;
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
    if (!store.getState().UserReducer.loged) { message.error("请先登录后购买！"); return; }
    if (store.getState().UserReducer.session.category !== 0) { message.error("只有学生身份才能购买课程！"); return; }
    const data = this.state.data as CourseDetail;
    const onOk = () => {
      StudentAPI.course.buy({cid: this.props.config.cid}).then(res => {
        if (res.code === 0) notification.success({
          message: "课程购买成功",
          description: "你可以在“已购课程”中找到刚才购买的“" + data.name + "”，开始你的学习之旅吧！",
          icon: <Icon type="smile" style={{ color: "green" }} />,
        });
        else message.error("购买失败，请检查你是否已购买过本课程，以及余额是否充足！");
      });
    }
    Modal.confirm({
      title: "即将购买",
      content: <>
        <div>课程名：{data.name}</div>
        <div>价格：{calcPrice(data.cost, data.discount)}元</div>
        <div>完成购买后你将可以学习本课程，是否确认购买？</div>
      </>,
      okText: "确认购买",
      cancelText: "我再看看",
      onOk,
    });
  }
  toPlay = (url: string | undefined) => {
    if (!url) message.error("请先购买课程后观看！");
    else this.props.history.push(url);
  }
  toOrder = (id: number, name: string, e: React.MouseEvent<HTMLInputElement>) => {
    raiseOrderAction({cid: id, name});
    this.props.history.push("/mycourse/" + id + "/order");
  }
  render() {
    let component: JSX.Element;
    if (this.state.status > 0) component = <Spin size="large" />;
    else if (this.state.status < 0) component = <Empty description="没有找到这门课程" />;
    else {
      const data = this.state.data as CourseDetail;
      const video = this.state.video as (Video & VideoTitle)[];
      component = (
        <QueueAnim className={styles.detail}>
          <div key="name" className={styles.name}><Tag className={styles.tag} color={CONST.color[data.category]}>{CONST.language[data.category]}</Tag>{data.name}</div>
          <div key="time" className={styles.time}>开课时间：{new Date(data.starttime * 1000).toLocaleString()} ~ {new Date(data.endtime * 1000).toLocaleString()}</div>
          <div key="score" className={styles.score}><Rate disabled value={Math.round(data.score / 100 * 10) / 2} allowHalf /></div>
          <div key="content" className={styles.content}>{data.content}</div>
          <Collapse key="collapse" bordered={false}>
            <Collapse.Panel key="1" header="外教信息" className={styles.panel}>
              <UserDescriptions className={styles.teacher} title="" information={this.state.foreign as GeneralUser}></UserDescriptions>
            </Collapse.Panel>
          </Collapse>
          <div key="control" className={styles.control}>
            <div className={styles.buttons}>
              {this.props.config.isMy ? null : <Button className={styles.button} type="primary" onClick={this.buyCourse}>购买</Button>}
              {this.props.config.isMy && store.getState().UserReducer.session.category === 0 ? <Button className={styles.button} type="primary" onClick={this.toOrder.bind(this, this.props.config.cid, data.name)}>预约上课</Button> : null}
            </div>
            {this.props.config.isMy ? null : <Price cost={data.cost} discount={data.discount} extra />}
          </div>
          <div key="video" className={styles.video}>
            {video.map((v, i) => 
              <div key={i} className={styles.item} onClick={this.toPlay.bind(this, v.url)}>
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
