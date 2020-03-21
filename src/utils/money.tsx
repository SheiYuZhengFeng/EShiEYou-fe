export const calcPrice = (cost: number, discount: number) : number => {
  return Math.floor(cost * discount / 100) / 100;
}

export const convertMoney = (money: number) : string => {
  return (money / 100).toFixed(2);
}

export const signedMoney = (money: number) : string => {
  return money === 0 ? "0.00" : (money > 0 ? "+" : "") + convertMoney(money);
}
