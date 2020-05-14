import axios from 'axios'

export default function request(config) {
    const instance = new axios.create({
        baseURL: 'http://127.0.0.1:8888/api/private/v1/',
        timeout: 50000
    })

    instance.interceptors.request.use(config => {
        return config
    }, error => {
        console.log(error)
    })
    instance.interceptors.response.use(res => {
        return res.data
    },error => {
        console.log(error)
    })

    return instance(config)
}