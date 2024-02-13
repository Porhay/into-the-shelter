import axios from 'axios'
import config from '../config'

const gatewayHost = axios.create({ baseURL: config.gatewayUrl, timeout: config.timeout })
const accountsHost = axios.create({ baseURL: config.accountsUrl, timeout: config.timeout })


export const getUser = async (userId: string) => await accountsHost.get(`/api/users/${userId}/`)

export const updateBackground = async () => {
    try {
        const response = await fetch('http://localhost:8000/uploads/update-background', { method: 'POST' }) // TODO: update to axios
        const buffer = await response.arrayBuffer()
        const blob = new Blob([buffer]);
        const url = URL.createObjectURL(blob);
        return url
    } catch (error) {
        console.error('Error fetching file:', error);
    }
}
