import request from '@/utils/request'

export function getGoodsListData(params) {
  return request({
    url: 'goods',
    method: 'get',
    params
  })
}