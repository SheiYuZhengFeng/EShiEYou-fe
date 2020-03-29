import React from "react";
import styles from "./index.module.less";
import Combiner from "../../components/Combiner";
import QueueAnim from "rc-queue-anim";
import Introduction from "../../components/Introduction";
import intl from "react-intl-universal";

class Char extends React.Component {
  render() {
    return Combiner(
      <div className={styles.container}>
        <QueueAnim className={styles.whole} animConfig={[{translateY: [0, 30]}]}>
          <Introduction key="foreign" header={intl.get("char_header_1")}
            img={[
              "https://gw.alipayobjects.com/zos/rmsportal/tXlLQhLvkEelMstLyHiN.svg",
              "https://gw.alipayobjects.com/zos/rmsportal/tXlLQhLvkEelMstLyHiN.svg",
              "https://gw.alipayobjects.com/zos/rmsportal/tXlLQhLvkEelMstLyHiN.svg",
            ]}
            title={[
              intl.get("char_title_1_1"),
              intl.get("char_title_1_2"),
              intl.get("char_title_1_3"),
            ]}
            desc={[
              intl.get("char_desc_1_1"),
              intl.get("char_desc_1_2"),
              intl.get("char_desc_1_3"),
            ]}
          />
          <Introduction key="platform" header={intl.get("char_header_2")}
            img={[
              require("../../themes/images/char/nju.jpg"),
              require("../../themes/images/main/advantage/tixi.png"),
              require("../../themes/images/char/kefu.jpg"),
            ]}
            title={[
              intl.get("char_title_2_1"),
              intl.get("char_title_2_2"),
              intl.get("char_title_2_3"),
            ]}
            desc={[
              intl.get("char_desc_2_1"),
              intl.get("char_desc_2_2"),
              intl.get("char_desc_2_3"),
            ]}
          />
        </QueueAnim>
      </div>
    );
  }
}

export default Char;
