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

};

const CourseAPI = {

};

const StudentAPI = {main: MainAPI, order: OrderAPI, course: CourseAPI};

export default StudentAPI;