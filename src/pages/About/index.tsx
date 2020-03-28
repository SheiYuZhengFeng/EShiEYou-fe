import React from "react";
import styles from "./index.module.less";
import Combiner from "../../components/Combiner";
import QueueAnim from 'rc-queue-anim';
import intl from "react-intl-universal";

class About extends React.Component {
  Values: {img: string, title: string}[] = [
    {
      img: require("../../themes/images/about/zhuanzhu.png"),
      title: intl.get("about_1"),
    },
    {
      img: require("../../themes/images/about/dingzhi.png"),
      title: intl.get("about_2"),
    },
    {
      img: require("../../themes/images/about/gongxiang.png"),
      title: intl.get("about_3"),
    },
  ];
  render() {
    return Combiner(
      <div className={styles.container}>
        <div className={styles.whole}>
          <QueueAnim className={styles.values} interval={300}>
            {this.Values.map((v, i) => (
              <div key={i} className={styles.value}>
                <img src={v.img} alt={v.title} />
                <div className={styles.title}>{v.title}</div>
              </div>
            ))}
          </QueueAnim>
        </div>
      </div>
    );
  }
}

export default About;
