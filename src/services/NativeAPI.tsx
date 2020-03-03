import request from "../utils/request";

const prefix = "/native";

const MainAPI = {
  register(body: {username: string, name: string, password: string, sex: number, age: number, content: string, phone: string, qualification: string, background: string, language: number}) : Promise<SimpleResponse> {
    return request(prefix + "/register", body, false);
  },
  me() : Promise<SimpleResponse & {data: {username: string, name: string, sex: number, age: number, createtime: number, content: string, phone: string, qualification: string, background: string, time: string, language: number}}> {
    return request(prefix + "/me");
  },
  edit(body: {content: string, time: string}) : Promise<SimpleResponse> {
    return request(prefix + "/edit", body);
  },
};

const OrderAPI = {
  list() : Promise<SimpleResponse & {data: {orders: {id: number, state: number, cid: number, student: number, createtime: number, starttime: number, endtime: number, rid: number}[]}}> {
    return request(prefix + "/order/list");
  },
  reply(body: {id: number, accept: boolean}) : Promise<SimpleResponse> {
    return request(prefix + "/order/reply", body);
  },
};

const NativeAPI = {main: MainAPI, order: OrderAPI};

export default NativeAPI;