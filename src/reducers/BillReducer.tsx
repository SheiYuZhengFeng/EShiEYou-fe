import { BillEntity } from "../services/GeneralAPI";
import { BillActionType } from "../actions/BillAction";

export interface BillState {
  balance: {
    status: number,
    data: number,
  },
  bills: {
    status: number,
    data: BillEntity[],
  },
}

const initialState : BillState = {
  balance: {
    status: 0,
    data: 0,
  },
  bills: {
    status: 0,
    data: [],
  },
}

const BillReducer = (state = initialState, action: Action) : BillState => {
  switch(action.type) {
    case BillActionType.BALANCEACTION:
      return {...state, balance: {status: 1, data: action.payload as number}};
    case BillActionType.BALANCEERRORACTION:
      return {...state, balance: {status: -1, data: 0}};
    case BillActionType.BILLACTION:
      return {...state, bills: {status: 1, data: action.payload as BillEntity[]}};
    case BillActionType.BILLERRORACTION:
      return {...state, bills: {status: -1, data: []}};
    default:
      return state;
  }
}

export default BillReducer;
