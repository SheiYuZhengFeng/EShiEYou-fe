import React, { useState, useEffect } from "react";
import { Modal, Spin, Empty } from "antd";
import UserDescriptions, { CONST, GeneralUser, STUDENT, NATIVE } from "..";
import GeneralAPI from "../../../services/GeneralAPI";
import intl from "react-intl-universal";

function WithModal(props: {f: (data: {id: number}) => Promise<SimpleResponse>, id: number}) {
  const [status, setStatus] = useState(0);
  const [data, setData] = useState({});

  useEffect(() => {
    if (status === 0) {
      props.f({id: props.id}).then(res => {
        if (res.code === 0) {
          setData(res.data as GeneralUser);
          setStatus(1);
        }
        else {
          setStatus(-1);
        }
      });
    }
  }, [props, status]);

  return status === 1 ? <UserDescriptions title="" information={data} /> : status === 0 ? <Spin /> : <Empty description={intl.get("fetch_error")} />;
}

function ShowUserDescriptions(category: number, id: number, detailed : boolean = false) {
  let fn: (body: {id: number}) => Promise<SimpleResponse>;
  if (detailed) {
    if (category === STUDENT) fn = GeneralAPI.user.getStudentDetail;
    else if (category === NATIVE) fn = GeneralAPI.user.getNativeDetail;
    else fn = GeneralAPI.user.getForeignDetail;
  }
  else {
    if (category === STUDENT) fn = GeneralAPI.user.getStudentBrief;
    else if (category === NATIVE) fn = GeneralAPI.user.getNativeBrief;
    else fn = GeneralAPI.user.getForeignBrief;
  }
  Modal.info({
    title: CONST.categoty()[category] + " " + intl.get("information"),
    content: <div style={{marginTop: "2em"}}><WithModal f={fn} id={id} /></div>,
    maskClosable: true,
    okText: intl.get("close"),
    width: 600,
  });
}

export default ShowUserDescriptions;
