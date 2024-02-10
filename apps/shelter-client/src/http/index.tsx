import axios from 'axios'
import config from '../config'


const host = axios.create({ baseURL: config.baseURL, timeout: config.timeout })


const registration = async (email: string, password: string) => {
    const { data } = await host.post('/api/users/', { email, password })
    // localStorage.setItem('token', data.token)
    // return jwt_decode(data.token)
}


export const updateBackground = async () => {
    try {
        const response = await fetch('http://localhost:8000/uploads/update-background', {method: 'POST'}) // TODO: update to axios
        const buffer = await response.arrayBuffer()
        const blob = new Blob( [ buffer ] );
        const url = URL.createObjectURL( blob );
        return url
    } catch (error) {
        console.error('Error fetching file:', error);
    }
}
