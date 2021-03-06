import { clearMailAction, mailUserAction, mailUserErrorAction, refreshChatAction, chatAction, chatErrorAction } from "../actions/MailAction"
import GeneralAPI, { MailUser, MailEntity } from "../services/GeneralAPI";
import store from "../store";
import { SYSTEM } from "../components/UserDescriptions";

export const makeMailAvailable = () => {
  if (store.getState().MailReducer.status <= 0) {
    updateMailUsers();
  }
}

export const updateMailUsers = () => {
  clearMailAction();
  GeneralAPI.mail.getList().then(res => {
    if (res.code === 0) {
      mailUserAction((res.data.users as MailUser[]).sort((a, b) => {
        if (a.category === SYSTEM) return -1;
        else if (b.category === SYSTEM) return 1;
        return b.time - a.time;
      }));
    }
    else {
      mailUserErrorAction();
    }
  });
}

export const updateChat = (index: number, refresh = true) => {
  const { users } = store.getState().MailReducer;
  if (refresh) refreshChatAction(index);
  GeneralAPI.mail.getMail({id: users[index].id, category: users[index].category}).then(res => {
    if (res.code === 0) {
      chatAction((res.data.mails as MailEntity[]).sort((a, b) => (a.time - b.time)));
    }
    else {
      chatErrorAction();
    }
  });
}
