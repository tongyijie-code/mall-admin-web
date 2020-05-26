import request from "../utils/request";
//获取商品分类的数据
export function getCateDate(params) {
    return request({
        url: 'categories',
        method: 'get',
        params
    })
}
//添加分类
export function addCate(data) {
    return request({
        url: 'categories',
        method: 'post',
        data
    })
}
