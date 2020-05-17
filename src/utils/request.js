import axios from 'axios'
import setting from "@/config/setting";
import { Message } from "element-ui";

export default function request(config) {
    const instance = new axios.create({
        baseURL: setting.baseUrl,
        timeout: 50000
    })

    instance.interceptors.request.use(config => {
        config.headers.Authorization = window.sessionStorage.getItem('token')
        return config
    }, error => {
        console.log(error)
    })

    instance.interceptors.response.use(res => {
        const { status, msg } = res.data.meta
        // console.log(res)
        if ([200, 201, 204].includes(status)) {
            return res.data
        } else {
            Message({
                // type: 'error',
                message: msg
            })
        }
    },error => {
        console.log(error)
    })

    return instance(config)
}
