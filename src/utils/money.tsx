export const calcPrice = (cost: number, discount: number) : number => {
  return Math.floor(cost * discount / 100) / 100;
}

export const convertMoney = (money: number) : string => {
  return (money / 100).toFixed(2);
}
