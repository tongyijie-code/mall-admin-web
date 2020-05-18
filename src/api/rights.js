import request from "../utils/request";
//获取所有的权限
export function getRightsListData(type) {
    return request({
        url: 'rights/'+ type,
        method: 'get'
    })
}
//获取角色数据
export function getRolesListData() {
    return request({
        url: 'roles',
        method: 'get'
    })
}
//删除角色指定权限
export function removeRights(roleId, rightId) {
    return request({
        url: 'roles/'+ roleId+ '/rights/'+ rightId,
        method: 'delete'
    })
}
//角色授权
export function addRights(roleId,Rid) {
    return request({
        url:'roles/' + roleId + '/rights',
        method: 'post',
        data: {
            rids: Rid
        }
    })
}
//编辑提交角色
export function editUserRole(roleId, data) {
    return request({
        url: 'roles/'+ roleId,
        method: 'put',
        data
    })
}
//删除角色
export function deleteRoleById(roleId) {
    return request({
        url: 'roles/' + roleId,
        method: 'delete'
    })
}