import store from "../store"
import { MailUser, MailEntity } from "../services/GeneralAPI";

export const MailActionType = {
  CLEARMAIL: "CLEARMAIL",
  MAILUSER: "MAILUSER",
  MAILUSERERROR: "MAILUSERERROR",
  REFRESHCHAT: "REFRESHCHAT",
  CHAT: "CHAT",
  CHATERROR: "CHATERROR",
}

export const clearMailAction = () => {
  store.dispatch({ type: MailActionType.CLEARMAIL });
}

export const mailUserAction = (payload: MailUser[]) => {
  store.dispatch({ type: MailActionType.MAILUSER, payload });
}

export const mailUserErrorAction = () => {
  store.dispatch({ type: MailActionType.MAILUSERERROR });
}

export const refreshChatAction = (payload: number) => {
  store.dispatch({ type: MailActionType.REFRESHCHAT, payload });
}

export const chatAction = (payload: MailEntity[]) => {
  store.dispatch({ type: MailActionType.CHAT, payload });
}

export const chatErrorAction = () => {
  store.dispatch({ type: MailActionType.CHATERROR });
}
