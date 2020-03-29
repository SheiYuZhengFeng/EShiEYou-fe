import React from 'react';
import styles from './index.module.less';
import Combiner from '../../components/Combiner';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import QueueAnim from 'rc-queue-anim';
import Introduction from '../../components/Introduction';
import intl from "react-intl-universal";

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
          <Introduction key="advantage" className={styles.advans} header={intl.get("main_header")}
            img={[
              require("../../themes/images/main/advantage/yiduiyi.png"),
              require("../../themes/images/main/advantage/tixi.png"),
              require("../../themes/images/main/advantage/shixi.png"),
            ]}
            title={[
              intl.get("main_title_1"),
              intl.get("main_title_2"),
              intl.get("main_title_3"),
            ]}
            desc={[
              intl.get("main_desc_1"),
              intl.get("main_desc_2"),
              intl.get("main_desc_3"),
            ]}
          />
        </QueueAnim>
      </div>
    );
  }
}

export default Main;
