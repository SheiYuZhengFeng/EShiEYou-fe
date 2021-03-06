import request from "../utils/request";
import { OrderEntity } from "./StudentAPI";

const prefix = "/native";

const MainAPI = {
  register(body: {username: string, name: string, password: string, sex: number, age: number, content: string, phone: string, qualification: string, background: string, language: number, vcode: string}) : Promise<SimpleResponse> {
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
  list() : Promise<SimpleResponse & {data: {orders: OrderEntity[]}}> {
    return request(prefix + "/order/list");
  },
  reply(body: {id: number, accept: boolean}) : Promise<SimpleResponse> {
    return request(prefix + "/order/reply", body);
  },
  cancel(body: {id: number}) : Promise<SimpleResponse> {
    return request(prefix + "/order/cancel", body);
  },
};

const CourseAPI = {
  list() : Promise<SimpleResponse & {data: {courses: {cid: number, name: string, cost: number, discount: number, category: number, content: string, teacher: number, score: number, starttime: number, endtime: number}}}> {
    return request(prefix + "/course/list");
  },
};

const NativeAPI = {main: MainAPI, order: OrderAPI, course: CourseAPI};

export default NativeAPI;