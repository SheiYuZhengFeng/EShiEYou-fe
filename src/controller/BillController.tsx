import GeneralAPI, { BillEntity } from "../services/GeneralAPI"
import { balanceAction, balanceErrorAction, billAction, billErrorAction } from "../actions/BillAction";

export const updateAll = () => {
  updateBalance();
  updateBill();
}

export const updateBalance = () => {
  GeneralAPI.bill.balance().then(res => {
    if (res.code === 0) {
      balanceAction(res.data as number);
    }
    else {
      balanceErrorAction();
    }
  });
}

export const updateBill = () => {
  GeneralAPI.bill.list().then(res => {
    if (res.code === 0) {
      billAction((res.data as BillEntity[]).sort((a, b) => { return -a.createtime + b.createtime; }));
    }
    else {
      billErrorAction();
    }
  });
}
