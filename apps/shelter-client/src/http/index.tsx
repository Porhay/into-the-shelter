import axios from 'axios'
import * as config from '../config'
import { UserState } from '../redux/reducers/userSlice'

const gatewayHost = axios.create({ baseURL: config.gatewayUrl, timeout: config.timeout })
const accountsHost = axios.create({ baseURL: config.accountsUrl, timeout: config.timeout })


export const getUserRequest = async (userId: string) => {
    try {
        const user = await accountsHost.get(`/api/users/${userId}/`)
        return user.data
    } catch (error) {
        console.log('Error while getting user', error);
    }
}

export const updateUserRequest = async (userId: string | undefined, data: any) => {
    try {
        const user = await accountsHost.post(`/api/users/${userId}/`, data)
        return user.data
    } catch (error) {
        console.log('Error while getting user', error);
    }
}

export const updateBackground = async () => {
    try {
        const response = await fetch(`${config.gatewayUrl}/uploads/update-background`, { method: 'POST' }) // TODO: update to axios
        const buffer = await response.arrayBuffer()
        const blob = new Blob([buffer]);
        const url = URL.createObjectURL(blob);
        return url
    } catch (error) {
        console.error('Error fetching file:', error);
    }
}
