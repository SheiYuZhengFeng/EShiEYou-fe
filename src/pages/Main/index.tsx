import React from 'react';
import styles from './index.module.less';
import Combiner from '../../components/Combiner';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

class Main extends React.Component {
  render() {
    return Combiner(
      <div className={styles.container}>
        <div className={styles.whole}>
          <Carousel className={styles.carousel} showThumbs={false} showStatus={false} autoPlay infiniteLoop emulateTouch interval={5000}>
            <div><img src={require("../../themes/images/main/carousel/jianjie.png")} alt="" /></div>
            <div><img src={require("../../themes/images/main/carousel/shizi.png")} alt="" /></div>
            <div><img src={require("../../themes/images/main/carousel/kecheng.png")} alt="" /></div>
          </Carousel>
        </div>
      </div>
    );
  }
}

export default Main;
