import type {HttpOption} from "~/composables/http/useHttp";

enum API {
  LOGIN = '/user/login',
}

export interface loginReq {
  /**用户名*/
  username: string
  /**密码*/
  password: string | number
}

export interface loginReqRes {
  code: number
  message: string
}

/**
 * 登录接口
 * @param params
 * @param option
 */
export async function getLogin(params?: loginReq, option?: HttpOption<loginReqRes>) {
  return useHttp.get<loginReqRes>(API.LOGIN, params, {...option});
}