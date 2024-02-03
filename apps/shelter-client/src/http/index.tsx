import axios from 'axios'
import config from '../config'


const host = axios.create({baseURL: config.baseURL, timeout: config.timeout})


const registration = async (email: string, password: string) => {
    const {data} = await host.post('/api/users/', {email, password})
    // localStorage.setItem('token', data.token)
    // return jwt_decode(data.token)
}


