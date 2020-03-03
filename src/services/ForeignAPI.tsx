import request from "../utils/request";

const prefix = "/foreign";

const MainAPI = {
  register(body: {username: string, name: string, password: string, sex: number, age: number, content: string, phone: string, language: number, qualification: string, background: string, resume: string}) : Promise<SimpleResponse> {
    return request(prefix + "/register", body, false);
  },
  me() : Promise<SimpleResponse & {data: {username: string, name: string, sex: number, age: number, createtime: number, content: string, phone: string, language: number, qualification: string, background: string, resume: string}}> {
    return request(prefix + "/me");
  },
  edit(body: {content: string}) : Promise<SimpleResponse> {
    return request(prefix + "/edit", body);
  },
};

const CourseAPI = {
  my() : Promise<SimpleResponse & {data: {courses: {cid: number, name: string, cost: number, discount: number, category: number, content: string, score: number, createtime: number, starttime: number, endtime: number}[]}}> {
    return request(prefix + "/course/my");
  },
};

const ForeignAPI = {main: MainAPI, course: CourseAPI};

export default ForeignAPI;