import React from 'react';
import styles from './index.module.less';
import Combiner from '../../components/Combiner';
import store from '../../store';
import { MailState } from '../../reducers/MailReducer';
import { makeMailAvailable, updateChat } from '../../controller/MailController';
import { Skeleton, Empty, Avatar } from 'antd';

class Mail extends React.Component<{}, MailState> {
  constructor(props: any) {
    super(props);
    this.state = {...store.getState().MailReducer};
  }
  componentDidMount() {
    makeMailAvailable();
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
  render() {
    const { state } = this;
    return Combiner(
      <div className={styles.container}>
        <div className={styles.whole}>
          <div className={styles.panel}>
            <div className={styles.list}>
              {state.status === 0 ? <><Skeleton active avatar /><Skeleton active avatar /><Skeleton active avatar /><Skeleton active avatar /></>
              : state.status === -1 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="加载失败" />
              : <>{state.users.map((v, i) => (
                <div key={i} className={styles.user + " " + (i === state.view ? styles.active : "")} onClick={this.handleSelect.bind(this, i)}>
                  <Avatar className={styles.listavator} size="large">
                    {v.username}
                  </Avatar>
                  <div className={styles.listusername}>{v.username}</div>
                </div>
              ))}</>}
            </div>
            <div className={styles.chat}>
              {state.chat.status === 0 ? <Skeleton active paragraph={{rows: 5}} />
              : state.chat.status === -1 ? <Empty description="加载失败" />
              : <></>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Mail;
