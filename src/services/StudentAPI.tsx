import request, { SimpleResponse } from "../utils/request";

const prefix = "/student";

const MainAPI = {
  register(body: {username: string, name: string, password: string, sex: number, age: number, category: number, level: number, target: number, content: string, phone: string}) : Promise<SimpleResponse> {
    return request(prefix + "/register", body, false);
  },
  me() : Promise<SimpleResponse | {data: {username: string, name: string, sex: number, age: number, category: number, level: number, target: number, createtime: number, content: string, phone: string}}> {
    return request(prefix + "/me");
  },
  edit(body: {category: number, level: number, target: number, content: string}) : Promise<SimpleResponse> {
    return request(prefix + "/edit", body);
  },
};

const OrderAPI = {
  my() : Promise<SimpleResponse | {data: {orders: {id: number, condition: number, cid: number, student: number, teacher: number, createtime: number, starttime: number, endtime: number}[]}}> {
    return request(prefix + "/order/my");
  },
  add(body: {cid: number, teacher: number, starttime: number, endtime: number}) : Promise<SimpleResponse> {
    return request(prefix + "/order/add", body);
  },
};

const CourseAPI = {
  my() : Promise<SimpleResponse | {data: {courses: {cid: number, name: string, catagory: number, starttime: number, endtime: number}[]}}> {
    return request(prefix + "/course/my");
  },
  teacher(body: {cid: number}) : Promise<SimpleResponse | {data: {teachers: {id: number, username: string, sex: number, age: number, content: string, qualification: string, backgroud: string, time: string}[]}}> {
    return request(prefix + "/course/teacher", body);
  },
  buy(body: {cid: number}) : Promise<SimpleResponse> {
    return request(prefix + "/course/buy", body);
  },
};

const StudentAPI = {main: MainAPI, order: OrderAPI, course: CourseAPI};

export default StudentAPI;