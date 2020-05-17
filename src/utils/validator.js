//验证邮箱是否正确
export const isEmail = function (value) {
    const regEmail = /^([0-9a-z-A-Z_-])+@([0-9a-z-A-Z_-])+(\.[0-9a-z-A-Z_-])+/
   return regEmail.test(value)
}
//验证手机号
export const isMobile = function (value) {
    const regMobile = /^1[0-9]{10}$/
    return regMobile.test(value)
}