import request from "../utils/request";
/**
 * 查询订单列表
 * @param {*} type 
 */
export function queryOrderList(params) {
    return request({
        url: 'orders',
        method: 'get',
        params
        
    })
}

export function queryOrderByID(id) {
  return request({
      url: 'orders/'+ id,
      method: 'get',     
  })
}


export function queryExpressByID(id) {
  return request({
      url: '/kuaidi/'+ id,
      method: 'get',     
  })
}
