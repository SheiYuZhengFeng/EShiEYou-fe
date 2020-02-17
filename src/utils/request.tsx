import axios from "axios";
import { isUndefined } from "util";

export interface SimpleResponse {
  code: number,
  data: {},
}

const server = "https://mockapi.eolinker.com/xst28TE9fd8c9df6f852cffd7f835a68febaceb5100bc4d/user/logout";

const withToken = (body : {} | undefined) => {
  if (isUndefined(body)) body = {};
  if (!window.localStorage.token) return body;
  return {...body, token: window.localStorage.token};
}

export default async function request(url : string, body ?: {}, token = true) : Promise<SimpleResponse> {
  if (token) body = withToken(body);
  return await axios({
    method: "POST",
    headers: { "Content-type": "application/json" },
    url: server + url,
    data: body,
    withCredentials: true,
  }).then(res => {
    return res.data;
  }).catch(error => {
    console.log(error);
  });
}