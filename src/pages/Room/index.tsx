import React from "react";
import styles from "./index.module.less";
// import WS from "../../utils/ws";
import { RouteComponentProps, withRouter } from "react-router";
import store from "../../store";
import { message, Result, Spin, Slider, Icon, Button, Popconfirm } from "antd";
import { durationToTime } from "../../utils/datetime";
import { SliderValue } from "antd/lib/slider";
import WAVEInterface from "react-audio-recorder/dist/waveInterface";
import { NATIVE, STUDENT } from "../../components/UserDescriptions";
import intl from "react-intl-universal";

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
  connected: 1,
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
  // ws: WS;
  video: HTMLVideoElement | null | undefined;
  audio: HTMLAudioElement | null | undefined;
  isStudent: boolean;
  hide: any;
  waveInterface: WAVEInterface;
  sendWave: NodeJS.Timeout | undefined;
  heartBeat: NodeJS.Timeout;
  constructor(props: any) {
    super(props);
    this.state = initialRoomState;
    // this.ws = new WS("/room/" + this.props.match.params.rid + "/" + store.getState().UserReducer.session.token, this.onMessage, this.onOpen, this.onClose);
    this.isStudent = store.getState().UserReducer.session.category === STUDENT;
    this.waveInterface = new WAVEInterface();
    this.heartBeat = setTimeout(() => {
      // if (this.state.connected === 1 && !this.state.over && this.ws.ws.readyState === this.ws.ws.OPEN) {
        // this.ws.send("heartbeat", "");
      // }
      const { category } = store.getState().UserReducer.session
      if (category === NATIVE) {
        this.setState({...this.state, roomstate: { ...this.state.roomstate, student: true }})
      } else {
        this.setState({...this.state, roomstate: { ...this.state.roomstate, native: true }}) 
      }
      message.info('对方已经准备上课了！')
    }, 2000);
  }
  receiveControl = (play: boolean) => {
    if (play) message.info(intl.get("stream_play"));
    else message.info(intl.get("stream_pause"));
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
        if (roomstate.onclass) message.success(intl.get("class_begin"));
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
      if (!this.hide) this.hide = message.loading(intl.get("reconnecting"), 0);
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
    // this.ws = new WS("/room/" + this.props.match.params.rid + "/" + store.getState().UserReducer.session.token, this.onMessage, this.onOpen, this.onClose);
  }
  handleReady = () => {
    this.setState({
      ...this.state,
      roomstate: { student: true, native: true, onclass: true },
      playstate: {
        time: 0,
        progress: 20,
        duration: 14 * 60 + 27,
        url: 'https://box.nju.edu.cn/f/8079be06c4c54f168726/?dl=1'
      }
    })
    setTimeout(() => {
      if (this.video) {
        this.video.currentTime = 20;
        this.video.play();
      }
    }, 1000)
    // this.ws.send("ready", "");
    setInterval(() => {
      this.setState({...this.state, playstate: {...this.state.playstate, time: this.state.playstate.time + 1, progress: this.state.playstate.progress + 1}})
    }, 1000)
  }
  handleControl = (play: boolean) => {
    // this.ws.send(play ? "play" : "pause", "");
    this.receiveControl(play);
  }
  handleProgress = (value: SliderValue) => {
    // this.ws.send("progress", { progress: value as number });
    if (this.video) {
      this.video.currentTime = value as number;
    }
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
        // fileReader.onload = (e) => { this.ws.send("audio", (e.target as FileReader).result as string); }
        fileReader.readAsDataURL(audioData);
      }, 200);
    }
    this.setState({...this.state, audio: !this.state.audio});
  }
  handleOver = () => {
    // this.ws.send("over", "");
    this.setState({...this.state, over: true});
  }
  render() {
    let component: JSX.Element;
    if (this.state.over) component = <Result status="success" title={intl.get("class_over_title")} subTitle={intl.get("class_over_desc")} extra={<Button type="primary" onClick={this.handleBack}>{intl.get("back")}</Button>} />;
    else if (this.state.connected === -1) component = <Result status="403" title={intl.get("class_enter_fail_title")} subTitle={intl.get("class_enter_fail_desc")} extra={<><Button type="primary" onClick={this.handleRefresh}>{intl.get("refresh")}</Button><Button onClick={this.handleBack}>{intl.get("back")}</Button></>} />;
    else if (this.state.connected === 0) component = <><Spin size="large" />{intl.get("loading")}</>;
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
            <Cloud wrapped={<div className={styles.lasting}>{intl.get("class_time") + " " + durationToTime(this.state.playstate.time)}</div>} />
            {this.isStudent ? 
              <Popconfirm
                title={intl.get("confirm_to_over_ahead")}
                onConfirm={this.handleOver}
                okText={intl.get("ok")}
                cancelText={intl.get("cancel")}
              >
                <CloudButton title={intl.get("over_ahead")} />
              </Popconfirm>
            : null}
          </> : <>
            {(this.isStudent && !this.state.roomstate.student) || (!this.isStudent && !this.state.roomstate.native) ?
              <CloudButton title={((this.state.roomstate.student !== this.state.roomstate.native) ? (intl.get("other_side_ready") + "，") : "") + intl.get("ready_class")} onClick={this.handleReady} />
            : <>
              <CloudButton title={intl.get("waiting_other_ready")} />
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
