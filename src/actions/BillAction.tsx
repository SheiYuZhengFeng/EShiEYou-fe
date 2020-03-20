import { BillEntity } from "../services/GeneralAPI"
import store from "../store";

export const BillActionType = {
  BALANCEACTION: "BALANCEACTION",
  BALANCEERRORACTION: "BALANCEERRORACTION",
  BILLACTION: "BILLACTION",
  BILLERRORACTION: "BILLERRORACTION",
}

export const balanceAction = (payload: number) => {
  store.dispatch({ type: BillActionType.BALANCEACTION, payload });
}

export const balanceErrorAction = () => {
  store.dispatch({ type: BillActionType.BALANCEERRORACTION });
}

export const billAction = (payload: BillEntity[]) => {
  store.dispatch({ type: BillActionType.BILLACTION, payload });
}

export const billErrorAction = () => {
  store.dispatch({ type: BillActionType.BILLERRORACTION });
}
