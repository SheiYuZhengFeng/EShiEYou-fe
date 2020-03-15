import React from "react";
import styles from "./index.module.less";
import WS from "../../utils/ws";
import { RouteComponentProps, withRouter } from "react-router";
import store from "../../store";
import { message, Result, Spin, Slider, Icon, Button } from "antd";
import { durationToTime } from "../../utils/datetime";
import { SliderValue } from "antd/lib/slider";

interface RoomState {
  connected: number,
  roomstate: {
    student: boolean,
    native: boolean,
    onclass: boolean,
  },
  playstate: {
    time: number,
    progress: number,
    duration: number,
  },
  over: boolean,
}

const initialRoomState: RoomState = {
  connected: 0,
  roomstate: {
    student: false,
    native: false,
    onclass: false,
  },
  playstate: {
    time: 0,
    progress: 0,
    duration: 1,
  },
  over: false,
};

function Cloud(props: {wrapped: JSX.Element}) {
  return (
    <div className={styles.cloud}>
      {props.wrapped}
    </div>
  );
}

function CloudButton(props: {title: string | JSX.Element, onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void}) {
  return (
    <div className={styles.box + " " + styles.cloudbutton} onClick={props.onClick}>
      {props.title}
    </div>
  );
}

class Room extends React.Component<RouteComponentProps<{rid: string}>, RoomState> {
  ws: WS;
  video: HTMLImageElement | null | undefined;
  audio: HTMLAudioElement | null | undefined;
  isStudent: boolean;
  hide: any;
  constructor(props: any) {
    super(props);
    this.state = initialRoomState;
    this.ws = new WS("/room/" + this.props.match.params.rid + "/" + store.getState().UserReducer.session.token, this.onMessage, this.onOpen, this.onClose);
    this.isStudent = store.getState().UserReducer.session.category === 0;
  }
  receiveControl = (play: boolean) => {
    if (play) message.info("播放继续");
    else message.info("播放暂停");
  }
  onMessage = (code: string, data: string) => {
    if (this.state.over) return;
    console.log("receive: " + code + ", " + data);
    switch(code){
      case "state":
        this.setState({...this.state, connected: 1, roomstate: JSON.parse(data)});
        break;
      case "video":
        if (this.video) this.video.src = data;
        break;
      case "audio":
        if (this.audio) this.audio.src = data;
        break;
      case "pause":
        this.receiveControl(false);
        break;
      case "play":
        this.receiveControl(true);
        break;
      case "time":
        this.setState({...this.state, playstate: JSON.parse(data)});
        break;
      case "over":
        this.setState({...this.state, over: true});
        break;
    }
  }
  onOpen = () => {
    console.log("open");
    this.hide();
    this.hide = null;
  }
  onClose = () => {
    console.log("close");
    if (this.state.connected === 1 && !this.state.over) {
      if (!this.hide) this.hide = message.loading("断开连接，正在重连...", 0);
      this.handleRefresh();
    }
    else if (this.state.connected === 0) {
      this.setState({...initialRoomState, connected: -1});
    }
  }
  handleBack = () => {
    this.props.history.push("/order");
  }
  handleRefresh = () => {
    this.setState(initialRoomState);
    this.ws = new WS("/room/" + this.props.match.params.rid + "/" + store.getState().UserReducer.session.token, this.onMessage, this.onOpen, this.onClose);
  }
  handleReady = () => {
    // TODO: 发送准备消息
  }
  handleUrge = () => {
    // TODO: 发送催促消息
  }
  handleControl = (play: boolean) => {
    // TODO: 发送控制消息
    this.receiveControl(play);
  }
  handleProgress = (value: SliderValue) => {
    // TODO: 发送调整进度消息
  }
  handleMicrophone = () => {
    // TODO: 控制麦克风
  }
  handleOver = () => {
    // TODO: 发送下课消息
  }
  render() {
    let component: JSX.Element;
    if (this.state.over) component = <Result status="success" title="下课了！" subTitle="本次课程已完成！" extra={<Button type="primary" onClick={this.handleBack}>返回</Button>} />;
    else if (this.state.connected === -1) component = <Result status="403" title="无法加入课堂" subTitle="是不是网络不好或者进错房间了？" extra={<Button type="primary" onClick={this.handleRefresh}>刷新</Button>} />;
    else if (this.state.connected === 0) component = <><Spin size="large" />正在加载...</>;
    else component = (
      <>
        <div className={styles.player}>
          <img className={styles.video + " " + styles.box} alt="视频画面" ref={(e) => { this.video = e; }} />
          <audio style={{display: "none"}} ref={(e) => { this.audio = e; }} />
        </div>
        <div className={styles.panel}>
          {this.state.roomstate.onclass ? <>
            <CloudButton title={<Icon type="audio" theme="filled" />} onClick={this.handleMicrophone} />
            <CloudButton title={<Icon type="caret-right" theme="filled" />} onClick={this.handleControl.bind(this, true)} />
            <CloudButton title={<Icon type="pause" />} onClick={this.handleControl.bind(this, false)} />
            <Cloud wrapped={<Slider className={styles.progress}
              tipFormatter={value => durationToTime(value) + " / " + durationToTime(this.state.playstate.duration)}
              tooltipPlacement="bottom"
              min={0}
              max={this.state.playstate.duration}
              defaultValue={this.state.playstate.progress}
              onAfterChange={this.handleProgress}
            />} />
            <Cloud wrapped={<div className={styles.lasting}>已上课 {durationToTime(this.state.playstate.time)}</div>} />
            <CloudButton title={(this.isStudent ? "提前" : "") + "下课"} onClick={this.handleOver} />
          </> : <>
            {(this.isStudent && !this.state.roomstate.student) || (!this.isStudent && !this.state.roomstate.native) ?
              <CloudButton title={((this.state.roomstate.student !== this.state.roomstate.native) ? "对方已准备，" : "") + "准备上课"} onClick={this.handleReady} />
            : <>
              <CloudButton title={"你已准备，催促" + (this.isStudent ? "中教" : "学生") + "准备"} onClick={this.handleUrge} />
            </>}
          </>}
        </div>
      </>
    );
    return (
      <div className={styles.whole}>
        {component}
      </div>
    );
  }
}

export default withRouter(Room);
