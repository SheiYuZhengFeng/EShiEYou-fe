import React from 'react';
import styles from './index.module.less';
import Combiner from '../../components/Combiner';
import store from '../../store';
import { MailState } from '../../reducers/MailReducer';
import { makeMailAvailable, updateChat } from '../../controller/MailController';
import { Skeleton, Empty, Avatar, Icon, Input, Button, message } from 'antd';
import GeneralAPI, { MailEntity } from '../../services/GeneralAPI';
import TextArea from 'antd/lib/input/TextArea';
import QueueAnim from 'rc-queue-anim';

class Mail extends React.Component<{}, MailState> {
  constructor(props: any) {
    super(props);
    this.state = {...store.getState().MailReducer};
  }
  mailScroller: HTMLDivElement | null | undefined;
  textToSend: TextArea | null | undefined;
  scrollToBottom = () => {
    if (this.mailScroller) {
      const scrollHeight = this.mailScroller.scrollHeight;
      const height = this.mailScroller.clientHeight;
      const maxScrollTop = scrollHeight - height; 
      this.mailScroller.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }
  componentDidMount() {
    makeMailAvailable();
    this.scrollToBottom();
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }
  ss = store.subscribe(() => {
    this.setState({...this.state, ...store.getState().MailReducer});
  });
  componentWillUnmount() {
    this.ss();
  }
  handleSelect = (index: number) => {
    updateChat(index);
  }
  handleSend = () => {
    const { value } = (this.textToSend as TextArea).state;
    (this.textToSend as TextArea).setState({...(this.textToSend as TextArea).state, value: ""});
    if (!value) return;
    const { category, id } = this.state.users[this.state.view];
    GeneralAPI.mail.to({category, id, content: value}).then(res => {
      if (res.code === 0) {
        updateChat(this.state.view, false);
      }
      else {
        message.error("发送私信失败！");
      }
    });
  }
  render() {
    const isMine = (v: MailEntity) => {
      const { category, id } = this.state.users[this.state.view];
      if (category === v.category1 && id === v.id1) return true;
      return false;
    }
    const { state } = this;
    return Combiner(
      <div className={styles.container}>
        <QueueAnim className={styles.whole} animConfig={[{translateY: [0, 10], opacity: [1, 0]}]}>
          <div key="panel" className={styles.panel}>
            <div className={styles.list}>
              {state.status === 0 ? <><Skeleton active avatar /><Skeleton active avatar /><Skeleton active avatar /><Skeleton active avatar /></>
              : state.status === -1 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="加载失败" />
              : <>{state.users.map((v, i) => (
                <div key={i} className={styles.user + " " + (i === state.view ? styles.active : "")} onClick={i === state.view ? undefined : this.handleSelect.bind(this, i)}>
                  <Avatar className={styles.listavator} size="large">
                    {v.username}
                  </Avatar>
                  <div className={styles.listusername}>{v.username}</div>
                </div>
              ))}</>}
            </div>
            <div className={styles.chat}>
              {state.view === -1 ? <Icon type="message" theme="filled" className={styles.icon} /> : <>
                <div className={styles.title}>与 {state.chat.user.username} 的对话 </div>
                <div className={styles.mails} ref={(el) => { this.mailScroller = el; }}>
                  {state.chat.status === 0 ? <Skeleton active paragraph={{rows: 5}} />
                  : state.chat.status === -1 ? <Empty description="加载失败" />
                  : state.chat.mails.map((v, i) => (
                    <div key={i} className={styles.mail + " " + (isMine(v) ? styles.right : styles.left)}>
                      <div className={styles.time}>{new Date(v.time * 1000).toLocaleString()}</div>
                      <div className={styles.content}>{v.content}</div>
                    </div>
                  ))
                  }
                </div>
                <div className={styles.control}>
                  <Input.TextArea className={styles.input} autoSize={false} ref={(el) => { this.textToSend = el; }} />
                  <Button className={styles.send} type="primary" onClick={this.handleSend}>发送</Button>
                </div>
              </>}
            </div>
          </div>
        </QueueAnim>
      </div>
    );
  }
}

export default Mail;
