import axios from "axios";
import { isUndefined } from "util";
import store from "../store";

export const server = "https://mockapi.eolinker.com/xst28TE9fd8c9df6f852cffd7f835a68febaceb5100bc4d";

const withToken = (body : {} | undefined) => {
  if (isUndefined(body)) body = {};
  const { token } = store.getState().UserReducer.session;
  if (!token) return body;
  return {...body, token: token};
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
