import { clearMailAction, mailUserAction, mailUserErrorAction, refreshChatAction, chatAction, chatErrorAction } from "../actions/MailAction"
import GeneralAPI, { MailUser, MailEntity } from "../services/GeneralAPI";
import store from "../store";

export const makeMailAvailable = () => {

}

export const updateMailUsers = () => {
  clearMailAction();
  GeneralAPI.mail.getList().then(res => {
    if (res.code === 0) {
      mailUserAction(res.data.users as MailUser[]);
    }
    else {
      mailUserErrorAction();
    }
  });
}

export const updateChat = (index: number) => {
  const { users } = store.getState().MailReducer;
  refreshChatAction(users[index]);
  GeneralAPI.mail.getMail({id: users[index].id, category: users[index].category}).then(res => {
    if (res.code === 0) {
      chatAction(res.data.mails as MailEntity[]);
    }
    else {
      chatErrorAction();
    }
  });
}
