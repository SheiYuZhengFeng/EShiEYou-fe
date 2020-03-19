import React from "react";
import styles from "./index.module.less";
import WS from "../../utils/ws";
import { RouteComponentProps, withRouter } from "react-router";
import store from "../../store";
import { message, Result, Spin, Slider, Icon, Button, Popconfirm } from "antd";
import { durationToTime } from "../../utils/datetime";
import { SliderValue } from "antd/lib/slider";
import WAVEInterface from "react-audio-recorder/dist/waveInterface";
import { STUDENT } from "../../components/UserDescriptions";

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
    url: string,
  },
  over: boolean,
  audio: boolean,
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
    url: "",
  },
  over: false,
  audio: false,
};

function Cloud(props: {wrapped: JSX.Element}) {
  return (
    <div className={styles.cloud}>
      {props.wrapped}
    </div>
  );
}

function CloudButton(props: {title: string | JSX.Element, onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void}) {
  return (
    <div className={styles.box + " " + styles.cloudbutton} onClick={props.onClick}>
      {props.title}
    </div>
  );
}

class Room extends React.Component<RouteComponentProps<{rid: string}>, RoomState> {
  ws: WS;
  video: HTMLVideoElement | null | undefined;
  audio: HTMLAudioElement | null | undefined;
  isStudent: boolean;
  hide: any;
  waveInterface: WAVEInterface;
  sendWave: NodeJS.Timeout | undefined;
  constructor(props: any) {
    super(props);
    this.state = initialRoomState;
    this.ws = new WS("/room/" + this.props.match.params.rid + "/" + store.getState().UserReducer.session.token, this.onMessage, this.onOpen, this.onClose);
    this.isStudent = store.getState().UserReducer.session.category === STUDENT;
    this.waveInterface = new WAVEInterface();
  }
  receiveControl = (play: boolean) => {
    if (play) message.info("播放继续");
    else message.info("播放暂停");
    if (this.video) {
      if (play) this.video.play();
      else this.video.pause();
    }
  }
  onMessage = (code: string, data: string) => {
    if (this.state.over) return;
    console.log("receive: " + code + ", " + data);
    switch(code){
      case "state":
        const roomstate = JSON.parse(data);
        this.setState({...this.state, connected: 1, roomstate});
        if (roomstate.onclass) message.success("开始上课！");
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
    this.ws.send("ready", store.getState().UserReducer.session.category === STUDENT ? "student" : "teacher");
  }
  handleControl = (play: boolean) => {
    this.ws.send(play ? "play" : "pause", "");
    this.receiveControl(play);
  }
  handleProgress = (value: SliderValue) => {
    this.ws.send("progress", { progress: value as number });
  }
  handleMicrophone = () => {
    if (this.state.audio) {
      if (this.sendWave) clearInterval(this.sendWave);
      this.sendWave = undefined;
      this.waveInterface.reset();
    }
    else {
      this.waveInterface.reset();
      this.waveInterface.startRecording();
      this.sendWave = setInterval(() => {
        const { audioData } = this.waveInterface;
        this.waveInterface.buffers = [[], []];
        const fileReader = new FileReader();
        fileReader.onload = (e) => { this.ws.send("audio", (e.target as FileReader).result as string); }
        fileReader.readAsDataURL(audioData);
      }, 200);
    }
    this.setState({...this.state, audio: !this.state.audio});
  }
  handleOver = () => {
    this.ws.send("over", "");
    this.setState({...this.state, over: true});
  }
  render() {
    let component: JSX.Element;
    if (this.state.over) component = <Result status="success" title="下课了！" subTitle="本次课程已完成！" extra={<Button type="primary" onClick={this.handleBack}>返回</Button>} />;
    else if (this.state.connected === -1) component = <Result status="403" title="无法加入课堂" subTitle="是不是网络不好或者进错房间了？" extra={<><Button type="primary" onClick={this.handleRefresh}>刷新</Button><Button onClick={this.handleBack}>返回</Button></>} />;
    else if (this.state.connected === 0) component = <><Spin size="large" />正在加载...</>;
    else component = (
      <>
        <div className={styles.player}>
          {this.state.playstate.url === "" ?
            <div className={styles.novideo + " " + styles.box}>
              <Icon type="video-camera" theme="filled" className={styles.camera} />
            </div>
          : 
            <video className={styles.video + " " + styles.box} src={this.state.playstate.url} ref={(e) => { this.video = e; }} />
          }
          <audio style={{display: "none"}} ref={(e) => { this.audio = e; }} autoPlay />
        </div>
        <div className={styles.panel}>
          {this.state.roomstate.onclass ? <>
            <CloudButton title={<Icon className={this.state.audio ? styles.audio : ""} type="audio" theme="filled" />} onClick={this.handleMicrophone} />
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
            <Popconfirm
              title={"确定要" + (this.isStudent ? "提前" : "") + "下课吗？"}
              onConfirm={this.handleOver}
              okText="确定"
              cancelText="取消"
            >
              <CloudButton title={(this.isStudent ? "提前" : "") + "下课"} />
            </Popconfirm>
          </> : <>
            {(this.isStudent && !this.state.roomstate.student) || (!this.isStudent && !this.state.roomstate.native) ?
              <CloudButton title={((this.state.roomstate.student !== this.state.roomstate.native) ? "对方已准备，" : "") + "准备上课"} onClick={this.handleReady} />
            : <>
              <CloudButton title={"你已准备，等待对方准备"} />
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
