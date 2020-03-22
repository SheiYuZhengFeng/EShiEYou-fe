import React from 'react';
import styles from './index.module.less';
import Combiner from '../../components/Combiner';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import QueueAnim from 'rc-queue-anim';
import Introduction from '../../components/Introduction';

class Main extends React.Component {
  render() {
    return Combiner(
      <div className={styles.container}>
        <QueueAnim className={styles.whole} interval={0} animConfig={[{translateY: [0, 30]}]}>
          <Carousel key="carousel" className={styles.carousel} showThumbs={false} showStatus={false} autoPlay infiniteLoop emulateTouch interval={5000}>
            <div><img src={require("../../themes/images/main/carousel/jianjie.png")} alt="" /></div>
            <div><img src={require("../../themes/images/main/carousel/shizi.png")} alt="" /></div>
            <div><img src={require("../../themes/images/main/carousel/kecheng.png")} alt="" /></div>
          </Carousel>
          <Introduction key="advantage" className={styles.advans} header="我们的优势"
            img={[
              require("../../themes/images/main/advantage/yiduiyi.png"),
              require("../../themes/images/main/advantage/tixi.png"),
              require("../../themes/images/main/advantage/shixi.png"),
            ]}
            title={[
              "全程一对一教学",
              "完备的课程体系",
              "实习兼职一网打尽",
            ]}
            desc={[
              "对每位学习者，配备一名外教+一名中教+多位客服，致力于打造最完美的学习体验",
              "所有课程均由南京大学外国语学院老师进行审核，任教的国内外高校学生资历透明",
              "如果你是国内外高校小语种专业的同学，欢迎你加入E师亦友平台",
            ]}
          />
        </QueueAnim>
      </div>
    );
  }
}

export default Main;
