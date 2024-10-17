export interface loginReq {
  /**用户名*/
  username: string
  /**密码*/
  password: string
}

export interface loginReqRes {
  token: string
  refresh_token: string
}

export interface registerReq extends loginReq{
  confirmPassword: string
}

export interface registerReqRes extends loginReqRes{
}