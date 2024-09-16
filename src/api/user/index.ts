import {fetchRequest} from "~/composables/http/useFetchRequest";
import type {loginReq, loginReqRes, registerReq, registerReqRes} from "~/api/user/type";
import type {HttpRes} from "~/api/type";

/**
 * 登录接口
 * @param params
 */
export async function getLogin(params: loginReq) {
  return await fetchRequest.post<HttpRes<loginReqRes>>('/user/login', params);
}

/**
 * 注册接口
 * @param params
 */
export async function getRegister(params: registerReq) {
  return await fetchRequest.post<HttpRes<registerReqRes>>('/user/register', params);
}