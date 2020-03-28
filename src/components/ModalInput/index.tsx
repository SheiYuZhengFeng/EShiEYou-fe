import React from "react";
import { Modal, Input } from "antd";
import intl from "react-intl-universal";

function ShowModalInput(title: string, callBack: (text: string) => void) {
  let text = "";
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    text = e.target.value;
  }
  Modal.confirm({
    title: title,
    content: (
      <div style={{marginTop: "2em"}}>
        <Input onChange={handleChange} />
      </div>
    ),
    maskClosable: true,
    okText: intl.get("ok"),
    cancelText: intl.get("cancel"),
    onOk: () => callBack(text),
  });
}

export default ShowModalInput;
