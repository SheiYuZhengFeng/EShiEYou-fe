import request from "../utils/request";

const prefix = "/student";

export interface CourseTeacher {
  id: number,
  username: string,
  sex: number,
  age: number,
  content: string,
  qualification: string,
  background: string,
  time: string,
}

export interface OrderEntity {
  id: number,
  state: number,
  cid: number,
  student: number,
  teacher: number,
  createtime: number,
  starttime: number,
  endtime: number,
  rid: number,
  vid: number,
}

const MainAPI = {
  register(body: {username: string, name: string, password: string, sex: number, age: number, language: number, level: number, target: number, content: string, phone: string, vcode: string}) : Promise<SimpleResponse> {
    return request(prefix + "/register", body, false);
  },
  me() : Promise<SimpleResponse & {data: {username: string, name: string, sex: number, age: number, language: number, level: number, target: number, createtime: number, content: string, phone: string}}> {
    return request(prefix + "/me");
  },
  edit(body: {language: number, level: number, target: number, content: string}) : Promise<SimpleResponse> {
    return request(prefix + "/edit", body);
  },
};

const OrderAPI = {
  my() : Promise<SimpleResponse & {data: {orders: OrderEntity[]}}> {
    return request(prefix + "/order/my");
  },
  add(body: {cid: number, vid: number, teacher: number, starttime: number, endtime: number}) : Promise<SimpleResponse> {
    return request(prefix + "/order/add", body);
  },
  cancel(body: {id: number}) : Promise<SimpleResponse> {
    return request(prefix + "/order/cancel", body);
  },
};

const CourseAPI = {
  my() : Promise<SimpleResponse & {data: {courses: {cid: number, name: string, catagory: number, starttime: number, endtime: number}[]}}> {
    return request(prefix + "/course/my");
  },
  teacher(body: {cid: number}) : Promise<SimpleResponse & {data: {teachers: CourseTeacher[]}}> {
    return request(prefix + "/course/teacher", body);
  },
  buy(body: {cid: number}) : Promise<SimpleResponse> {
    return request(prefix + "/course/buy", body);
  },
};

const StudentAPI = {main: MainAPI, order: OrderAPI, course: CourseAPI};

export default StudentAPI;