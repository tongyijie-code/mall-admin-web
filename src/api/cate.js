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
export function addCateItem(data) {
    return request({
        url: 'categories',
        method: 'post',
        data
    })
}
export function getCateAttr(id, params) {
    return request({
        url: 'categories/'+ id + '/attributes',
        method: 'get',
        params
    })
}
export function submitParams(id, data) {
    return request({
        url: 'categories/'+ id +'/attributes',
        method: 'post',
        data

    })
}
export function queryParams(id, attrId, params) {
    return request({
        url: 'categories/'+ id +'/attributes/'+ attrId,
        method: 'get',
        params
    })
}
export function editParamsData(id,attrId, data) {
    return request({
        url: 'categories/'+ id +'/attributes/' + attrId,
        method: 'put',
        data
    })
}
export function remove(id, attrid) {
    return request({
        url: 'categories/'+ id + '/attributes/' + attrid,
        method: 'delete'
    })
}
// 编辑提交参数
export function editSubmitParams(id, attrId, data) {
    return request({
        url: 'categories/'+id+'/attributes/'+attrId,
        method: 'put',
        data
    })
}