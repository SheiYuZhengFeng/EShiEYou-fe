import React from "react";
import styles from "./index.module.less";
import Combiner from "../../components/Combiner";
import QueueAnim from "rc-queue-anim";
import Introduction from "../../components/Introduction";

class Char extends React.Component {
  render() {
    return Combiner(
      <div className={styles.container}>
        <QueueAnim className={styles.whole} animConfig={[{translateY: [0, 30]}]}>
          <Introduction key="foreign" header="外教课程"
            img={[
              "https://gw.alipayobjects.com/zos/rmsportal/tXlLQhLvkEelMstLyHiN.svg",
              "https://gw.alipayobjects.com/zos/rmsportal/tXlLQhLvkEelMstLyHiN.svg",
              "https://gw.alipayobjects.com/zos/rmsportal/tXlLQhLvkEelMstLyHiN.svg",
            ]}
            title={[
              "Tom",
              "Tom",
              "Tom",
            ]}
            desc={[
              "盼望着，盼望着，东风来了，春天的脚步近了。一切都像刚睡醒的样子，欣欣然张开了眼。山朗润起来了，水涨起来了，太阳的脸",
              "盼望着，盼望着，东风来了，春天的脚步近了。一切都像刚睡醒的样子，欣欣然张开了眼。山朗润起来了，水涨起来了，太阳的脸",
              "盼望着，盼望着，东风来了，春天的脚步近了。一切都像刚睡醒的样子，欣欣然张开了眼。山朗润起来了，水涨起来了，太阳的脸",
            ]}
          />
          <Introduction key="native" header="中教课程"
            img={[
              "https://gw.alipayobjects.com/zos/rmsportal/tXlLQhLvkEelMstLyHiN.svg",
              "https://gw.alipayobjects.com/zos/rmsportal/tXlLQhLvkEelMstLyHiN.svg",
              "https://gw.alipayobjects.com/zos/rmsportal/tXlLQhLvkEelMstLyHiN.svg",
            ]}
            title={[
              "李某",
              "李某",
              "李某",
            ]}
            desc={[
              "盼望着，盼望着，东风来了，春天的脚步近了。一切都像刚睡醒的样子，欣欣然张开了眼。山朗润起来了，水涨起来了，太阳的脸",
              "盼望着，盼望着，东风来了，春天的脚步近了。一切都像刚睡醒的样子，欣欣然张开了眼。山朗润起来了，水涨起来了，太阳的脸",
              "盼望着，盼望着，东风来了，春天的脚步近了。一切都像刚睡醒的样子，欣欣然张开了眼。山朗润起来了，水涨起来了，太阳的脸",
            ]}
          />
          <Introduction key="platform" header="平台保障"
            img={[
              require("../../themes/images/char/nju.jpg"),
              require("../../themes/images/main/advantage/tixi.png"),
              require("../../themes/images/char/kefu.jpg"),
            ]}
            title={[
              "立足南大",
              "专业课程",
              "全程客服",
            ]}
            desc={[
              "我们是来自南京大学的创业团队，背靠南京大学外国语学院及创新创业中心，致力于为南大内外小语种爱好者提供专业的小语种线上教育",
              "我们以南京大学外国语学院教材为课程大纲，聘请留学生录制课程，通过南京大学外国语学院教师审核后，由就读于南大相关语种专业学生任教",
              "我们秉持着用户至上，追求极致的理念，从买课到上课，再到课后，全程多为客服跟进每位用户。确保学生和教师都能收获最佳服务体验",
            ]}
          />
        </QueueAnim>
      </div>
    );
  }
}

export default Char;
