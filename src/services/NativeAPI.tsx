import request from "../utils/request";

const prefix = "/native";

const MainAPI = {
  register(body: {username: string, name: string, password: string, sex: number, age: number, content: string, phone: string, qualification: string, background: string, language: number}) : Promise<SimpleResponse> {
    return request(prefix + "/register", body, false);
  },
  me() : Promise<SimpleResponse & {data: {username: string, name: string, sex: number, age: number, createtime: number, content: string, phone: string, qualification: string, background: string, payment: number, time: string, language: number}}> {
    return request(prefix + "/me");
  },
  edit(body: {content: string, time: string}) : Promise<SimpleResponse> {
    return request(prefix + "/edit", body);
  },
};

const OrderAPI = {
  list() : Promise<SimpleResponse & {data: {orders: {id: number, state: number, cid: number, student: number, createtime: number, starttime: number, endtime: number}[]}}> {
    return request(prefix + "/order/list");
  },
  reply(body: {id: number, accept: boolean}) : Promise<SimpleResponse> {
    return request(prefix + "/order/reply", body);
  },
};

const BillAPI = {
  list() : Promise<SimpleResponse & {data: {bills: {id: number, status: number, cost: number, createtime: number}[]}}> {
    return request(prefix + "/bill/list");
  },
  pay(body: {cost: number}) : Promise<SimpleResponse> {
    return request(prefix + "/bill/pay", body);
  },
};

const NativeAPI = {main: MainAPI, bill: BillAPI, order: OrderAPI};

export default NativeAPI;