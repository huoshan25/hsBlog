// api/staff.ts

import httpRequest from "~/service";

/**
 * @description 分页查询员工数据
 * @return 员工信息
 */

const URL = "/staff";
const getStaffInfoByPage = (params: any) => {
  return httpRequest.get(URL, params);
};

/**
 * @description 修改员工数据
 * @param {any} data
 * @returns {any}
 */
const updateStaffInfo = (data: any) => {
  return httpRequest.post(URL, data);
};

export { getStaffInfoByPage, updateStaffInfo };