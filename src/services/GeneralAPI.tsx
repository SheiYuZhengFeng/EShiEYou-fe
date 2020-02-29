import request from "../utils/request";

const UserAPI = {
  login(body: {category: number, username: string, password: string}) : Promise<SimpleResponse & {data: {name: string, token: string}}> {
    return request("/user/login", body, false);
  },
  password(body: {oldpassword: string, newpassword: string}) : Promise<SimpleResponse> {
    return request("/user/password", body);
  },
  logout() : Promise<SimpleResponse> {
    return request("/user/logout");
  },
  getStudentBrief(body: {id: number}) : Promise<SimpleResponse & {data: {username: string, sex: number, age: number, language: number, level: number, target: number, content: string}}> {
    return request("/user/student/brief", body, false);
  },
  getNativeBrief(body: {id: number}) : Promise<SimpleResponse & {data: {username: string, sex: number, age: number, content: string, qualification: string, background: string, time: string, language: number}}> {
    return request("/user/native/brief", body, false);
  },
  getForeignBrief(body: {id: number}) : Promise<SimpleResponse & {data: {username: string, sex: number, age: number, content: string, language: number, qualification: string, background: string, resume: string}}> {
    return request("/user/foreign/brief", body, false);
  },
  getStudentDetail(body: {id: number}) : Promise<SimpleResponse & {data: {username: string, name: string, sex: number, age: number, language: number, level: number, target: number, content: string, phone: string}}> {
    return request("/user/student/detail", body);
  },
  getNativeDetail(body: {id: number}) : Promise<SimpleResponse & {data: {username: string, name: string, sex: number, age: number, content: string, phone: string, qualification: string, background: string, time: string, language: number}}> {
    return request("/user/native/detail", body);
  },
  getForeignDetail(body: {id: number}) : Promise<SimpleResponse & {data: {username: string, name: string, sex: number, age: number, content: string, phone: string, language: number, qualification: string, background: string, resume: string}}> {
    return request("/user/foreign/detail", body);
  },
};

const CourseAPI = {
  getList() : Promise<SimpleResponse & {data: {courses: {cid: number, name: string, cost: number, discount: number, category: number, content: string, starttime: number}[]}}> {
    return request("/course/list", undefined, false);
  },
  getDetail(body: {id: number}) : Promise<SimpleResponse & {data: {name: string, cost: number, discount: number, category: number, content: string, teacher: number, score: number, starttime: number, endtime: number}}> {
    return request("/course/detail", body, false);
  },
  getVideoTitle(body: {id: number}) : Promise<SimpleResponse & {data: {videos: {vid: number, vname: string, previd: number, nextvid: number}[]}}> {
    return request("/course/videotitle", body, false);
  },
  getVideo(body: {id: number}) : Promise<SimpleResponse & {data: {videos: {vid: number, vname: string, duration: number, url: string, previd: number, nextvid: number}[]}}> {
    return request("/course/video", body);
  },
};

const MailAPI = {
  to(body: {category: number, id: number, content: string}) : Promise<SimpleResponse> {
    return request("/mail/to", body);
  },
  getList() : Promise<SimpleResponse & {data: {users: {category: number, id: number}[]}}> {
    return request("/mail/list");
  },
  getMail(body: {category: number, id: number}) : Promise<SimpleResponse & {data: {mails: {category1: number, id1: number, category2: number, id2: number, time: number, content: string}[]}}> {
    return request("/mail/get", body);
  },
};

const GeneralAPI = {user: UserAPI, course: CourseAPI, mail: MailAPI};

export default GeneralAPI;