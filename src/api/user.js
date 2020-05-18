import axios from 'axios'
import request from '@/utils/request'
import setting from "@/config/setting";
//
// export function login(data) {
//     return axios.post('login', data,{
//         baseURL: setting.baseUrl
//     })
// }
// //
export function login(data) {
    return axios({
        baseURL: setting.baseUrl,
        url: 'login',
        method: 'post',
        data
    })
}
export function getMenuList() {
    return request({
        url: 'menus',
        method: 'get',

    })
}
export function getUserList(data) {
    return request({
        url: 'users',
        method: 'get',
        params: data
    })
}

export function changeStatus(url) {
    return request({
        url: url,
        method: 'put'
    })
}
//添加用户
export function addUserInfo(data) {
    return request({
        url: 'users',
        method: 'post',
        data
    })
}
// 根据 ID 查询用户信息
export function getUserById(id) {
    return request({
        url: 'users/'+id,
        method: 'get',
    })

}
export function commitEdit(id, data) {
    return request({
        url: 'users/'+id,
        method: 'put',
        data
    })
}
//删除用户
export function removeUser(id) {
    return request({
        url: 'users/'+ id,
        method: 'delete'
    })
}
//分配用户角色
export function setUserRole(id, Rid) {
    return request({
        url: 'users/'+ id + '/role',
        method: 'put',
        data: {
            rid: Rid
        }
    })
}
// export function queryUserById(userId) {
//     return request({
//         url: 'login',
//         method: 'get',
//         params: { userId }
//     })
// }