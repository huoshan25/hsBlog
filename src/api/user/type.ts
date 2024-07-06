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

export interface registerReq extends loginReq{
}

export interface registerReqRes extends loginReqRes{
}