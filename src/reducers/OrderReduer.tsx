import { OrderActionType } from "../actions/OrderAction";
import { OrderEntity } from "../services/StudentAPI";

const initialState: {status: number, order: OrderEntity[]} = {
  status: 0,
  order: [],
}

const OrderReducer = (state = initialState, action: Action) => {
  switch(action.type) {
    case OrderActionType.ORDERLIST:
      return {...state, order: action.payload as OrderEntity[], status: 1};
    case OrderActionType.CLEARORDERLIST:
      return {...state, order: [], status: 0};
    default:
      return state;
  }
}

export default OrderReducer;
