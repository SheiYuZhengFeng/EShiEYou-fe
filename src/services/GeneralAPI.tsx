import request from "../utils/request";

export interface CourseBrief {
  cid: number,
  name: string,
  cost: number,
  discount: number,
  category: number,
  content: string,
  starttime: number,
}

export interface CourseDetail {
  name: string,
  cost: number,
  discount: number,
  category: number,
  content: string,
  teacher: number,
  score: number,
  starttime: number,
  endtime: number,
}

export interface VideoTitle {
  vid: number,
  vname: string,
  previd: number,
  nextvid: number,
}

export interface Video {
  vid: number,
  vname: string,
  duration: number,
  url: string,
  previd: number,
  nextvid: number,
}

export interface ForeignBrief {
  username: string,
  sex: number,
  age: number,
  content: string,
  language: number,
  qualification: string,
  background: string,
  resume: string,
}

export interface ForeignDetail {
  username: string,
  name: string,
  sex: number,
  age: number,
  content: string,
  phone: string,
  language: number,
  qualification: string,
  background: string,
  resume: string,
}

export interface MailUser {
  category: number,
  id: number,
  username: string,
}

export interface MailEntity {
  category1: number,
  id1: number,
  category2: number,
  id2: number,
  time: number,
  content: string,
}

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
  getForeignBrief(body: {id: number}) : Promise<SimpleResponse & {data: ForeignBrief}> {
    return request("/user/foreign/brief", body, false);
  },
  getStudentDetail(body: {id: number}) : Promise<SimpleResponse & {data: {username: string, name: string, sex: number, age: number, language: number, level: number, target: number, content: string, phone: string}}> {
    return request("/user/student/detail", body);
  },
  getNativeDetail(body: {id: number}) : Promise<SimpleResponse & {data: {username: string, name: string, sex: number, age: number, content: string, phone: string, qualification: string, background: string, time: string, language: number}}> {
    return request("/user/native/detail", body);
  },
  getForeignDetail(body: {id: number}) : Promise<SimpleResponse & {data: ForeignDetail}> {
    return request("/user/foreign/detail", body);
  },
};

const CourseAPI = {
  getList() : Promise<SimpleResponse & {data: {courses: CourseBrief[]}}> {
    return request("/course/list", undefined, false);
  },
  getDetail(body: {id: number}) : Promise<SimpleResponse & {data: CourseDetail}> {
    return request("/course/detail", body, false);
  },
  getVideoTitle(body: {id: number}) : Promise<SimpleResponse & {data: {videos: VideoTitle[]}}> {
    return request("/course/videotitle", body, false);
  },
  getVideo(body: {id: number}) : Promise<SimpleResponse & {data: {videos: Video[]}}> {
    return request("/course/video", body);
  },
};

const MailAPI = {
  to(body: {category: number, id: number, content: string}) : Promise<SimpleResponse> {
    return request("/mail/to", body);
  },
  getList() : Promise<SimpleResponse & {data: {users: MailUser[]}}> {
    return request("/mail/list");
  },
  getMail(body: {category: number, id: number}) : Promise<SimpleResponse & {data: {mails: MailEntity[]}}> {
    return request("/mail/get", body);
  },
};

const BillAPI = {
  get(body: {money: number}) : Promise<SimpleResponse> {
    return request("/bill/get", body);
  },
  pay(body: {money: number}) : Promise<SimpleResponse & {data: {qrcode: string}}> {
    return request("/bill/pay", body);
  },
  balance() : Promise<SimpleResponse & {data: {balance: number}}> {
    return request("/bill/balance");
  },
  list() : Promise<SimpleResponse & {data: {bills: {id: number, createtime: number, money: number, type: number, status: number, content: string}[]}}> {
    return request("/bill/list");
  },
};

const GeneralAPI = {user: UserAPI, course: CourseAPI, mail: MailAPI, bill: BillAPI};

export default GeneralAPI;