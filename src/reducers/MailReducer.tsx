import { MailUser, MailEntity } from "../services/GeneralAPI";
import { MailActionType } from "../actions/MailAction";

export interface MailState {
  status: number,
  view: number,
  users: MailUser[],
  chat: {
    user: MailUser,
    status: number,
    mails: MailEntity[],
  },
}

const initialState : MailState = {
  status: 0,
  view: -1,
  users: [],
  chat: {
    user: {
      category: 0,
      id: 0,
      username: "",
    },
    status: 0,
    mails: [],
  },
}

const MailReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case MailActionType.CLEARMAIL:
      return initialState;
    case MailActionType.MAILUSER:
      return {...initialState, status: 1, users: action.payload as MailUser[]};
    case MailActionType.MAILUSERERROR:
      return {...initialState, status: -1};
    case MailActionType.REFRESHCHAT:
      return {...state, view: action.payload as number, chat: {user: state.users[action.payload], status: 0, mails: []}};
    case MailActionType.CHAT:
      return {...state, chat: {...state.chat, status: 1, mails: action.payload as MailEntity[]}};
    case MailActionType.CHATERROR:
      return {...state, chat: {...state.chat, status: -1}};
    default:
      return state;
  }
}

export default MailReducer;
