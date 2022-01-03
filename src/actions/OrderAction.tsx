import { OrderEntity } from "../services/StudentAPI"
import store from "../store"

export const OrderActionType = {
  ORDERLIST: "ORDERLIST",
  CLEARORDERLIST: "CLEARORDERLIST",
  ORDEREXPAND: "ORDEREXPAND",
}

export const orderListAction = (payload: OrderEntity[]) => {
  store.dispatch({ type: OrderActionType.ORDERLIST, payload });
}

export const clearOrderListAction = () => {
  store.dispatch({ type: OrderActionType.CLEARORDERLIST });
}

export const expandOrderAction = (payload: string[]) => {
  store.dispatch({ type: OrderActionType.ORDEREXPAND, payload });
}
