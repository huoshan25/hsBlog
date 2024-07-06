import {fetchRequest} from "~/composables/http/useFetchRequest";
import type {loginReq, loginReqRes, registerReq, registerReqRes} from "~/api/user/type";

/**
 * 接口url枚举
 */
enum API {
  LOGIN = '/user/login',
  REGISTER = '/user/register',
}

/**
 * 登录接口
 * @param params
 */
export async function getLogin(params: loginReq) {
  return await fetchRequest.post<loginReqRes>(API.LOGIN, params);
}

/**
 * 注册接口
 * @param params
 */
export async function getRegister(params: registerReq) {
  return await fetchRequest.post<registerReqRes>(API.REGISTER, params);
}